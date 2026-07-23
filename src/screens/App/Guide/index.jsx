import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import Campo from '../../components/Campo';
import { Carregando, Erro, Vazio, Aviso } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import guiaService from '../../../services/guiaService';
import CONTEUDO_PADRAO from './conteudoPadrao';

// Tela Guia — conteúdo vindo de GET /api/guias, cadastrado pelo dev no painel.
//
// Estrutura: faixa de "leitura rápida" no topo, filtro por categoria, e a lista
// completa da categoria escolhida. Tocar num guia abre a leitura em tela cheia.
//
// Enquanto não houver nada cadastrado, cai em conteudoPadrao.js — a tela nunca
// aparece vazia, mas as duas fontes NÃO se misturam: ou é tudo da API, ou é
// tudo local, com aviso.

// Ícone por categoria quando o guia não trouxe um.
const ICONE_CATEGORIA = {
  'Saúde': 'medkit-outline',
  'Bem-estar': 'happy-outline',
  'Alimentação': 'nutrition-outline',
  'Adestramento': 'megaphone-outline',
  'Segurança': 'shield-checkmark-outline',
};

// ~200 palavras por minuto, mínimo de 1.
const tempoDeLeitura = (texto) =>
  `${Math.max(1, Math.round(String(texto || '').split(/\s+/).length / 200))} min de leitura`;

