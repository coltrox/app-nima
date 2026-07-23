import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Image,
  SafeAreaView, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Carregando, Erro } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import animalService, { primeiraFoto } from '../../../services/animalService';
import solicitacaoService from '../../../services/solicitacaoService';
import questionarioService from '../../../services/questionarioService';
import favoritos from '../../../services/favoritos';
import { mensagemDoErro } from '../../../services/http';

// Ficha do pet + solicitação de adoção (RF07).
// A rota recebe `{ id }`; o dossiê do candidato (questionário + parecer da IA)
// é anexado pelo backend a partir do tutor_id do token — o app não envia nada disso.

const CORES_STATUS = {
  'Disponível': [t.badgeVerde, t.badgeVerdeTexto],
  'Em Triagem': [t.badgeAmbar, t.badgeAmbarTexto],
  'Adotado': [t.badgeAzul, t.badgeAzulTexto],
  'Desaparecido': [t.badgeVermelho, t.badgeVermelhoTexto],
};

const PetDetailsScreen = ({ navigation, route }) => {
  const id = route?.params?.id;

  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

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

  const alternarFavorito = async () => setFavorito(await favoritos.alternar(id));

  const solicitar = async () => {
    setEnviando(true);
    setErroEnvio(null);
    try {
      await solicitacaoService.criar(id, mensagem);
      setSucesso(true);
      setMensagem('');
    } catch (e) {
      setErroEnvio(mensagemDoErro(e, 'Não foi possível enviar sua solicitação.'));
    } finally {
      setEnviando(false);
    }
  };

  const Topo = () => (
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
        <Topo />
        <Erro mensagem="Pet não informado." onTentarDeNovo={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  if (carregando && !pet) {
    return (
      <SafeAreaView style={t.tela}>
        <StatusBar barStyle="dark-content" />
        <Topo />
        <Carregando texto="Abrindo a ficha…" />
      </SafeAreaView>
    );
  }

  if (erro || !pet) {
    return (
      <SafeAreaView style={t.tela}>
        <StatusBar barStyle="dark-content" />
        <Topo />
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
          <Topo />

          <View style={{ marginHorizontal: PAD, marginTop: 14, borderRadius: 22, overflow: 'hidden' }}>
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
          </View>

          <Text style={t.titulo}>{pet.nome}</Text>
          <View style={{ marginHorizontal: PAD, marginTop: 8, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={[t.badge, badgeEstilo]}>
              <Text style={[t.badgeTexto, badgeTexto]}>{pet.status_posse}</Text>
            </View>
            {pet.compatibilidade != null && (
              <View style={[t.badge, t.badgeAzul]}>
                <Ionicons name="heart" size={12} color={BRAND.blue} />
                <Text style={[t.badgeTexto, t.badgeAzulTexto]}>
                  {Math.round(pet.compatibilidade)}% compatível
                </Text>
              </View>
            )}
          </View>

          <View style={t.card}>
            <Text style={t.cardTitulo}>Sobre o {pet.nome}</Text>
            {[
              ['paw-outline', 'Espécie', pet.especie],
              ['ribbon-outline', 'Raça', pet.raca],
              ['resize-outline', 'Porte', pet.porte],
              ['calendar-outline', 'Idade', pet.idade],
              ['happy-outline', 'Temperamento', pet.temperamento],
            ]
              .filter(([, , valor]) => !!valor)
              .map(([icone, rotulo, valor]) => (
                <View key={rotulo} style={t.cardLinha}>
                  <Ionicons name={icone} size={17} color={BRAND.inkSoft} />
                  <Text style={t.cardLinhaTexto}>{rotulo}</Text>
                  <Text style={[t.cardLinhaTexto, { flex: 0, color: BRAND.inkSoft }]}>{valor}</Text>
                </View>
              ))}
          </View>

          <View style={t.card}>
            <Text style={t.cardTitulo}>Carteira de vacinação</Text>
            {vacinas.length === 0 ? (
              <Text style={t.cardTexto}>Nenhuma vacina registrada pela ONG até agora.</Text>
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

          {sucesso ? (
            <View style={t.faixaSucesso}>
              <Ionicons name="checkmark-circle" size={20} color={BRAND.success} />
              <Text style={t.faixaSucessoTexto}>
                Solicitação enviada! A ONG vai analisar seu perfil e responder. Acompanhe em "Minhas adoções".
              </Text>
            </View>
          ) : jaPediu ? (
            <View style={[t.card, { backgroundColor: '#EDF3FE', borderColor: '#D6E3FA', marginTop: 18 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="clipboard" size={19} color={BRAND.blue} />
                <Text style={[t.cardTitulo, { fontSize: 15.5 }]}>Você já pediu este pet</Text>
              </View>
              <Text style={t.cardTexto}>
                {statusPedido === 'pendente'
                  ? 'Sua solicitação está em análise pela ONG. Não é preciso pedir de novo.'
                  : statusPedido === 'aprovada'
                    ? 'Sua adoção foi aprovada! Fale com a ONG para combinar a entrega.'
                    : 'Esta solicitação não foi aprovada. Você pode conhecer outros pets disponíveis.'}
              </Text>
              <TouchableOpacity
                style={[t.botaoSecundario, { marginTop: 14 }]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Solicitacoes')}
              >
                <Ionicons name="clipboard-outline" size={18} color={BRAND.blue} />
                <Text style={t.botaoSecundarioTexto}>Ver minhas adoções</Text>
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
        </ScrollView>

        {sucesso ? (
          <View style={t.rodape}>
            <TouchableOpacity style={t.botao} activeOpacity={0.85} onPress={() => navigation.navigate('Solicitacoes')}>
              <Ionicons name="clipboard-outline" size={19} color="#fff" />
              <Text style={t.botaoTexto}>Ver minhas adoções</Text>
            </TouchableOpacity>
          </View>
        ) : bloqueado ? (
          <View style={t.rodape}>
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
          <View style={t.rodape}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PetDetailsScreen;
