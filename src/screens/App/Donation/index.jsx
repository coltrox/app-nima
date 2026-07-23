import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import Campo from '../../components/Campo';
import { Carregando, Erro, Vazio } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import vaquinhaService, { emReais, percentualDaMeta } from '../../../services/vaquinhaService';
import vagaService, { contadorDeVagas } from '../../../services/vagaService';
import { mensagemDoErro } from '../../../services/http';

// Apoiar — duas formas de ajudar, escolhidas no alternador do topo:
//   DINHEIRO → vaquinhas (PIX da própria ONG)
//   TEMPO    → vagas de voluntariado (contador X/N e inscrição)
//
// O que o design pedia e o banco NÃO tem: foto da campanha, valor arrecadado,
// apoiadores, prazo e categoria. Não há integração de pagamento — o PIX é da
// ONG e a doação acontece fora do app. Em tela de doação, número inventado é
// pior que número ausente, então a campanha mostra só meta e o copia-e-cola.
// Ver docs/ALINHAMENTO-BACKEND.md.

const MODOS = [
  { key: 'vaquinhas', label: 'Vaquinhas', icone: 'heart-outline' },
  { key: 'voluntariado', label: 'Voluntariado', icone: 'hand-right-outline' },
];

const DonationsScreen = ({ navigation }) => {
  const [modo, setModo] = useState('vaquinhas');
  const [busca, setBusca] = useState('');
  const [pixAberto, setPixAberto] = useState(null);

  // Formulário de inscrição em vaga
  const [vagaAberta, setVagaAberta] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState({}); // { [vagaId]: 'ok' | 'mensagem de erro' }

  const vaquinhas = useCarregar(() => vaquinhaService.listar(), { inicial: [] });
  const vagas = useCarregar(() => vagaService.listar(), { inicial: [] });

  const atual = modo === 'vaquinhas' ? vaquinhas : vagas;
  const lista = atual.dados || [];

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter((i) =>
      `${i.titulo ?? ''} ${i.descricao ?? ''} ${i.ong?.nome ?? ''}`.toLowerCase().includes(termo)
    );
  }, [lista, busca]);

  const inscrever = async (vaga) => {
    setEnviando(true);
    try {
      await vagaService.inscrever(vaga.id, mensagem);
      setResultado((r) => ({ ...r, [vaga.id]: 'ok' }));
      setVagaAberta(null);
      setMensagem('');
      vagas.recarregar({ silencioso: true });
    } catch (e) {
      setResultado((r) => ({ ...r, [vaga.id]: mensagemDoErro(e, 'Não foi possível se inscrever.') }));
    } finally {
      setEnviando(false);
    }
  };

  const trocarModo = (novo) => {
    setModo(novo);
    setBusca('');
    setPixAberto(null);
    setVagaAberta(null);
  };

  // ---------------------------------------------------------------- Vaquinha
  const CardVaquinha = ({ c, destaque }) => {
    const aberto = pixAberto === c.id;
    const pct = percentualDaMeta(c);

    return (
      <View style={t.card}>
        {destaque ? (
          <View
            style={{
              height: 96, borderRadius: 14, backgroundColor: '#EDF3FE',
              alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 14,
            }}
          >
            <Ionicons name="heart" size={30} color={BRAND.blue} />
            <Text style={{ fontSize: 12.5, fontFamily: 'Nunito_700Bold', color: BRAND.blue }}>
              Vaquinha verificada
            </Text>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Ionicons name="shield-checkmark" size={15} color={BRAND.blue} />
          <Text style={[t.cardLinhaTexto, { color: BRAND.inkSoft, fontSize: 13 }]} numberOfLines={1}>
            {c.ong?.nome ?? 'ONG parceira'}
          </Text>
        </View>

        <Text style={[t.cardTitulo, { marginTop: 7 }]}>{c.titulo}</Text>
        {c.descricao ? <Text style={t.cardTexto}>{c.descricao}</Text> : null}

        {/* A barra só aparece se houver progresso real (hoje nunca há). */}
        {pct != null ? (
          <View style={[t.cardLinha, { gap: 10 }]}>
            <View style={t.barraBg}><View style={[t.barraFill, { width: `${pct}%` }]} /></View>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 13.5, color: BRAND.blue }}>{pct}%</Text>
          </View>
        ) : null}

        {emReais(c.meta) ? (
          <View style={t.cardLinha}>
            <Ionicons name="flag-outline" size={16} color={BRAND.inkSoft} />
            <Text style={t.cardLinhaTexto}>Meta: {emReais(c.meta)}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[t.botao, { marginTop: 14 }]}
          activeOpacity={0.85}
          onPress={() => setPixAberto(aberto ? null : c.id)}
        >
          <Ionicons name={aberto ? 'chevron-up' : 'qr-code-outline'} size={19} color="#fff" />
          <Text style={t.botaoTexto}>{aberto ? 'Esconder o Pix' : 'Doar via Pix'}</Text>
        </TouchableOpacity>

        {aberto ? (
          <View
            style={{
              backgroundColor: '#F7F4EC', borderWidth: 1, borderColor: BRAND.border,
              borderRadius: 14, padding: 14, marginTop: 12,
            }}
          >
            <Text style={{ fontSize: 12, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, letterSpacing: 0.4 }}>
              PIX COPIA E COLA
            </Text>
            {/* selectable: dá para segurar e copiar sem lib de clipboard */}
            <Text
              selectable
              style={{ fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 8, lineHeight: 18 }}
            >
              {c.pix_copia_cola}
            </Text>
            <Text style={{ fontSize: 12, fontFamily: 'Nunito_600SemiBold', color: BRAND.blue, marginTop: 10 }}>
              Segure o código para copiar e cole no app do seu banco.
              {c.pix_chave ? `  ·  Chave: ${c.pix_chave}` : ''}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  // ------------------------------------------------------------ Voluntariado
  const CardVaga = ({ v }) => {
    const res = resultado[v.id];
    const pct =
      v.total_vagas != null && v.total_vagas > 0
        ? Math.min(100, Math.round(((v.preenchidas ?? 0) / v.total_vagas) * 100))
        : null;

    return (
      <View style={t.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Ionicons name="shield-checkmark" size={15} color={BRAND.blue} />
          <Text style={[t.cardLinhaTexto, { color: BRAND.inkSoft, fontSize: 13 }]} numberOfLines={1}>
            {v.ong?.nome ?? 'ONG parceira'}
          </Text>
        </View>

        <Text style={[t.cardTitulo, { marginTop: 7 }]}>{v.titulo}</Text>
        {v.descricao ? <Text style={t.cardTexto}>{v.descricao}</Text> : null}

        {/* Contador X/N — mesmo número que a ONG vê no painel */}
        <View style={[t.cardLinha, { gap: 10 }]}>
          <View style={t.barraBg}>
            <View style={[t.barraFill, v.cheia && t.barraCheia, { width: pct != null ? `${pct}%` : '0%' }]} />
          </View>
          <Text
            style={{
              fontFamily: 'Nunito_800ExtraBold',
              fontSize: 13.5,
              color: v.cheia ? BRAND.success : BRAND.blue,
            }}
          >
            {contadorDeVagas(v)}
          </Text>
        </View>

        {res === 'ok' ? (
          <View style={[t.badge, t.badgeVerde, { marginTop: 12 }]}>
            <Ionicons name="checkmark-circle" size={13} color={BRAND.success} />
            <Text style={[t.badgeTexto, t.badgeVerdeTexto]}>Inscrição enviada — aguarde a ONG</Text>
          </View>
        ) : res ? (
          <View style={[t.badge, t.badgeVermelho, { marginTop: 12 }]}>
            <Ionicons name="alert-circle" size={13} color={BRAND.danger} />
            <Text style={[t.badgeTexto, t.badgeVermelhoTexto]}>{res}</Text>
          </View>
        ) : v.cheia ? (
          <View style={[t.badge, t.badgeAmbar, { marginTop: 12 }]}>
            <Ionicons name="lock-closed-outline" size={13} color="#8A6100" />
            <Text style={[t.badgeTexto, t.badgeAmbarTexto]}>Vaga completa</Text>
          </View>
        ) : vagaAberta === v.id ? (
          <View style={{ marginTop: 14 }}>
            <Campo
              rotulo="Conte por que você quer ajudar (opcional)"
              placeholder="Ex.: tenho disponibilidade nos sábados de manhã…"
              value={mensagem}
              onChangeText={setMensagem}
              multilinha
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                style={[t.botaoSecundario, { flex: 1 }]}
                onPress={() => { setVagaAberta(null); setMensagem(''); }}
                disabled={enviando}
              >
                <Text style={t.botaoSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[t.botao, { flex: 1 }, enviando && t.botaoDesabilitado]}
                onPress={() => inscrever(v)}
                disabled={enviando}
                activeOpacity={0.85}
              >
                {enviando ? <ActivityIndicator color="#fff" /> : <Text style={t.botaoTexto}>Enviar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[t.botao, { marginTop: 14 }]}
            activeOpacity={0.85}
            onPress={() => { setVagaAberta(v.id); setMensagem(''); }}
          >
            <Ionicons name="hand-right-outline" size={19} color="#fff" />
            <Text style={t.botaoTexto}>Quero me voluntariar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const ehVaquinha = modo === 'vaquinhas';
  const ongsDistintas = new Set(lista.map((i) => i.ong_id ?? i.ong?.id)).size;

  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={t.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={t.conteudo}>
        <View style={t.cabecalho}>
          <Logo height={26} />
          <TouchableOpacity style={[t.voltar, { marginLeft: 'auto' }]} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-outline" size={19} color={BRAND.ink} />
          </TouchableOpacity>
        </View>

        <Text style={t.titulo}>Apoiar</Text>
        <Text style={t.subtitulo}>Ajude com o que você tem: dinheiro ou tempo.</Text>

        {/* Alternador */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#E9E2D2',
            borderRadius: 16,
            padding: 4,
            marginHorizontal: PAD,
            marginTop: 18,
          }}
        >
          {MODOS.map((m) => {
            const ativo = modo === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  paddingVertical: 12,
                  borderRadius: 13,
                  backgroundColor: ativo ? BRAND.card : 'transparent',
                }}
                activeOpacity={0.85}
                onPress={() => trocarModo(m.key)}
              >
                <Ionicons name={m.icone} size={17} color={ativo ? BRAND.blue : BRAND.inkSoft} />
                <Text
                  style={{
                    fontSize: 14.5,
                    fontFamily: ativo ? 'Nunito_800ExtraBold' : 'Nunito_600SemiBold',
                    color: ativo ? BRAND.blue : BRAND.inkSoft,
                  }}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Números reais do modo escolhido */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            backgroundColor: '#EDF3FE',
            borderRadius: 20,
            marginHorizontal: PAD,
            marginTop: 14,
            padding: 16,
          }}
        >
          <View
            style={{
              width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: BRAND.blue,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name={ehVaquinha ? 'heart' : 'people'} size={24} color={BRAND.blue} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 22, fontFamily: 'Nunito_800ExtraBold', color: BRAND.blue }}>
                {lista.length}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft }}>
                {ehVaquinha ? 'vaquinhas ativas' : 'vagas abertas'}
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: '#C9D8F2', marginHorizontal: 16, alignSelf: 'stretch' }} />
            <View>
              <Text style={{ fontSize: 22, fontFamily: 'Nunito_800ExtraBold', color: BRAND.blue }}>
                {ongsDistintas}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft }}>
                {ongsDistintas === 1 ? 'ONG' : 'ONGs'}
              </Text>
            </View>
          </View>
        </View>

        <Campo
          icone="search"
          placeholder={ehVaquinha ? 'Buscar campanha ou ONG' : 'Buscar vaga ou ONG'}
          value={busca}
          onChangeText={setBusca}
          containerStyle={{ marginHorizontal: PAD, marginTop: 14 }}
        />

        {atual.carregando && lista.length === 0 ? (
          <Carregando texto={ehVaquinha ? 'Buscando campanhas…' : 'Buscando vagas…'} />
        ) : atual.erro && lista.length === 0 ? (
          <Erro mensagem={atual.erro} onTentarDeNovo={atual.recarregar} />
        ) : filtrados.length === 0 ? (
          <Vazio
            icone={ehVaquinha ? 'heart-outline' : 'people-outline'}
            titulo={
              busca
                ? 'Nada encontrado'
                : ehVaquinha
                  ? 'Nenhuma campanha aberta'
                  : 'Nenhuma vaga aberta'
            }
            texto={
              busca
                ? 'Tente outro termo de busca.'
                : 'Assim que uma ONG publicar, aparece aqui.'
            }
          />
        ) : ehVaquinha ? (
          filtrados.map((c, i) => <CardVaquinha key={c.id} c={c} destaque={i === 0} />)
        ) : (
          filtrados.map((v) => <CardVaga key={v.id} v={v} />)
        )}

        <View style={[t.card, { backgroundColor: '#EDF3FE', borderColor: '#D6E3FA', marginTop: 18 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Ionicons name="shield-checkmark" size={19} color={BRAND.blue} />
            <Text style={[t.cardTexto, { marginTop: 0, flex: 1 }]}>
              {ehVaquinha
                ? 'O Pix é da própria ONG, cadastrado por ela no painel. A Nima não intermedia o dinheiro.'
                : 'A ONG analisa cada inscrição e entra em contato pelos dados do seu perfil.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Donation" />
    </SafeAreaView>
  );
};

export default DonationsScreen;
