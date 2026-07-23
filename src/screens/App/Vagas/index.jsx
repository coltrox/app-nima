import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/NavBar/navbar';
import { Carregando, Erro, Vazio } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import vagaService, { contadorDeVagas } from '../../../services/vagaService';
import { mensagemDoErro } from '../../../services/http';

// Voluntariado (RF22) — GET /api/vagas e POST /api/vagas/:id/inscricoes.
//
// O contador X/N vem pronto do backend (`preenchidas` / `total_vagas`), calculado
// a partir das inscrições com status 'aceito'. O app não recalcula nada: se
// recalculasse, mostraria número diferente do painel da ONG.

const VagasScreen = ({ navigation }) => {
  const [aberta, setAberta] = useState(null);       // vaga com formulário aberto
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [feito, setFeito] = useState({});           // { [vagaId]: 'ok' | 'mensagem de erro' }

  const { dados, carregando, erro, recarregar } = useCarregar(() => vagaService.listar(), { inicial: [] });
  const vagas = dados || [];

  const inscrever = async (vaga) => {
    setEnviando(true);
    try {
      await vagaService.inscrever(vaga.id, mensagem);
      setFeito((f) => ({ ...f, [vaga.id]: 'ok' }));
      setAberta(null);
      setMensagem('');
      recarregar({ silencioso: true });
    } catch (e) {
      setFeito((f) => ({ ...f, [vaga.id]: mensagemDoErro(e, 'Não foi possível se inscrever.') }));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={t.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={t.conteudo}>
        <View style={t.cabecalho}>
          <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
          </TouchableOpacity>
          <Text style={[t.cardTitulo, { fontSize: 16 }]}>Voluntariado</Text>
        </View>

        <Text style={t.titulo}>Doe seu tempo</Text>
        <Text style={t.subtitulo}>
          As ONGs publicam quantas pessoas precisam. Ao ser aceito, você ocupa uma das posições.
        </Text>

        {carregando && vagas.length === 0 ? (
          <Carregando texto="Buscando vagas abertas…" />
        ) : erro && vagas.length === 0 ? (
          <Erro mensagem={erro} onTentarDeNovo={recarregar} />
        ) : vagas.length === 0 ? (
          <Vazio
            icone="people-outline"
            titulo="Nenhuma vaga aberta"
            texto="Assim que uma ONG publicar uma vaga de voluntariado, ela aparece aqui."
          />
        ) : (
          vagas.map((v) => {
            const resultado = feito[v.id];
            const pct =
              v.total_vagas != null && v.total_vagas > 0
                ? Math.min(100, Math.round(((v.preenchidas ?? 0) / v.total_vagas) * 100))
                : null;

            return (
              <View key={v.id} style={t.card}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="shield-checkmark" size={16} color={BRAND.blue} />
                  <Text style={[t.cardLinhaTexto, { color: BRAND.inkSoft }]}>
                    {v.ong?.nome ?? 'ONG parceira'}
                  </Text>
                </View>

                <Text style={[t.cardTitulo, { marginTop: 8 }]}>{v.titulo}</Text>
                {v.descricao ? <Text style={t.cardTexto}>{v.descricao}</Text> : null}

                {/* Preenchimento — mesmo número que a ONG vê no painel */}
                <View style={[t.cardLinha, { gap: 10 }]}>
                  <View style={t.barraBg}>
                    <View
                      style={[
                        t.barraFill,
                        v.cheia && t.barraCheia,
                        { width: pct != null ? `${pct}%` : '0%' },
                      ]}
                    />
                  </View>
                  <Text style={{ fontFamily: 'Nunito_800ExtraBold', fontSize: 13.5, color: v.cheia ? BRAND.success : BRAND.blue }}>
                    {contadorDeVagas(v)}
                  </Text>
                </View>

                {resultado === 'ok' ? (
                  <View style={[t.badge, t.badgeVerde, { marginTop: 12 }]}>
                    <Ionicons name="checkmark-circle" size={13} color={BRAND.success} />
                    <Text style={[t.badgeTexto, t.badgeVerdeTexto]}>
                      Inscrição enviada — aguarde a ONG
                    </Text>
                  </View>
                ) : resultado ? (
                  <View style={[t.badge, t.badgeVermelho, { marginTop: 12 }]}>
                    <Ionicons name="alert-circle" size={13} color={BRAND.danger} />
                    <Text style={[t.badgeTexto, t.badgeVermelhoTexto]}>{resultado}</Text>
                  </View>
                ) : v.cheia ? (
                  <View style={[t.badge, t.badgeAmbar, { marginTop: 12 }]}>
                    <Ionicons name="lock-closed-outline" size={13} color="#8A6100" />
                    <Text style={[t.badgeTexto, t.badgeAmbarTexto]}>Vaga completa</Text>
                  </View>
                ) : aberta === v.id ? (
                  <View style={{ marginTop: 14 }}>
                    <Text style={t.rotulo}>Conte por que você quer ajudar (opcional)</Text>
                    <TextInput
                      style={[t.campo, t.campoMultilinha]}
                      placeholder="Ex.: tenho disponibilidade nos sábados de manhã…"
                      placeholderTextColor={BRAND.inkSoft}
                      multiline
                      value={mensagem}
                      onChangeText={setMensagem}
                    />
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                      <TouchableOpacity
                        style={[t.botaoSecundario, { flex: 1 }]}
                        onPress={() => { setAberta(null); setMensagem(''); }}
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
                    onPress={() => { setAberta(v.id); setMensagem(''); }}
                  >
                    <Ionicons name="hand-right-outline" size={19} color="#fff" />
                    <Text style={t.botaoTexto}>Quero me voluntariar</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Guide" />
    </SafeAreaView>
  );
};

export default VagasScreen;
