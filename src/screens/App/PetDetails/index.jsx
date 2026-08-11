import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Image,
  SafeAreaView, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Campo from '../../components/Campo';
import { Carregando, Erro } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import animalService, { primeiraFoto } from '../../../services/animalService';
import solicitacaoService from '../../../services/solicitacaoService';
import questionarioService from '../../../services/questionarioService';
import favoritos from '../../../services/favoritos';
import { mensagemDoErro } from '../../../services/http';
import { abrirWhatsapp } from '../../../services/whatsapp';
import perfilService from '../../../services/perfilService';
import DossieModal from './DossieModal';

// Ficha do pet + solicitação de adoção (RF07).
// A rota recebe `{ id }`; o dossiê do candidato (questionário + parecer da IA)
// é anexado pelo backend a partir do tutor_id do token — o app não envia nada disso.

const CORES_STATUS = {
  'Disponível': [t.badgeVerde, t.badgeVerdeTexto],
  'Em Triagem': [t.badgeAmbar, t.badgeAmbarTexto],
  'Adotado': [t.badgeAzul, t.badgeAzulTexto],
  'Desaparecido': [t.badgeVermelho, t.badgeVermelhoTexto],
};

// Valores aceitos pelo backend (CHECK da migração 001) — usados no editor do dono.
const ESPECIES = ['Cão', 'Gato'];
const PORTES = ['Pequeno', 'Médio', 'Grande'];

// Match sob demanda: cor e veredito a partir do score da dupla (0–100).
const corDoScore = (s) => (s >= 75 ? BRAND.success : s >= 55 ? BRAND.blue : BRAND.danger);
const vereditoDoScore = (s) =>
  s >= 75 ? 'Forte compatibilidade com o seu perfil!'
    : s >= 55 ? 'Boa compatibilidade, com alguns pontos de atenção.'
      : 'Compatibilidade baixa — vale avaliar com calma.';
// Resumo curto e AMIGÁVEL para o tutor. O relatório completo (match.relatorio)
// é o parecer para a ONG e NÃO deve ser mostrado ao tutor — aqui ele vê só isto.
const resumoTutor = (score, pet) => {
  const nome = pet?.nome || 'esse pet';
  const tracos = [pet?.porte, pet?.especie, pet?.temperamento].filter(Boolean).join(' · ');
  const base = tracos ? ` ${nome} é ${tracos.toLowerCase()}.` : '';
  if (score >= 75) return `Vocês combinam muito!${base} O perfil dele tem tudo a ver com a sua rotina e as suas preferências.`;
  if (score >= 55) return `Boa combinação!${base} Ele se encaixa no seu perfil — só fique atento a alguns detalhes do dia a dia.`;
  return `A compatibilidade ficou mais baixa.${base} Pode pedir ajustes de rotina ou espaço — vale conversar com a ONG antes de decidir.`;
};

