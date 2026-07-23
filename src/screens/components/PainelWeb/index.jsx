import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../Logo';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';

// Tela mostrada quando uma conta de ONG ou de desenvolvedor entra no app.
//
// Por quê: o app é a superfície do TUTOR. Gestão de acervo, homologação,
// candidaturas, vaquinhas, Patinhas, equipe e log de atividades existem só no
// painel web — nenhuma dessas rotas de escrita tem tela mobile. As antigas
// AdminDashboard/OngDashboard eram grades de botões que não faziam nada.
//
// Importadores: src/screens/Admin/Dashboard/index.jsx e
// src/screens/Ong/Dashboard/index.jsx.

const URL_PAINEL = 'https://nima.app.br';

const CHAVES_SESSAO = [
  '@nima_token',
  '@nima_user_role',
  '@nima_user_name',
  '@nima_remember_me',
  '@nima_profile_completed',
];

const PainelWeb = ({ navigation, perfil = 'ong' }) => {
  const ehDev = perfil === 'dev';

  const sair = async () => {
    try {
      await AsyncStorage.multiRemove(CHAVES_SESSAO);
    } catch {
      // segue pro login de qualquer forma
    }
    navigation.replace('Login');
  };

  const recursos = ehDev
    ? [
        ['shield-checkmark-outline', 'Homologar ONGs'],
        ['people-outline', 'Gerir usuários e equipes'],
        ['pricetags-outline', 'Fabricar Patinhas em lote'],
        ['stats-chart-outline', 'Visão geral do ecossistema'],
      ]
    : [
        ['paw-outline', 'Cadastrar e editar pets'],
        ['clipboard-outline', 'Analisar candidaturas com o parecer da IA'],
        ['heart-outline', 'Publicar vaquinhas e vagas'],
        ['list-outline', 'Equipe, permissões e log de atividades'],
      ];

  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={t.scroll} contentContainerStyle={t.conteudoSemBarra} showsVerticalScrollIndicator={false}>
        <View style={t.cabecalho}>
          <Logo height={26} />
          <TouchableOpacity style={[t.voltar, { marginLeft: 'auto' }]} onPress={sair}>
            <Ionicons name="log-out-outline" size={20} color={BRAND.danger} />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', marginTop: 30, paddingHorizontal: PAD }}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: '#E7EEFB',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={ehDev ? 'construct-outline' : 'business-outline'} size={38} color={BRAND.blue} />
          </View>
        </View>

        <Text style={[t.titulo, { textAlign: 'center' }]}>
          {ehDev ? 'Painel do desenvolvedor' : 'Painel da ONG'}
        </Text>
        <Text style={[t.subtitulo, { textAlign: 'center' }]}>
          A gestão acontece no painel web. O aplicativo é a superfície do tutor —
          adoção, Patinha e apoio às campanhas.
        </Text>

        <View style={[t.card, { marginTop: 22 }]}>
          <Text style={t.cardTitulo}>O que você faz por lá</Text>
          {recursos.map(([icone, texto]) => (
            <View key={texto} style={t.cardLinha}>
              <Ionicons name={icone} size={17} color={BRAND.blue} />
              <Text style={t.cardLinhaTexto}>{texto}</Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: PAD, marginTop: 20, gap: 12 }}>
          <TouchableOpacity
            style={t.botao}
            activeOpacity={0.85}
            onPress={() => Linking.openURL(URL_PAINEL).catch(() => {})}
          >
            <Ionicons name="open-outline" size={19} color="#fff" />
            <Text style={t.botaoTexto}>Abrir o painel web</Text>
          </TouchableOpacity>

          <TouchableOpacity style={t.botaoSecundario} activeOpacity={0.85} onPress={() => navigation.replace('Home')}>
            <Ionicons name="home-outline" size={18} color={BRAND.blue} />
            <Text style={t.botaoSecundarioTexto}>Ver o app como visitante</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 12 }} onPress={sair}>
            <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 14.5, color: BRAND.danger }}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PainelWeb;
