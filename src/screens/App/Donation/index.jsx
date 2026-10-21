import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import Campo from '../../components/Campo';
import { Carregando, Erro, Vazio } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t from '../../../theme/telaStyles';
import { ms, fs, getPad } from '../../../theme/units';
import useCarregar from '../../../hooks/useCarregar';
import vaquinhaService, { emReais, percentualDaMeta } from '../../../services/vaquinhaService';
import vagaService, { contadorDeVagas } from '../../../services/vagaService';
import eventoService from '../../../services/eventoService';
import { mensagemDoErro } from '../../../services/http';
// Apoiar — três formas de ajudar, escolhidas no alternador do topo:
//   DINHEIRO → vaquinhas (PIX da própria ONG)
//   TEMPO    → vagas de voluntariado (trabalho contínuo, contador X/N)
//   PRESENÇA → eventos (feira, mutirão: dia e lugar marcados)
//
// Vaga e evento não são a mesma coisa, e por isso são abas diferentes: vaga é
// "todo sábado passear com os cães"; evento acontece uma vez, tem data, e
// depois a ONG marca quem apareceu — presença confirmada libera uma Patinha.
//
// O que o design pedia e o banco NÃO tem: foto da campanha, valor arrecadado,
// apoiadores, prazo e categoria. Não há integração de pagamento — o PIX é da
// ONG e a doação acontece fora do app. Em tela de doação, número inventado é
// pior que número ausente, então a campanha mostra só meta e o copia-e-cola.
// Ver docs/ALINHAMENTO-BACKEND.md.
const MODOS = [
  { key: 'vaquinhas', label: 'Vaquinhas', icone: 'heart-outline' },
  { key: 'voluntariado', label: 'Voluntariado', icone: 'hand-right-outline' },
  { key: 'eventos', label: 'Eventos', icone: 'calendar-outline' },
];
const formatarQuando = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });
};
const DonationsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // ---- Dimensões responsivas (uma vez, reusadas em toda a tela) ----
  const DIM = {
    pad: getPad(width),
    gap: ms(8, width),
    gapLg: ms(10, width),
    gapXl: ms(16, width),
    altRadius: ms(13, width),
    altFont: fs(13.5, width),
    statFont: fs(22, width),
    statCaption: fs(12, width),
    coverH: ms(96, width),
  };

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
  const eventos = useCarregar(() => eventoService.listar(), { inicial: [] });
  const atual = modo === 'vaquinhas' ? vaquinhas : modo === 'eventos' ? eventos : vagas;
  const lista = atual.dados || [];
  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter((i) =>
      `${i.titulo ?? ''} ${i.descricao ?? ''} ${i.local ?? ''} ${i.ong?.nome ?? ''}`
        .toLowerCase().includes(termo)
    );
  }, [lista, busca]);
  // ---- Candidatura a evento ----
  // Mesmo padrão da inscrição em vaga: um mapa id → 'ok' | mensagem de erro,
  // para o retorno aparecer no card certo em vez de num alerta global.
  const [eventoAberto, setEventoAberto] = useState(null);
  const participar = async (evento) => {
    setEnviando(true);
    try {
      await eventoService.participar(evento.id, mensagem);
      setResultado((r) => ({ ...r, [evento.id]: 'ok' }));
      setEventoAberto(null);
      setMensagem('');
      eventos.recarregar({ silencioso: true });
    } catch (e) {
      setResultado((r) => ({ ...r, [evento.id]: mensagemDoErro(e, 'Não foi possível se candidatar.') }));
    } finally {
      setEnviando(false);
    }
  };
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
    setEventoAberto(null);
  };
  // ------------------------------------------------------------------ Evento
  // Também é função que RETORNA JSX, pelo mesmo motivo do cardVaquinha abaixo.
  const cardEvento = (e) => {
    const aberto = eventoAberto === e.id;
    const retorno = resultado[e.id];
    const minha = e.minha_participacao;
    return (
      <View key={e.id} style={t.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: DIM.gap, flexWrap: 'wrap' }}>
          <Text style={[t.cardTitulo, { flexShrink: 1, marginTop: 0 }]} numberOfLines={2}>
            {e.titulo}
          </Text>
          {minha ? (
            <View style={[t.badge, minha.presente ? t.badgeVerde : t.badgeAzul]}>
              <Text style={[t.badgeTexto, minha.presente ? t.badgeVerdeTexto : t.badgeAzulTexto]}>
                {minha.presente
                  ? 'Presença confirmada'
                  : minha.status === 'aceito' ? 'Aceito' : minha.status === 'recusado' ? 'Não aceito' : 'Aguardando'}
              </Text>
            </View>
          ) : e.cheio ? (
            <View style={[t.badge, t.badgeAmbar]}>
              <Text style={[t.badgeTexto, t.badgeAmbarTexto]}>Lotado</Text>
            </View>
          ) : null}
        </View>
        <View style={t.cardLinha}>
          <Ionicons name="calendar-outline" size={15} color={BRAND.inkSoft} />
          <Text style={t.cardLinhaTexto}>{formatarQuando(e.data_inicio)}</Text>
        </View>
        <View style={t.cardLinha}>
          <Ionicons name="location-outline" size={15} color={BRAND.inkSoft} />
          <Text style={t.cardLinhaTexto}>{e.local}</Text>
        </View>
        {e.ong?.nome ? (
          <View style={t.cardLinha}>
            <Ionicons name="business-outline" size={15} color={BRAND.inkSoft} />
            <Text style={t.cardLinhaTexto}>{e.ong.nome}</Text>
          </View>
        ) : null}
        {e.descricao ? <Text style={t.cardTexto}>{e.descricao}</Text> : null}
        <Text style={[t.cardTexto, { fontSize: DIM.statCaption + 0.5 }]}>
          {e.aceitos} voluntário{e.aceitos === 1 ? '' : 's'} confirmado{e.aceitos === 1 ? '' : 's'}
          {e.vagas != null ? ` de ${e.vagas}` : ''}
        </Text>
        {retorno === 'ok' ? (
          <View style={[t.faixaSucesso, { marginHorizontal: 0 }]}>
            <Ionicons name="checkmark-circle" size={19} color={BRAND.success} />
            <Text style={t.faixaSucessoTexto}>
              Candidatura enviada! A ONG vai responder — e, depois do evento, confirmar sua presença.
            </Text>
          </View>
        ) : retorno ? (
          <View style={[t.faixaErro, { marginHorizontal: 0 }]}>
            <Ionicons name="alert-circle" size={19} color={BRAND.danger} />
            <Text style={t.faixaErroTexto}>{retorno}</Text>
          </View>
        ) : null}
        {minha ? (
          <Text style={[t.cardTexto, { fontSize: DIM.statCaption + 0.5 }]}>
            {minha.presente
              ? 'Você pode resgatar uma Patinha por este evento — veja em Meu Pet › Patinha.'
              : 'Você já se candidatou. A Patinha libera quando a ONG confirmar sua presença.'}
          </Text>
        ) : aberto ? (
          <View style={{ marginTop: DIM.gapLg + 2 }}>
            <Campo
              rotulo="Quer dizer algo para a ONG? (opcional)"
              placeholder="Ex.: posso ajudar na montagem desde cedo."
              value={mensagem}
              onChangeText={setMensagem}
              multilinha
            />
            <View style={{ flexDirection: 'row', gap: DIM.gapLg, marginTop: DIM.gapLg + 2 }}>
              <TouchableOpacity
                style={[t.botaoSecundario, { flex: 1, minHeight: 44 }]}
                onPress={() => { setEventoAberto(null); setMensagem(''); }}
                disabled={enviando}
              >
                <Text style={t.botaoSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[t.botao, { flex: 1.4, minHeight: 44 }, enviando && t.botaoDesabilitado]}
                onPress={() => participar(e)}
                disabled={enviando}
                activeOpacity={0.85}
              >
                {enviando
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={t.botaoTexto}>Quero ajudar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[t.botao, { marginTop: DIM.gapLg + 2, minHeight: 44 }, e.cheio && t.botaoDesabilitado]}
            onPress={() => { setEventoAberto(e.id); setMensagem(''); }}
            disabled={e.cheio}
            activeOpacity={0.85}
          >
            <Ionicons name="hand-right-outline" size={18} color="#fff" />
            <Text style={t.botaoTexto}>{e.cheio ? 'Já está lotado' : 'Quero ajudar'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  // ---------------------------------------------------------------- Vaquinha
  // Funções que retornam JSX, não componentes: declaradas aqui dentro, um
  // componente teria identidade nova a cada tecla digitada e o React remontaria
  // a árvore — o campo perderia o foco. Como função, o JSX é inlined no pai.
  const cardVaquinha = (c, destaque) => {
    const aberto = pixAberto === c.id;
    const pct = percentualDaMeta(c);
    return (
      <View key={c.id} style={t.card}>
        {destaque ? (
          <View
            style={{
              height: DIM.coverH, borderRadius: DIM.altRadius + 1, backgroundColor: '#EDF3FE',
              alignItems: 'center', justifyContent: 'center', gap: DIM.gap - 2, marginBottom: DIM.gapXl - 2,
            }}
          >
            <Ionicons name="heart" size={30} color={BRAND.blue} />
            <Text style={{ fontSize: DIM.statCaption + 0.5, fontFamily: 'Nunito_700Bold', color: BRAND.blue }}>
              Vaquinha verificada
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: DIM.gap - 1 }}>
          <Ionicons name="shield-checkmark" size={15} color={BRAND.blue} />
          <Text style={[t.cardLinhaTexto, { color: BRAND.inkSoft, fontSize: 13 }]} numberOfLines={1}>
            {c.ong?.nome ?? 'ONG parceira'}
          </Text>
        </View>
        <Text style={[t.cardTitulo, { marginTop: DIM.gap - 1 }]}>{c.titulo}</Text>
        {c.descricao ? <Text style={t.cardTexto}>{c.descricao}</Text> : null}
        {/* A barra só aparece se houver progresso real (hoje nunca há). */}
        {pct != null ? (
          <View style={[t.cardLinha, { gap: DIM.gapLg }]}>
            <View style={t.barraBg}><View style={[t.barraFill, { width: `${pct}%` }]} /></View>
            <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: DIM.altFont, color: BRAND.blue }}>{pct}%</Text>
          </View>
        ) : null}
        {emReais(c.meta) ? (
          <View style={t.cardLinha}>
            <Ionicons name="flag-outline" size={16} color={BRAND.inkSoft} />
            <Text style={t.cardLinhaTexto}>Meta: {emReais(c.meta)}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={[t.botao, { marginTop: DIM.gapXl - 2, minHeight: 44 }]}
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
              borderRadius: DIM.altRadius + 1, padding: DIM.gapXl - 2, marginTop: DIM.gapLg + 2,
            }}
          >
            <Text style={{ fontSize: DIM.statCaption, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, letterSpacing: 0.4 }}>
              PIX COPIA E COLA
            </Text>
            {/* selectable: dá para segurar e copiar sem lib de clipboard */}
            <Text
              selectable
              style={{ fontSize: DIM.statCaption + 0.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: DIM.gap, lineHeight: 18 }}
            >
              {c.pix_copia_cola}
            </Text>
            <Text style={{ fontSize: DIM.statCaption, fontFamily: 'Nunito_600SemiBold', color: BRAND.blue, marginTop: DIM.gapLg }}>
              Segure o código para copiar e cole no app do seu banco.
              {c.pix_chave ? `  ·  Chave: ${c.pix_chave}` : ''}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };
  // ------------------------------------------------------------ Voluntariado
  const cardVaga = (v) => {
    const res = resultado[v.id];
    const pct =
      v.total_vagas != null && v.total_vagas > 0
        ? Math.min(100, Math.round(((v.preenchidas ?? 0) / v.total_vagas) * 100))
        : null;
    return (
      <View key={v.id} style={t.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: DIM.gap - 1 }}>
          <Ionicons name="shield-checkmark" size={15} color={BRAND.blue} />
          <Text style={[t.cardLinhaTexto, { color: BRAND.inkSoft, fontSize: 13 }]} numberOfLines={1}>
            {v.ong?.nome ?? 'ONG parceira'}
          </Text>
        </View>
        <Text style={[t.cardTitulo, { marginTop: DIM.gap - 1 }]}>{v.titulo}</Text>
        {v.descricao ? <Text style={t.cardTexto}>{v.descricao}</Text> : null}
        {/* Contador X/N — mesmo número que a ONG vê no painel */}
        <View style={[t.cardLinha, { gap: DIM.gapLg }]}>
          <View style={t.barraBg}>
            <View style={[t.barraFill, v.cheia && t.barraCheia, { width: pct != null ? `${pct}%` : '0%' }]} />
          </View>
          <Text
            style={{
              fontFamily: 'Nunito_800ExtraBold',
              fontSize: DIM.altFont,
              color: v.cheia ? BRAND.success : BRAND.blue,
            }}
          >
            {contadorDeVagas(v)}
          </Text>
        </View>
        {res === 'ok' ? (
          <View style={[t.badge, t.badgeVerde, { marginTop: DIM.gapLg + 2 }]}>
            <Ionicons name="checkmark-circle" size={13} color={BRAND.success} />
            <Text style={[t.badgeTexto, t.badgeVerdeTexto]}>Inscrição enviada — aguarde a ONG</Text>
          </View>
        ) : res ? (
          <View style={[t.badge, t.badgeVermelho, { marginTop: DIM.gapLg + 2 }]}>
            <Ionicons name="alert-circle" size={13} color={BRAND.danger} />
            <Text style={[t.badgeTexto, t.badgeVermelhoTexto]}>{res}</Text>
          </View>
        ) : v.cheia ? (
          <View style={[t.badge, t.badgeAmbar, { marginTop: DIM.gapLg + 2 }]}>
            <Ionicons name="lock-closed-outline" size={13} color="#8A6100" />
            <Text style={[t.badgeTexto, t.badgeAmbarTexto]}>Vaga completa</Text>
          </View>
        ) : vagaAberta === v.id ? (
          <View style={{ marginTop: DIM.gapXl - 2 }}>
            <Campo
              rotulo="Conte por que você quer ajudar (opcional)"
              placeholder="Ex.: tenho disponibilidade nos sábados de manhã…"
              value={mensagem}
              onChangeText={setMensagem}
              multilinha
            />
            <View style={{ flexDirection: 'row', gap: DIM.gapLg, marginTop: DIM.gapLg + 2 }}>
              <TouchableOpacity
                style={[t.botaoSecundario, { flex: 1, minHeight: 44 }]}
                onPress={() => { setVagaAberta(null); setMensagem(''); }}
                disabled={enviando}
              >
                <Text style={t.botaoSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[t.botao, { flex: 1, minHeight: 44 }, enviando && t.botaoDesabilitado]}
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
            style={[t.botao, { marginTop: DIM.gapXl - 2, minHeight: 44 }]}
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
  const ehEvento = modo === 'eventos';
  const ongsDistintas = new Set(lista.map((i) => i.ong_id ?? i.ong?.id)).size;
  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={t.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[t.conteudo, { paddingBottom: ms(110, width) + insets.bottom }]}
      >
        <View style={t.cabecalho}>
          <Logo height={26} />
          <TouchableOpacity style={[t.voltar, { marginLeft: 'auto' }]} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-outline" size={19} color={BRAND.ink} />
          </TouchableOpacity>
        </View>
        <Text style={t.titulo}>Apoiar</Text>
        <Text style={t.subtitulo}>Ajude com o que você tem: dinheiro ou tempo.</Text>
        {/* Alternador — corrigido: ícone só no ativo, slot travado com
            minWidth: 0 + overflow hidden; o texto não invade mais o vizinho. */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#E9E2D2',
            borderRadius: DIM.altRadius + 3,
            padding: 4,
            marginHorizontal: DIM.pad,
            marginTop: DIM.gapXl + 2,
          }}
        >
          {MODOS.map((m) => {
            const ativo = modo === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: ativo ? DIM.gap - 1 : 0,
                  paddingVertical: DIM.gapLg + 2,
                  paddingHorizontal: 4,
                  borderRadius: DIM.altRadius,
                  backgroundColor: ativo ? BRAND.card : 'transparent',
                  minHeight: 44,
                }}
                activeOpacity={0.85}
                onPress={() => trocarModo(m.key)}
              >
                {ativo && (
                  <Ionicons name={m.icone} size={DIM.altFont + 1} color={BRAND.blue} />
                )}
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: DIM.altFont,
                    fontFamily: ativo ? 'Nunito_800ExtraBold' : 'Nunito_600SemiBold',
                    color: ativo ? BRAND.blue : BRAND.inkSoft,
                    flexShrink: 1,
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
            gap: DIM.gapXl,
            backgroundColor: '#EDF3FE',
            borderRadius: DIM.altRadius + 7,
            marginHorizontal: DIM.pad,
            marginTop: DIM.gapXl - 2,
            padding: DIM.gapXl,
          }}
        >
          <View
            style={{
              width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: BRAND.blue,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name={ehVaquinha ? 'heart' : ehEvento ? 'calendar' : 'people'} size={24} color={BRAND.blue} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: DIM.statFont, fontFamily: 'Nunito_800ExtraBold', color: BRAND.blue }}>
                {lista.length}
              </Text>
              <Text style={{ fontSize: DIM.statCaption, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft }}>
                {ehVaquinha ? 'vaquinhas ativas' : ehEvento ? 'eventos marcados' : 'vagas abertas'}
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: '#C9D8F2', marginHorizontal: DIM.gapXl, alignSelf: 'stretch' }} />
            <View>
              <Text style={{ fontSize: DIM.statFont, fontFamily: 'Nunito_800ExtraBold', color: BRAND.blue }}>
                {ongsDistintas}
              </Text>
              <Text style={{ fontSize: DIM.statCaption, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft }}>
                {ongsDistintas === 1 ? 'ONG' : 'ONGs'}
              </Text>
            </View>
          </View>
        </View>
        <Campo
          icone="search"
          placeholder={ehVaquinha ? 'Buscar campanha ou ONG' : ehEvento ? 'Buscar evento, local ou ONG' : 'Buscar vaga ou ONG'}
          value={busca}
          onChangeText={setBusca}
          containerStyle={{ marginHorizontal: DIM.pad, marginTop: DIM.gapXl - 2 }}
        />
        {atual.carregando && lista.length === 0 ? (
          <Carregando texto={ehVaquinha ? 'Buscando campanhas…' : ehEvento ? 'Buscando eventos…' : 'Buscando vagas…'} />
        ) : atual.erro && lista.length === 0 ? (
          <Erro mensagem={atual.erro} onTentarDeNovo={atual.recarregar} />
        ) : filtrados.length === 0 ? (
          <Vazio
            icone={ehVaquinha ? 'heart-outline' : ehEvento ? 'calendar-outline' : 'people-outline'}
            titulo={
              busca
                ? 'Nada encontrado'
                : ehVaquinha
                  ? 'Nenhuma campanha aberta'
                  : ehEvento
                    ? 'Nenhum evento marcado'
                    : 'Nenhuma vaga aberta'
            }
            texto={
              busca
                ? 'Tente outro termo de busca.'
                : 'Assim que uma ONG publicar, aparece aqui.'
            }
          />
        ) : ehVaquinha ? (
          filtrados.map((c, i) => cardVaquinha(c, i === 0))
        ) : ehEvento ? (
          filtrados.map((e) => cardEvento(e))
        ) : (
          filtrados.map((v) => cardVaga(v))
        )}
        <View style={[t.card, { backgroundColor: '#EDF3FE', borderColor: '#D6E3FA', marginTop: DIM.gapXl + 2 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: DIM.gap + 1 }}>
            <Ionicons name="shield-checkmark" size={19} color={BRAND.blue} />
            <Text style={[t.cardTexto, { marginTop: 0, flex: 1 }]}>
              {ehVaquinha
                ? 'O Pix é da própria ONG, cadastrado por ela no painel. A Nima não intermedia o dinheiro.'
                : ehEvento
                  ? 'Depois do evento a ONG marca quem apareceu. Com a presença confirmada, você pode resgatar uma Patinha.'
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