const PetDetailsScreen = ({ navigation, route }) => {
  const id = route?.params?.id;

  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);
  const [dossieAberto, setDossieAberto] = useState(false);

  const { dados: pet, carregando, erro, recarregar } = useCarregar(
    () => animalService.buscarPorId(id),
    { deps: [id] }
  );

  // Duas condições decidem se o botão de adotar existe:
  //  1. questionário respondido — é o dossiê que a ONG analisa; sem ele a
  //     solicitação chega vazia e não há como avaliar;
  //  2. não haver solicitação anterior para ESTE pet — o backend já barra com
  //     400 (unique tutor+animal), mas deixar o botão ativo só para levar erro
  //     é uma armadilha.
  const contexto = useCarregar(
    async () => {
      const [respondeu, minhas] = await Promise.all([
        questionarioService.jaRespondeu(),
        solicitacaoService.minhas().catch(() => []),
      ]);
      const jaPediu = (minhas || []).some((s) => String(s.animal_id) === String(id));
      const pedido = (minhas || []).find((s) => String(s.animal_id) === String(id));
      return { respondeu, jaPediu, statusPedido: pedido?.status ?? null };
    },
    { inicial: { respondeu: true, jaPediu: false, statusPedido: null }, deps: [id] }
  );

  const { respondeu, jaPediu, statusPedido } = contexto.dados || {};

  const [favorito, setFavorito] = useState(false);
  useEffect(() => {
    let vivo = true;
    favoritos.ehFavorito(id).then((v) => { if (vivo) setFavorito(v); });
    return () => { vivo = false; };
  }, [id]);

  // Quem sou eu — para saber se esta é a ficha do MEU pet (aí não há o que
  // "adotar"/"pedir"; a tela vira só a ficha, com atalho para "Meu Pet").
  const [meuId, setMeuId] = useState(null);
  useEffect(() => {
    let vivo = true;
    perfilService.obter().then((p) => { if (vivo) setMeuId(p?.id ?? null); }).catch(() => {});
    return () => { vivo = false; };
  }, []);
  const souDono = !!meuId && !!pet?.tutor_id && pet.tutor_id === meuId;

  // ---- Edição pela dona/dono (só nos pets do próprio tutor) ----
  const [erroEdicao, setErroEdicao] = useState(null);

  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const trocarFoto = async () => {
    setErroEdicao(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { setErroEdicao('Precisamos de acesso às suas fotos para enviar a imagem.'); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (r.canceled || !r.assets?.[0]) return;
    setEnviandoFoto(true);
    try { await animalService.adicionarFotoMeu(id, r.assets[0]); recarregar(); }
    catch (e) { setErroEdicao(mensagemDoErro(e, 'Não foi possível enviar a foto.')); }
    finally { setEnviandoFoto(false); }
  };

  // Editor "Sobre"
  const [sobreAberto, setSobreAberto] = useState(false);
  const [sobre, setSobre] = useState({ nome: '', especie: 'Cão', raca: '', porte: 'Médio', idade: '', temperamento: '' });
  const [salvandoSobre, setSalvandoSobre] = useState(false);
  const [erroSobre, setErroSobre] = useState(null);
  const semValor = (v) => (v && v !== 'Não informado' ? v : '');
  const abrirSobre = () => {
    setSobre({
      nome: pet.nome || '',
      especie: ESPECIES.includes(pet.especie) ? pet.especie : 'Cão',
      raca: semValor(pet.raca),
      porte: PORTES.includes(pet.porte) ? pet.porte : 'Médio',
      idade: semValor(pet.idade),
      temperamento: semValor(pet.temperamento),
    });
    setErroSobre(null);
    setSobreAberto(true);
  };
  const salvarSobre = async () => {
    if (!sobre.nome.trim()) { setErroSobre('Dê um nome ao pet.'); return; }
    setSalvandoSobre(true);
    setErroSobre(null);
    try {
      await animalService.atualizarMeu(id, {
        nome: sobre.nome.trim(),
        especie: sobre.especie,
        raca: sobre.raca.trim() || 'Não informado',
        porte: sobre.porte,
        idade: sobre.idade.trim() || 'Não informado',
        temperamento: sobre.temperamento.trim() || 'Não informado',
      });
      setSobreAberto(false);
      recarregar();
    } catch (e) { setErroSobre(mensagemDoErro(e, 'Não foi possível salvar.')); }
    finally { setSalvandoSobre(false); }
  };

  // Editor da carteira de vacinação
  const [vacAberto, setVacAberto] = useState(false);
  const [vacEdit, setVacEdit] = useState([]);
  const [novaVac, setNovaVac] = useState({ nome: '', data: '' });
  const [salvandoVac, setSalvandoVac] = useState(false);
  const [erroVac, setErroVac] = useState(null);
  const abrirVac = () => {
    const atuais = Array.isArray(pet.prontuario_vacinas) ? pet.prontuario_vacinas : [];
    setVacEdit(atuais.map((v) => ({ nome: v.nome ?? v.vacina ?? '', data: v.data ?? v.aplicada_em ?? '' })));
    setNovaVac({ nome: '', data: '' });
    setErroVac(null);
    setVacAberto(true);
  };
  const addVac = () => {
    if (!novaVac.nome.trim()) { setErroVac('Informe o nome da vacina.'); return; }
    setVacEdit((l) => [...l, { nome: novaVac.nome.trim(), data: novaVac.data.trim() }]);
    setNovaVac({ nome: '', data: '' });
    setErroVac(null);
  };
  const rmVac = (i) => setVacEdit((l) => l.filter((_, idx) => idx !== i));
  const salvarVac = async () => {
    setSalvandoVac(true);
    setErroVac(null);
    try { await animalService.atualizarVacinasMeu(id, vacEdit); setVacAberto(false); recarregar(); }
    catch (e) { setErroVac(mensagemDoErro(e, 'Não foi possível salvar a carteira.')); }
    finally { setSalvandoVac(false); }
  };

  const alternarFavorito = async () => setFavorito(await favoritos.alternar(id));

  // Match sob demanda: a % não aparece na vitrine; aqui o tutor a revela com
  // "Ver match". Fica salva (o backend reusa na adoção). Ao abrir a ficha,
  // busca um match já calculado antes.
  const [match, setMatch] = useState(null);
  const [carregandoMatch, setCarregandoMatch] = useState(false);
  const [erroMatch, setErroMatch] = useState(null);
  const [mostrarParecer, setMostrarParecer] = useState(false);

  useEffect(() => {
    let vivo = true;
    animalService.obterMatch(id)
      .then((m) => { if (vivo && m?.existe) setMatch({ score: m.score, relatorio: m.relatorio, via: m.via }); })
      .catch(() => {});
    return () => { vivo = false; };
  }, [id]);

  const verMatch = async () => {
    setCarregandoMatch(true);
    setErroMatch(null);
    try {
      setMatch(await animalService.verMatch(id));
    } catch (e) {
      setErroMatch(mensagemDoErro(e, 'Não foi possível calcular o match agora.'));
    } finally {
      setCarregandoMatch(false);
    }
  };

  const solicitar = async () => {
    setEnviando(true);
    setErroEnvio(null);
    try {
      await solicitacaoService.criar(id, mensagem);
      setSucesso(true);
      setMensagem('');
    } catch (e) {
      // Dossiê incompleto: o backend barra com esse código. Em vez de erro,
      // abrimos o formulário de adotante; ao concluir, a candidatura é reenviada.
      if (e?.response?.data?.code === 'dossie-incompleto') {
        setDossieAberto(true);
      } else {
        setErroEnvio(mensagemDoErro(e, 'Não foi possível enviar sua solicitação.'));
      }
    } finally {
      setEnviando(false);
    }
  };

  // Chamado quando o tutor conclui o cadastro de adotante: fecha o modal e
  // reenvia a candidatura (agora o dossiê está completo).
  const aposDossie = async () => {
    setDossieAberto(false);
    await solicitar();
  };

  // Contato direto por WhatsApp com a ONG responsável (aparece quando a
  // candidatura foi aceita, para combinar a entrega).
  const falarComOng = () =>
    abrirWhatsapp(
      pet?.ong?.whatsapp,
      `Olá! Minha candidatura para adotar o ${pet?.nome ?? 'pet'} foi aceita no app Nima. Podemos combinar a entrega?`
    );

  const topo = () => (
    <View style={t.cabecalho}>
      <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
      </TouchableOpacity>
      <Text style={[t.cardTitulo, { fontSize: 16 }]}>Ficha do pet</Text>
      <TouchableOpacity style={[t.voltar, { marginLeft: 'auto' }]} onPress={alternarFavorito}>
        <Ionicons
          name={favorito ? 'heart' : 'heart-outline'}
          size={20}
          color={favorito ? BRAND.danger : BRAND.ink}
        />
      </TouchableOpacity>
    </View>
  );

  if (!id) {
    return (
      <SafeAreaView style={t.tela}>
        {topo()}
        <Erro mensagem="Pet não informado." onTentarDeNovo={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  if (carregando && !pet) {
    return (
      <SafeAreaView style={t.tela}>
        <StatusBar barStyle="dark-content" />
        {topo()}
        <Carregando texto="Abrindo a ficha…" />
      </SafeAreaView>
    );
  }

  if (erro || !pet) {
    return (
      <SafeAreaView style={t.tela}>
        <StatusBar barStyle="dark-content" />
        {topo()}
        <Erro mensagem={erro ?? 'Pet não encontrado.'} onTentarDeNovo={recarregar} />
      </SafeAreaView>
    );
  }

  const foto = primeiraFoto(pet);
  const vacinas = Array.isArray(pet.prontuario_vacinas) ? pet.prontuario_vacinas : [];
  const [badgeEstilo, badgeTexto] = CORES_STATUS[pet.status_posse] ?? [t.badgeAzul, t.badgeAzulTexto];
  const adotado = pet.status_posse === 'Adotado';
  const bloqueado = adotado || jaPediu || !respondeu;
  const podeSolicitar = !bloqueado && !sucesso;

  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={t.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={t.conteudoSemBarra}>
          {topo()}

          <View style={{ marginHorizontal: PAD, marginTop: 14, borderRadius: 22, overflow: 'hidden' }}>
            <TouchableOpacity
              activeOpacity={souDono ? 0.85 : 1}
              onPress={souDono ? trocarFoto : undefined}
              disabled={!souDono || enviandoFoto}
            >
              {foto ? (
                <Image source={{ uri: foto }} style={{ width: '100%', height: 240 }} />
              ) : (
                <View style={{ width: '100%', height: 240, backgroundColor: '#E7EEFB', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Ionicons name="paw" size={48} color={BRAND.blue} />
                  <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 13, color: BRAND.blue }}>
                    Sem foto cadastrada
                  </Text>
                </View>
              )}
              {souDono ? (
                <View style={{ position: 'absolute', right: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(1,81,200,0.92)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 }}>
                  {enviandoFoto ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="camera" size={15} color="#fff" />}
                  <Text style={{ color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 12.5 }}>{foto ? 'Trocar foto' : 'Adicionar foto'}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>

          <Text style={t.titulo}>{pet.nome}</Text>
          <View style={{ marginHorizontal: PAD, marginTop: 8, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={[t.badge, badgeEstilo]}>
              <Text style={[t.badgeTexto, badgeTexto]}>{pet.status_posse}</Text>
            </View>
            {/* A % de compatibilidade não aparece aqui — o tutor a revela no
                card "Seu match" logo abaixo. */}
          </View>

          {erroEdicao ? (
            <View style={[t.faixaErro, { marginTop: 12 }]}>
              <Ionicons name="alert-circle" size={20} color={BRAND.danger} />
              <Text style={t.faixaErroTexto}>{erroEdicao}</Text>
            </View>
          ) : null}

          <View style={t.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[t.cardTitulo, { flex: 1 }]}>Sobre o {pet.nome}</Text>
              {souDono ? (
                <TouchableOpacity onPress={abrirSobre} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="create-outline" size={17} color={BRAND.blue} />
                  <Text style={{ color: BRAND.blue, fontFamily: 'Nunito_700Bold', fontSize: 13 }}>Editar</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Grade 2 colunas: rótulo pequeno em cima, valor em destaque embaixo
                — mais legível que valor jogado no canto direito. */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, marginHorizontal: -6 }}>
              {[
                ['paw-outline', 'Espécie', pet.especie],
                ['ribbon-outline', 'Raça', pet.raca],
                ['resize-outline', 'Porte', pet.porte],
                ['calendar-outline', 'Idade', pet.idade],
              ]
                .filter(([, , valor]) => !!valor)
                .map(([icone, rotulo, valor]) => (
                  <View key={rotulo} style={{ width: '50%', paddingHorizontal: 6, marginBottom: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Ionicons name={icone} size={14} color={BRAND.inkSoft} />
                      <Text style={{ fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: BRAND.inkSoft }}>{rotulo}</Text>
                    </View>
                    <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 15, color: BRAND.ink, marginTop: 2 }}>{valor}</Text>
                  </View>
                ))}
            </View>

            {pet.temperamento ? (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Ionicons name="happy-outline" size={14} color={BRAND.inkSoft} />
                  <Text style={{ fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: BRAND.inkSoft }}>Temperamento</Text>
                </View>
                <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 15, color: BRAND.ink, marginTop: 2, lineHeight: 21 }}>{pet.temperamento}</Text>
              </View>
            ) : null}
          </View>

          {/* Seu match — só quando dá para adotar (pet disponível) e o tutor já
              respondeu o questionário. Não aparece na ficha do próprio pet. */}
          {!adotado && respondeu && !souDono ? (
            <View style={t.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="sparkles" size={18} color={BRAND.blue} />
                <Text style={t.cardTitulo}>Seu match com o {pet.nome}</Text>
              </View>

              {match ? (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 }}>
                    <Text style={{ fontSize: 40, fontFamily: 'Nunito_800ExtraBold', color: corDoScore(match.score) }}>
                      {match.score}%
                    </Text>
                    <Text style={{ flex: 1, fontSize: 13.5, color: BRAND.ink, fontFamily: 'Nunito_600SemiBold', lineHeight: 19 }}>
                      {vereditoDoScore(match.score)}
                    </Text>
                  </View>
                  <Text style={[t.cardTexto, { marginTop: 10 }]}>{resumoTutor(match.score, pet)}</Text>
                </>
              ) : (
                <>
                  <Text style={[t.cardTexto, { marginTop: 6 }]}>
                    Descubra o quanto o seu perfil combina com o {pet.nome}. A nota fica salva e vai
                    junto quando você pedir a adoção.
                  </Text>
                  {erroMatch ? (
                    <Text style={[t.cardTexto, { color: BRAND.danger, marginTop: 8 }]}>{erroMatch}</Text>
                  ) : null}
                  <TouchableOpacity
                    style={[t.botaoSecundario, { marginTop: 12 }]}
                    activeOpacity={0.85}
                    onPress={verMatch}
                    disabled={carregandoMatch}
                  >
                    {carregandoMatch ? (
                      <ActivityIndicator color={BRAND.blue} />
                    ) : (
                      <>
                        <Ionicons name="sparkles-outline" size={18} color={BRAND.blue} />
                        <Text style={t.botaoSecundarioTexto}>Ver meu match</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : null}

          <View style={t.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[t.cardTitulo, { flex: 1 }]}>Carteira de vacinação</Text>
              {souDono ? (
                <TouchableOpacity onPress={abrirVac} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="create-outline" size={17} color={BRAND.blue} />
                  <Text style={{ color: BRAND.blue, fontFamily: 'Nunito_700Bold', fontSize: 13 }}>Editar</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {vacinas.length === 0 ? (
              <Text style={[t.cardTexto, { marginTop: 8 }]}>
                {souDono ? 'Toque em "Editar" para registrar as vacinas do seu pet.' : 'Nenhuma vacina registrada pela ONG até agora.'}
              </Text>
            ) : (
              vacinas.map((v, i) => (
                <View key={`${v.nome ?? 'vacina'}-${i}`} style={t.cardLinha}>
                  <Ionicons name="shield-checkmark" size={17} color={BRAND.success} />
                  <Text style={t.cardLinhaTexto}>{v.nome ?? v.vacina ?? 'Vacina'}</Text>
                  <Text style={[t.cardLinhaTexto, { flex: 0, color: BRAND.inkSoft }]}>
                    {v.data ?? v.aplicada_em ?? ''}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Contato do dono só aparece quando o pet tem dono cadastrado (antiperda). */}
          {pet.dono_nome || pet.dono_telefone ? (
            <View style={t.card}>
              <Text style={t.cardTitulo}>Responsável</Text>
              {pet.dono_nome ? (
                <View style={t.cardLinha}>
                  <Ionicons name="person-outline" size={17} color={BRAND.inkSoft} />
                  <Text style={t.cardLinhaTexto}>{pet.dono_nome}</Text>
                </View>
              ) : null}
              {pet.dono_telefone ? (
                <View style={t.cardLinha}>
                  <Ionicons name="call-outline" size={17} color={BRAND.inkSoft} />
                  <Text style={t.cardLinhaTexto}>{pet.dono_telefone}</Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* ONG responsável — para o tutor conhecer o perfil da ONG. */}
          {pet.ong?.nome ? (
            <View style={t.card}>
              <Text style={t.cardTitulo}>ONG responsável</Text>
              <View style={t.cardLinha}>
                <Ionicons name="business-outline" size={17} color={BRAND.inkSoft} />
                <Text style={t.cardLinhaTexto}>{pet.ong.nome}</Text>
              </View>
              {pet.ong.endereco ? (
                <View style={t.cardLinha}>
                  <Ionicons name="location-outline" size={17} color={BRAND.inkSoft} />
                  <Text style={t.cardLinhaTexto}>{pet.ong.endereco}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={[t.botaoSecundario, { marginTop: 12 }]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Ongs')}
              >
                <Ionicons name="business-outline" size={18} color={BRAND.blue} />
                <Text style={t.botaoSecundarioTexto}>Conhecer a ONG</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {souDono ? (
            <View style={[t.card, { backgroundColor: '#EDF3FE', borderColor: '#D6E3FA', marginTop: 18 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="paw" size={19} color={BRAND.blue} />
                <Text style={[t.cardTitulo, { fontSize: 15.5 }]}>Este é o seu pet</Text>
              </View>
              <Text style={t.cardTexto}>Você acompanha tudo do {pet.nome} em "Meu Pet".</Text>
              <TouchableOpacity
                style={[t.botaoSecundario, { marginTop: 14 }]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('MyPet')}
              >
                <Ionicons name="paw-outline" size={18} color={BRAND.blue} />
                <Text style={t.botaoSecundarioTexto}>Ver em Meu Pet</Text>
              </TouchableOpacity>
            </View>
          ) : sucesso ? (
            <View style={t.faixaSucesso}>
              <Ionicons name="checkmark-circle" size={20} color={BRAND.success} />
              <Text style={t.faixaSucessoTexto}>
                Solicitação enviada! A ONG vai analisar seu perfil e responder. Acompanhe em "Minhas adoções".
              </Text>
            </View>
          ) : jaPediu ? (
            <View style={[t.card, { backgroundColor: '#EDF3FE', borderColor: '#D6E3FA', marginTop: 18 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons
                  name={statusPedido === 'entregue' ? 'checkmark-circle' : statusPedido === 'aprovada' ? 'heart-circle' : 'clipboard'}
                  size={19}
                  color={statusPedido === 'entregue' ? BRAND.success : BRAND.blue}
                />
                <Text style={[t.cardTitulo, { fontSize: 15.5 }]}>
                  {statusPedido === 'entregue'
                    ? `O ${pet.nome} agora é seu! 🎉`
                    : statusPedido === 'aprovada'
                      ? 'Sua adoção foi aceita!'
                      : 'Você já pediu este pet'}
                </Text>
              </View>
              <Text style={t.cardTexto}>
                {statusPedido === 'pendente'
                  ? 'Sua solicitação está em análise pela ONG. Não é preciso pedir de novo.'
                  : statusPedido === 'aprovada'
                    ? 'A ONG vai combinar a entrega com você pelo WhatsApp — foto do local onde o pet vai ficar e um encontro. Fale com ela para adiantar.'
                    : statusPedido === 'entregue'
                      ? 'Adoção concluída! Cuide bem dele. Você acompanha tudo em "Meu Pet".'
                      : 'Esta solicitação não foi aprovada. Você pode conhecer outros pets disponíveis.'}
              </Text>

              {statusPedido === 'aprovada' && pet.ong?.whatsapp ? (
                <TouchableOpacity
                  style={[t.botao, { marginTop: 14, backgroundColor: '#25D366' }]}
                  activeOpacity={0.85}
                  onPress={falarComOng}
                >
                  <Ionicons name="logo-whatsapp" size={19} color="#fff" />
                  <Text style={t.botaoTexto}>Falar com a ONG no WhatsApp</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={[t.botaoSecundario, { marginTop: 12 }]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(statusPedido === 'entregue' ? 'MyPet' : 'Solicitacoes')}
              >
                <Ionicons name={statusPedido === 'entregue' ? 'paw-outline' : 'clipboard-outline'} size={18} color={BRAND.blue} />
                <Text style={t.botaoSecundarioTexto}>
                  {statusPedido === 'entregue' ? 'Ver em Meu Pet' : 'Ver minhas adoções'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : !respondeu && !adotado ? (
            <View style={[t.card, { backgroundColor: '#EDF3FE', borderColor: '#D6E3FA', marginTop: 18 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="sparkles" size={19} color={BRAND.blue} />
                <Text style={[t.cardTitulo, { fontSize: 15.5 }]}>Responda o questionário primeiro</Text>
              </View>
              <Text style={t.cardTexto}>
                São 5 etapas rápidas. É esse perfil que a ONG analisa para decidir a adoção —
                sem ele, não dá para enviar a solicitação.
              </Text>
              <TouchableOpacity
                style={[t.botao, { marginTop: 14 }]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Home', { abrirQuestionario: true })}
              >
                <Ionicons name="arrow-forward" size={18} color="#fff" />
                <Text style={t.botaoTexto}>Responder agora</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {erroEnvio ? (
            <View style={t.faixaErro}>
              <Ionicons name="alert-circle" size={20} color={BRAND.danger} />
              <Text style={t.faixaErroTexto}>{erroEnvio}</Text>
            </View>
          ) : null}

          {podeSolicitar ? (
            <View style={[t.card, { marginTop: 18 }]}>
              <Text style={t.rotulo}>Conte à ONG por que você quer adotar (opcional)</Text>
              <TextInput
                style={[t.campo, t.campoMultilinha]}
                placeholder="Ex.: moro em casa com quintal e tenho tempo para passeios diários…"
                placeholderTextColor={BRAND.inkSoft}
                multiline
                value={mensagem}
                onChangeText={setMensagem}
              />
              <Text style={[t.cardTexto, { marginTop: 10 }]}>
                Suas respostas do questionário vão junto automaticamente — a ONG vê o parecer completo.
              </Text>
            </View>
          ) : null}

          {/* "Quero adotar" fica POR ÚLTIMO na ficha (antes era rodapé fixo).
              Não aparece na ficha do próprio pet — o dono não adota o que já é dele. */}
          {souDono ? null : sucesso ? (
            <View style={{ paddingHorizontal: PAD, marginTop: 18 }}>
              <TouchableOpacity style={t.botao} activeOpacity={0.85} onPress={() => navigation.navigate('Solicitacoes')}>
                <Ionicons name="clipboard-outline" size={19} color="#fff" />
                <Text style={t.botaoTexto}>Ver minhas adoções</Text>
              </TouchableOpacity>
            </View>
          ) : bloqueado ? (
            <View style={{ paddingHorizontal: PAD, marginTop: 18 }}>
              <View style={[t.botao, t.botaoDesabilitado]}>
                <Text style={[t.botaoTexto, t.botaoTextoDesabilitado]}>
                  {adotado
                    ? 'Este pet já foi adotado'
                    : jaPediu
                      ? 'Solicitação já enviada'
                      : 'Responda o questionário para adotar'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ paddingHorizontal: PAD, marginTop: 18 }}>
              <TouchableOpacity
                style={[t.botao, enviando && t.botaoDesabilitado]}
                activeOpacity={0.85}
                onPress={solicitar}
                disabled={enviando}
              >
                {enviando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="heart" size={19} color="#fff" />
                    <Text style={t.botaoTexto}>Quero adotar o {pet.nome}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <DossieModal
        visivel={dossieAberto}
        nomePet={pet.nome}
        onFechar={() => setDossieAberto(false)}
        onCompleto={aposDossie}
      />

      {/* Editor "Sobre" — só o dono do pet. */}
      <Modal visible={sobreAberto} animationType="slide" onRequestClose={() => setSobreAberto(false)}>
        <SafeAreaView style={t.tela}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={t.cabecalho}>
              <TouchableOpacity style={t.voltar} onPress={() => setSobreAberto(false)} disabled={salvandoSobre}>
                <Ionicons name="close" size={20} color={BRAND.ink} />
              </TouchableOpacity>
              <Text style={[t.cardTitulo, { fontSize: 16 }]}>Editar dados do pet</Text>
            </View>
            <ScrollView style={t.scroll} contentContainerStyle={t.conteudoSemBarra} showsVerticalScrollIndicator={false}>
              <View style={{ paddingHorizontal: PAD, marginTop: 16, gap: 16 }}>
                <Campo rotulo="Nome" icone="paw-outline" placeholder="Ex.: Bento" value={sobre.nome} onChangeText={(v) => setSobre((s) => ({ ...s, nome: v }))} />

                <View>
                  <Text style={t.rotulo}>Espécie</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {ESPECIES.map((e) => {
                      const ativo = sobre.especie === e;
                      return (
                        <TouchableOpacity key={e} style={[t.botaoSecundario, { flex: 1 }, ativo && { backgroundColor: BRAND.blue, borderColor: BRAND.blue }]} activeOpacity={0.85} onPress={() => setSobre((s) => ({ ...s, especie: e }))}>
                          <Ionicons name="paw" size={17} color={ativo ? '#fff' : BRAND.blue} />
                          <Text style={[t.botaoSecundarioTexto, ativo && { color: '#fff' }]}>{e}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View>
                  <Text style={t.rotulo}>Porte</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {PORTES.map((p) => {
                      const ativo = sobre.porte === p;
                      return (
                        <TouchableOpacity key={p} style={[t.badge, ativo ? { backgroundColor: BRAND.blue } : t.badgeAzul, { paddingVertical: 11, paddingHorizontal: 16, flex: 1, justifyContent: 'center' }]} activeOpacity={0.85} onPress={() => setSobre((s) => ({ ...s, porte: p }))}>
                          <Text style={[t.badgeTexto, ativo ? { color: '#fff' } : t.badgeAzulTexto, { fontSize: 13.5 }]}>{p}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <Campo rotulo="Raça" icone="ribbon-outline" placeholder="Ex.: SRD, Golden Retriever…" value={sobre.raca} onChangeText={(v) => setSobre((s) => ({ ...s, raca: v }))} />
                <Campo rotulo="Idade" icone="calendar-outline" placeholder="Ex.: 2 anos" value={sobre.idade} onChangeText={(v) => setSobre((s) => ({ ...s, idade: v }))} />
                <Campo rotulo="Temperamento" placeholder="Ex.: brincalhão, calmo com crianças…" value={sobre.temperamento} onChangeText={(v) => setSobre((s) => ({ ...s, temperamento: v }))} multilinha />

                {erroSobre ? (
                  <View style={[t.faixaErro, { marginHorizontal: 0 }]}>
                    <Ionicons name="alert-circle" size={19} color={BRAND.danger} />
                    <Text style={t.faixaErroTexto}>{erroSobre}</Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>
            <View style={t.rodape}>
              <TouchableOpacity style={[t.botao, salvandoSobre && t.botaoDesabilitado]} activeOpacity={0.85} onPress={salvarSobre} disabled={salvandoSobre}>
                {salvandoSobre ? <ActivityIndicator color="#fff" /> : (<><Ionicons name="checkmark" size={19} color="#fff" /><Text style={t.botaoTexto}>Salvar</Text></>)}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Editor da carteira de vacinação — só o dono do pet. */}
      <Modal visible={vacAberto} animationType="slide" onRequestClose={() => setVacAberto(false)}>
        <SafeAreaView style={t.tela}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={t.cabecalho}>
              <TouchableOpacity style={t.voltar} onPress={() => setVacAberto(false)} disabled={salvandoVac}>
                <Ionicons name="close" size={20} color={BRAND.ink} />
              </TouchableOpacity>
              <Text style={[t.cardTitulo, { fontSize: 16 }]}>Carteira de vacinação</Text>
            </View>
            <ScrollView style={t.scroll} contentContainerStyle={t.conteudoSemBarra} showsVerticalScrollIndicator={false}>
              <View style={{ paddingHorizontal: PAD, marginTop: 16, gap: 10 }}>
                {vacEdit.length === 0 ? (
                  <Text style={t.cardTexto}>Nenhuma vacina na carteira ainda.</Text>
                ) : (
                  vacEdit.map((v, i) => (
                    <View key={`${v.nome}-${i}`} style={[t.card, { marginTop: 0, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                      <Ionicons name="shield-checkmark" size={20} color={BRAND.success} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14.5, color: BRAND.ink }}>{v.nome}</Text>
                        {v.data ? <Text style={{ fontFamily: 'Nunito_400Regular', fontSize: 12.5, color: BRAND.inkSoft }}>{v.data}</Text> : null}
                      </View>
                      <TouchableOpacity onPress={() => rmVac(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="trash-outline" size={19} color={BRAND.danger} />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
                <View style={[t.card, { marginTop: 6, gap: 12 }]}>
                  <Text style={t.rotulo}>Adicionar vacina</Text>
                  <Campo rotulo="Vacina" icone="shield-outline" placeholder="Ex.: V10, Antirrábica…" value={novaVac.nome} onChangeText={(v) => setNovaVac((n) => ({ ...n, nome: v }))} />
                  <Campo rotulo="Data (opcional)" icone="calendar-outline" placeholder="Ex.: 07/2026" value={novaVac.data} onChangeText={(v) => setNovaVac((n) => ({ ...n, data: v }))} />
                  <TouchableOpacity style={t.botaoSecundario} activeOpacity={0.85} onPress={addVac}>
                    <Ionicons name="add" size={18} color={BRAND.blue} />
                    <Text style={t.botaoSecundarioTexto}>Adicionar à carteira</Text>
                  </TouchableOpacity>
                </View>
                {erroVac ? (
                  <View style={[t.faixaErro, { marginHorizontal: 0 }]}>
                    <Ionicons name="alert-circle" size={19} color={BRAND.danger} />
                    <Text style={t.faixaErroTexto}>{erroVac}</Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>
            <View style={t.rodape}>
              <TouchableOpacity style={[t.botao, salvandoVac && t.botaoDesabilitado]} activeOpacity={0.85} onPress={salvarVac} disabled={salvandoVac}>
                {salvandoVac ? <ActivityIndicator color="#fff" /> : (<><Ionicons name="checkmark" size={19} color="#fff" /><Text style={t.botaoTexto}>Salvar carteira</Text></>)}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default PetDetailsScreen;
