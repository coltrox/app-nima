// Faixa fixa no topo avisando que o app está em MODO DEMONSTRAÇÃO.
//
// Por que existe: numa feira, alguém vai perguntar "isso é dado real?". Esconder
// que o servidor caiu seria desonesto e, pior, arriscado — se o avaliador
// descobre sozinho, a credibilidade do trabalho inteiro cai. Com o selo, a
// resposta vira uma demonstração de engenharia: "o servidor está fora e o app
// continuou funcionando, porque o requisito RNF01 é degradação graciosa".
//
// Fica sobre a navegação, não dentro dela, para aparecer em qualquer tela sem
// que nenhuma delas precise saber que o modo demonstração existe.

import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Platform, StatusBar } from 'react-native';
import { demoAtivo, aoMudarDemo } from '../../../demo/modoDemo';
import { BRAND } from '../../../theme';

// Sem `useSafeAreaInsets` de propósito: o App.js não tem SafeAreaProvider na
// raiz (cada tela monta o seu SafeAreaView), e o hook LANÇA exceção fora do
// provider — derrubaria o app inteiro só para posicionar uma faixa. O recuo do
// topo é calculado direto: no Android o StatusBar informa a altura; no iOS
// 44 cobre a ilha/notch dos aparelhos atuais.
const RECUO_TOPO = Platform.select({
  android: (StatusBar.currentHeight ?? 24) + 4,
  ios: 44,
  default: 8,
});

export default function SeloDemo() {
  const [ativo, setAtivo] = useState(demoAtivo());

  useEffect(() => aoMudarDemo(setAtivo), []);

  if (!ativo) return null;

  return (
    <View
      // `none` deixa o toque passar para a tela: o selo informa, não bloqueia.
      pointerEvents="none"
      style={[estilos.faixa, { paddingTop: RECUO_TOPO }]}
    >
      <Text style={estilos.texto} numberOfLines={1}>
        MODO DEMONSTRAÇÃO · sem conexão com o servidor
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  faixa: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingBottom: 6,
    paddingHorizontal: 12,
    backgroundColor: BRAND.honey,
    alignItems: 'center',
    justifyContent: 'center',
    // No Android, sem elevação a faixa fica atrás de alguns cards.
    ...(Platform.OS === 'android' ? { elevation: 12 } : null),
  },
  texto: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    letterSpacing: 0.6,
    color: BRAND.ink,
  },
});