const GuideScreen = ({ navigation }) => {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [aberto, setAberto] = useState(null);

  const { dados, carregando, erro, recarregar } = useCarregar(() => guiaService.listar(), { inicial: [] });

  const daApi = dados || [];
  const usandoPadrao = !carregando && daApi.length === 0;
  const guias = usandoPadrao ? CONTEUDO_PADRAO : daApi;

  const categorias = useMemo(() => {
    const vistas = [];
    for (const g of guias) {
      if (g.categoria && !vistas.includes(g.categoria)) vistas.push(g.categoria);
    }
    return vistas;
  }, [guias]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return guias.filter((g) => {
      if (categoria !== 'todas' && g.categoria !== categoria) return false;
      if (!termo) return true;
      return `${g.titulo} ${g.resumo ?? ''} ${g.categoria ?? ''}`.toLowerCase().includes(termo);
    });
  }, [guias, categoria, busca]);

  const rapidos = filtrados.filter((g) => g.tipo === 'rapido');
  const completos = filtrados.filter((g) => g.tipo !== 'rapido');

  const iconeDe = (g) => g.icone || ICONE_CATEGORIA[g.categoria] || 'book-outline';

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

        <Text style={t.titulo}>Guia de cuidados</Text>
        <Text style={t.subtitulo}>O essencial para cuidar bem, do primeiro dia em diante.</Text>

        <Campo
          icone="search"
          placeholder="Buscar por assunto"
          value={busca}
          onChangeText={setBusca}
          containerStyle={{ marginHorizontal: PAD, marginTop: 16 }}
        />

        {/* Filtro por categoria */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: PAD, gap: 8, marginTop: 14 }}
        >
          {['todas', ...categorias].map((c) => {
            const ativo = categoria === c;
            return (
              <TouchableOpacity
                key={c}
                style={[
                  t.badge,
                  ativo ? { backgroundColor: BRAND.blue } : t.badgeAzul,
                  { paddingVertical: 9, paddingHorizontal: 15 },
                ]}
                onPress={() => setCategoria(c)}
                activeOpacity={0.85}
              >
                {c !== 'todas' ? (
                  <Ionicons
                    name={ICONE_CATEGORIA[c] || 'book-outline'}
                    size={14}
                    color={ativo ? '#fff' : BRAND.blue}
                  />
                ) : null}
                <Text
                  style={[t.badgeTexto, ativo ? { color: '#fff' } : t.badgeAzulTexto, { fontSize: 13.5 }]}
                >
                  {c === 'todas' ? 'Todos' : c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {usandoPadrao ? (
          <Aviso texto="Conteúdo inicial do app. Os guias publicados pela Nima aparecem aqui assim que forem cadastrados." />
        ) : null}

        {carregando && daApi.length === 0 ? (
          <Carregando texto="Carregando os guias…" />
        ) : erro && daApi.length === 0 && !usandoPadrao ? (
          <Erro mensagem={erro} onTentarDeNovo={recarregar} />
        ) : filtrados.length === 0 ? (
          <Vazio
            icone="book-outline"
            titulo="Nada encontrado"
            texto="Tente outro termo ou volte para todas as categorias."
          />
        ) : (
          <>
            {rapidos.length > 0 && (
              <>
                <Text style={t.secao}>Leitura rápida</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: PAD, gap: 12 }}
                >
                  {rapidos.map((g) => (
                    <TouchableOpacity
                      key={g.id}
                      style={{
                        width: 230,
                        backgroundColor: '#EDF3FE',
                        borderRadius: 18,
                        padding: 16,
                        gap: 8,
                      }}
                      activeOpacity={0.88}
                      onPress={() => setAberto(g)}
                    >
                      <Ionicons name={iconeDe(g)} size={26} color={BRAND.blue} />
                      <Text style={[t.cardTitulo, { fontSize: 16 }]} numberOfLines={2}>{g.titulo}</Text>
                      {g.resumo ? (
                        <Text style={[t.cardTexto, { marginTop: 0 }]} numberOfLines={2}>{g.resumo}</Text>
                      ) : null}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                        <Ionicons name="time-outline" size={13} color={BRAND.blue} />
                        <Text style={{ fontSize: 12, fontFamily: 'Nunito_700Bold', color: BRAND.blue }}>
                          {tempoDeLeitura(g.conteudo)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {completos.length > 0 && (
              <>
                <Text style={t.secao}>
                  {categoria === 'todas' ? 'Todos os guias' : categoria}
                </Text>
                {completos.map((g) => (
                  <TouchableOpacity
                    key={g.id}
                    style={[t.card, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}
                    activeOpacity={0.88}
                    onPress={() => setAberto(g)}
                  >
                    <View
                      style={{
                        width: 48, height: 48, borderRadius: 14, backgroundColor: '#E7EEFB',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Ionicons name={iconeDe(g)} size={23} color={BRAND.blue} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={[t.badge, t.badgeAzul, { marginBottom: 6 }]}>
                        <Text style={[t.badgeTexto, t.badgeAzulTexto, { fontSize: 11 }]}>
                          {String(g.categoria || 'Geral').toUpperCase()}
                        </Text>
                      </View>
                      <Text style={t.cardTitulo} numberOfLines={2}>{g.titulo}</Text>
                      {g.resumo ? (
                        <Text style={t.cardTexto} numberOfLines={2}>{g.resumo}</Text>
                      ) : null}
                      <Text style={[t.cardTexto, { fontSize: 12, marginTop: 6 }]}>
                        {tempoDeLeitura(g.conteudo)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#C7CFD9" />
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}

        {/* Atalho para o voluntariado — conteúdo puxa ação */}
        <TouchableOpacity
          style={[t.card, { backgroundColor: BRAND.navy, borderColor: BRAND.navy, marginTop: 22 }]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Vagas')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="hand-right-outline" size={26} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={[t.cardTitulo, { color: '#fff' }]}>Quer ajudar de perto?</Text>
              <Text style={[t.cardTexto, { color: 'rgba(255,255,255,0.75)' }]}>
                Veja as vagas de voluntariado abertas nas ONGs.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Leitura em tela cheia */}
      <Modal visible={!!aberto} animationType="slide" onRequestClose={() => setAberto(null)}>
        <SafeAreaView style={t.tela}>
          <View style={t.cabecalho}>
            <TouchableOpacity style={t.voltar} onPress={() => setAberto(null)}>
              <Ionicons name="close" size={20} color={BRAND.ink} />
            </TouchableOpacity>
            <Text style={[t.cardTitulo, { fontSize: 16 }]}>{aberto?.categoria}</Text>
          </View>

          <ScrollView style={t.scroll} contentContainerStyle={t.conteudoSemBarra} showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: PAD, marginTop: 16 }}>
              <View
                style={{
                  width: 60, height: 60, borderRadius: 18, backgroundColor: '#E7EEFB',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Ionicons name={aberto ? iconeDe(aberto) : 'book-outline'} size={28} color={BRAND.blue} />
              </View>
            </View>

            <Text style={t.titulo}>{aberto?.titulo}</Text>
            {aberto?.resumo ? <Text style={t.subtitulo}>{aberto.resumo}</Text> : null}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginHorizontal: PAD, marginTop: 10 }}>
              <Ionicons name="time-outline" size={14} color={BRAND.inkSoft} />
              <Text style={{ fontSize: 12.5, fontFamily: 'Nunito_600SemiBold', color: BRAND.inkSoft }}>
                {tempoDeLeitura(aberto?.conteudo)}
              </Text>
            </View>

            <View style={[t.card, { marginTop: 18 }]}>
              <Text style={{ fontSize: 15.5, fontFamily: 'Nunito_400Regular', color: BRAND.ink, lineHeight: 25 }}>
                {aberto?.conteudo}
              </Text>
            </View>

            <View style={[t.card, { backgroundColor: '#EDF3FE', borderColor: '#D6E3FA' }]}>
              <Text style={t.cardTexto}>
                Este guia é material informativo e não substitui consulta veterinária.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Navbar navigation={navigation} currentRoute="Guide" />
    </SafeAreaView>
  );
};

export default GuideScreen;
