import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar,
  Modal, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import Campo from '../../components/Campo';
import { Carregando, Erro, Vazio } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import solicitacaoService from '../../../services/solicitacaoService';
import animalService, { primeiraFoto } from '../../../services/animalService';
import { statusDoErro, mensagemDoErro } from '../../../services/http';

// Meu Pet — junta DUAS fontes, porque o banco não tem uma consulta única:
//   1. pets ADOTADOS  → GET /solicitacoes/minhas (status aprovada → animal);
//      desde a migração 016 a aprovação transfere a posse (tutor_id), mas a
//      solicitação segue sendo o caminho mais direto para listá-los;
//   2. pets REGISTRADOS pelo tutor → GET /animais/meus (tutor_id = eu).
//
// A Patinha é tag NFC passiva: sem bateria e sem GPS contínuo. O card mostra a
// ÚLTIMA LEITURA registrada, não rastreamento ao vivo.

// O CHECK de `animais.especie` aceita SÓ estes dois valores (migração 001).
const ESPECIES = ['Cão', 'Gato'];
const PORTES = ['Pequeno', 'Médio', 'Grande'];

const formatarData = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const localDaLeitura = (l) =>
  l.latitude != null && l.longitude != null
    ? `${Number(l.latitude).toFixed(4)}, ${Number(l.longitude).toFixed(4)}`
    : 'Local não informado';

const MyPetScreen = ({ navigation }) => {
  const [indice, setIndice] = useState(0);
  const [formAberto, setFormAberto] = useState(false);

  const dados = useCarregar(
    async () => {
      // Uma falha não pode derrubar a outra: quem não tem pet registrado
      // ainda precisa ver o adotado, e vice-versa.
      const [adotados, registrados] = await Promise.all([
        solicitacaoService.meusPets().catch(() => []),
        animalService.meus().catch(() => []),
      ]);
      // Um pet adotado já transferido aparece nas duas listas — desduplica.
      const vistos = new Set();
      const juntos = [];
      for (const p of [...registrados, ...adotados]) {
        const chave = String(p.id);
        if (vistos.has(chave)) continue;
        vistos.add(chave);
        juntos.push(p);
      }
      return juntos;
    },
    { inicial: [] }
  );

  const lista = dados.dados || [];
  const pet = lista[indice] ?? null;

  useEffect(() => {
    if (indice > 0 && indice >= lista.length) setIndice(0);
  }, [lista.length, indice]);

  // ---- Leituras da Patinha ----
  const [leituras, setLeituras] = useState([]);
  const [leiturasBloqueadas, setLeiturasBloqueadas] = useState(false);

  useEffect(() => {
    let ativo = true;
    setLeituras([]);
    setLeiturasBloqueadas(false);
    if (!pet?.id) return undefined;

    animalService
      .leituras(pet.id)
      .then((d) => { if (ativo) setLeituras(d || []); })
      .catch((e) => { if (ativo && statusDoErro(e) === 403) setLeiturasBloqueadas(true); });

    return () => { ativo = false; };
  }, [pet?.id]);

  const vacinas = useMemo(
    () => (Array.isArray(pet?.prontuario_vacinas) ? pet.prontuario_vacinas : []),
    [pet]
  );
  const ultimaLeitura = leituras[0] ?? null;

  // ---- Cadastro do próprio pet ----
  const [novo, setNovo] = useState({ nome: '', especie: 'Cão', raca: '', porte: 'Médio', idade: '', temperamento: '' });
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState(null);

  const abrirForm = () => {
    setNovo({ nome: '', especie: 'Cão', raca: '', porte: 'Médio', idade: '', temperamento: '' });
    setErroForm(null);
    setFormAberto(true);
  };

  const salvar = async () => {
    if (!novo.nome.trim()) {
      setErroForm('Dê um nome ao seu pet.');
      return;
    }
    setSalvando(true);
    setErroForm(null);
    try {
      await animalService.cadastrarMeu({ ...novo, nome: novo.nome.trim() });
      setFormAberto(false);
      setIndice(0);
      dados.recarregar();
    } catch (e) {
      setErroForm(mensagemDoErro(e, 'Não foi possível cadastrar o pet.'));
    } finally {
      setSalvando(false);
    }
  };

  const remover = (alvo) => {
    Alert.alert(
      'Remover pet',
      `Tirar ${alvo.nome} da sua lista? Isso não pode ser desfeito.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await animalService.removerMeu(alvo.id);
              setIndice(0);
              dados.recarregar();
            } catch (e) {
              Alert.alert('Não deu certo', mensagemDoErro(e));
            }
          },
        },
      ]
    );
  };

  const Cabecalho = () => (
    <View style={styles.header}>
      <Logo height={26} />
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.bellWrap} onPress={() => navigation.navigate('Solicitacoes')}>
          <Ionicons name="clipboard-outline" size={22} color={BRAND.ink} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatarSmall} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ---- Formulário ----
  const Formulario = () => (
    <Modal visible={formAberto} animationType="slide" onRequestClose={() => setFormAberto(false)}>
      <SafeAreaView style={t.tela}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={t.cabecalho}>
            <TouchableOpacity style={t.voltar} onPress={() => setFormAberto(false)} disabled={salvando}>
              <Ionicons name="close" size={20} color={BRAND.ink} />
            </TouchableOpacity>
            <Text style={[t.cardTitulo, { fontSize: 16 }]}>Cadastrar meu pet</Text>
          </View>

          <ScrollView style={t.scroll} contentContainerStyle={t.conteudoSemBarra} showsVerticalScrollIndicator={false}>
            <Text style={t.titulo}>Quem é ele?</Text>
            <Text style={t.subtitulo}>Só o nome é obrigatório — o resto dá para completar depois.</Text>

            <View style={{ paddingHorizontal: PAD, marginTop: 18, gap: 16 }}>
              <Campo
                rotulo="Nome"
                icone="paw-outline"
                placeholder="Ex.: Bento"
                value={novo.nome}
                onChangeText={(v) => setNovo((n) => ({ ...n, nome: v }))}
              />

              <View>
                <Text style={t.rotulo}>Espécie</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {ESPECIES.map((e) => {
                    const ativo = novo.especie === e;
                    return (
                      <TouchableOpacity
                        key={e}
                        style={[
                          t.botaoSecundario,
                          { flex: 1 },
                          ativo && { backgroundColor: BRAND.blue, borderColor: BRAND.blue },
                        ]}
                        activeOpacity={0.85}
                        onPress={() => setNovo((n) => ({ ...n, especie: e }))}
                      >
                        <Ionicons
                          name={e === 'Cão' ? 'paw' : 'logo-octocat'}
                          size={17}
                          color={ativo ? '#fff' : BRAND.blue}
                        />
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
                    const ativo = novo.porte === p;
                    return (
                      <TouchableOpacity
                        key={p}
                        style={[
                          t.badge,
                          ativo ? { backgroundColor: BRAND.blue } : t.badgeAzul,
                          { paddingVertical: 11, paddingHorizontal: 16, flex: 1, justifyContent: 'center' },
                        ]}
                        activeOpacity={0.85}
                        onPress={() => setNovo((n) => ({ ...n, porte: p }))}
                      >
                        <Text
                          style={[t.badgeTexto, ativo ? { color: '#fff' } : t.badgeAzulTexto, { fontSize: 13.5 }]}
                        >
                          {p}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <Campo
                rotulo="Raça"
                icone="ribbon-outline"
                placeholder="Ex.: SRD, Golden Retriever…"
                value={novo.raca}
                onChangeText={(v) => setNovo((n) => ({ ...n, raca: v }))}
              />
              <Campo
                rotulo="Idade"
                icone="calendar-outline"
                placeholder="Ex.: 2 anos"
                value={novo.idade}
                onChangeText={(v) => setNovo((n) => ({ ...n, idade: v }))}
              />
              <Campo
                rotulo="Temperamento"
                placeholder="Ex.: brincalhão, calmo com crianças…"
                value={novo.temperamento}
                onChangeText={(v) => setNovo((n) => ({ ...n, temperamento: v }))}
                multilinha
              />

              {erroForm ? (
                <View style={[t.faixaErro, { marginHorizontal: 0 }]}>
                  <Ionicons name="alert-circle" size={19} color={BRAND.danger} />
                  <Text style={t.faixaErroTexto}>{erroForm}</Text>
                </View>
              ) : null}

              <Text style={[t.cardTexto, { marginTop: 0 }]}>
                A foto ainda não pode ser enviada pelo app — o upload existe só para as ONGs.
              </Text>
            </View>
          </ScrollView>

          <View style={t.rodape}>
            <TouchableOpacity
              style={[t.botao, salvando && t.botaoDesabilitado]}
              activeOpacity={0.85}
              onPress={salvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={19} color="#fff" />
                  <Text style={t.botaoTexto}>Cadastrar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  // ---- Estados de carga ----
  if (dados.carregando && lista.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Cabecalho />
        <Carregando texto="Buscando seus pets…" />
        <Navbar navigation={navigation} currentRoute="MyPet" />
      </SafeAreaView>
    );
  }

  if (dados.erro && lista.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Cabecalho />
        <Erro mensagem={dados.erro} onTentarDeNovo={dados.recarregar} />
        <Navbar navigation={navigation} currentRoute="MyPet" />
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Cabecalho />
        <Text style={styles.title}>Meu pet</Text>
        <Vazio
          icone="paw-outline"
          titulo="Nenhum pet por aqui ainda"
          texto="Cadastre o pet que já é seu, ou adote um pela Nima."
          acao="Cadastrar meu pet"
          onAcao={abrirForm}
        />
        <TouchableOpacity
          style={[t.botaoSecundario, { marginHorizontal: PAD }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Match')}
        >
          <Ionicons name="search" size={18} color={BRAND.blue} />
          <Text style={t.botaoSecundarioTexto}>Ver pets para adoção</Text>
        </TouchableOpacity>
        <Formulario />
        <Navbar navigation={navigation} currentRoute="MyPet" />
      </SafeAreaView>
    );
  }

  const foto = primeiraFoto(pet);
  const ehRegistrado = !!pet.tutor_id;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Cabecalho />

        <Text style={styles.title}>Meu pet</Text>
        <Text style={styles.subtitle}>Tudo sobre o {pet.nome} em um só lugar.</Text>

        {/* Troca de pet + botão de adicionar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcherRow}>
          {lista.map((p, i) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.switchChip, i === indice && styles.switchChipAtivo]}
              onPress={() => setIndice(i)}
              activeOpacity={0.85}
            >
              <Text style={[styles.switchChipText, i === indice && styles.switchChipTextAtivo]}>{p.nome}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.switchChip} onPress={abrirForm} activeOpacity={0.85}>
            <Text style={[styles.switchChipText, { color: BRAND.blue }]}>＋ Adicionar</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Card do pet */}
        <View style={styles.petCard}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.petPhoto} />
          ) : (
            <View style={styles.petPhotoVazia}>
              <Ionicons name="paw" size={34} color={BRAND.blue} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.petNameRow}>
              <Text style={styles.petName}>{pet.nome}</Text>
              {ehRegistrado ? (
                <TouchableOpacity onPress={() => remover(pet)}>
                  <Ionicons name="trash-outline" size={18} color={BRAND.danger} />
                </TouchableOpacity>
              ) : null}
            </View>
            <Text style={styles.petBreed}>{[pet.raca, pet.idade].filter(Boolean).join('  ·  ')}</Text>

            {pet.smart_tag_id ? (
              <View style={styles.tagBadge}>
                <Ionicons name="radio-outline" size={14} color="#fff" />
                <Text style={styles.tagBadgeText}>Patinha ativa</Text>
              </View>
            ) : (
              <View style={[styles.tagBadge, { backgroundColor: BRAND.inkSoft }]}>
                <Ionicons name="alert-circle-outline" size={14} color="#fff" />
                <Text style={styles.tagBadgeText}>Sem Patinha</Text>
              </View>
            )}

            {pet.smart_tag_id ? (
              <View style={styles.petMetaRow}>
                <Ionicons name="pricetag-outline" size={15} color={BRAND.inkSoft} />
                <View>
                  <Text style={styles.petMetaLabel}>Código</Text>
                  <Text style={styles.petMetaValue}>{pet.smart_tag_id}</Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>

        {/* Acessos rápidos */}
        <Text style={styles.sectionTitle}>Acessos rápidos</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PetDetails', { id: pet.id })}
          >
            <Ionicons name="document-text-outline" size={24} color={BRAND.blue} />
            <Text style={styles.quickLabel}>Ficha completa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SmartTag', { codigo: pet.smart_tag_id ?? '' })}
          >
            <Ionicons name="pricetag-outline" size={24} color={BRAND.blue} />
            <Text style={styles.quickLabel}>Patinha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Solicitacoes')}
          >
            <Ionicons name="clipboard-outline" size={24} color={BRAND.blue} />
            <Text style={styles.quickLabel}>Minhas adoções</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard} activeOpacity={0.85} onPress={() => navigation.navigate('Guide')}>
            <Ionicons name="book-outline" size={24} color={BRAND.blue} />
            <Text style={styles.quickLabel}>Guia de cuidados</Text>
          </TouchableOpacity>
        </View>

        {/* Monitoramento da Patinha — última leitura NFC */}
        <View style={styles.tagCard}>
          <Text style={styles.tagCardTitle}>Monitoramento da Patinha</Text>
          <View style={styles.tagOnlineRow}>
            <View style={[styles.tagOnlineDot, { backgroundColor: pet.smart_tag_id ? '#4ADE80' : '#94A3B8' }]} />
            <Text style={styles.tagOnlineText}>
              {pet.smart_tag_id ? 'Tag registrada e ativa' : 'Nenhuma Patinha vinculada'}
            </Text>
          </View>

          {leiturasBloqueadas ? (
            <Text style={styles.tagAvisoTexto}>
              O histórico deste animal é liberado para a ONG responsável. Peça a ela para conferir
              as leituras da Patinha.
            </Text>
          ) : ultimaLeitura ? (
            <>
              <View style={styles.tagBody}>
                <View style={styles.tagMapThumb}>
                  <Ionicons name="location" size={32} color={BRAND.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tagInfoLabel}>Última leitura detectada</Text>
                  <Text style={styles.tagInfoValue}>
                    {localDaLeitura(ultimaLeitura)}
                    {formatarData(ultimaLeitura.lida_em) ? `  ·  ${formatarData(ultimaLeitura.lida_em)}` : ''}
                  </Text>
                </View>
              </View>

              {leituras.slice(1, 5).map((l) => (
                <View key={l.id} style={styles.leituraItem}>
                  <Ionicons name="scan-outline" size={17} color="rgba(255,255,255,0.7)" />
                  <View style={styles.leituraTexto}>
                    <Text style={styles.leituraLocal}>{localDaLeitura(l)}</Text>
                    <Text style={styles.leituraData}>{formatarData(l.lida_em) ?? '—'}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.tagAvisoTexto}>
              {pet.smart_tag_id
                ? 'Nenhuma leitura registrada ainda. A primeira aparece aqui assim que alguém escanear a Patinha.'
                : 'A Patinha é vinculada pela ONG. Assim que o seu pet tiver uma, as leituras aparecem aqui.'}
            </Text>
          )}
        </View>

        {/* Vacinas */}
        <Text style={styles.sectionTitle}>Saúde</Text>
        {vacinas.length === 0 ? (
          <View style={styles.vacCard}>
            <View style={styles.vacIcon}>
              <Ionicons name="shield-outline" size={24} color={BRAND.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vacTitle}>Sem vacinas registradas</Text>
              <Text style={styles.vacSub}>
                {ehRegistrado
                  ? 'O prontuário digital hoje é preenchido pela ONG no painel dela.'
                  : 'A ONG mantém o prontuário deste pet.'}
              </Text>
            </View>
          </View>
        ) : (
          vacinas.map((v, i) => (
            <View key={`${v.nome ?? 'vacina'}-${i}`} style={styles.vacItem}>
              <Ionicons name="shield-checkmark" size={20} color={BRAND.success} />
              <Text style={styles.vacItemNome}>{v.nome ?? v.vacina ?? 'Vacina'}</Text>
              <Text style={styles.vacItemData}>{v.data ?? v.aplicada_em ?? ''}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Formulario />
      <Navbar navigation={navigation} currentRoute="MyPet" />
    </SafeAreaView>
  );
};

export default MyPetScreen;
