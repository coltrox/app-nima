import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Anel de progresso sem dependência de SVG (o projeto não tem react-native-svg).
//
// Como funciona: um anel de borda "meio colorido" (só borderTop + borderRight,
// que juntos cobrem exatamente 180°) é desenhado duas vezes, cada cópia dentro
// de um container que recorta metade do círculo. Girando cada cópia, a metade
// colorida entra na área visível aos poucos — é isso que preenche o arco.
//
// Rotações (0° = 12h, sentido horário):
//   metade direita  → começa em -135° (arco escondido na esquerda) e vai até 45°
//   metade esquerda → começa em  45°  (arco escondido na direita) e vai até 225°
//
// Importadores: Questionário (progresso do perfil) e Profile.

const Anel = ({
  pct = 0,
  size = 120,
  espessura = 11,
  cor = '#3B82F6',
  trilha = 'rgba(255,255,255,0.18)',
  children,
}) => {
  const p = Math.max(0, Math.min(100, Number(pct) || 0));
  const metade = size / 2;

  // Cada metade do anel cobre 50% do total.
  const grausDireita = (Math.min(p, 50) / 50) * 180;
  const grausEsquerda = p <= 50 ? 0 : ((p - 50) / 50) * 180;

  const anelBase = {
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: metade,
    borderWidth: espessura,
    borderTopColor: cor,
    borderRightColor: cor,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* trilha */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: metade,
          borderWidth: espessura,
          borderColor: trilha,
        }}
      />

      {/* metade direita */}
      <View style={[s.recorte, { top: 0, left: metade, width: metade, height: size }]}>
        <View style={[anelBase, { left: -metade, transform: [{ rotate: `${grausDireita - 135}deg` }] }]} />
      </View>

      {/* metade esquerda */}
      <View style={[s.recorte, { top: 0, left: 0, width: metade, height: size }]}>
        <View style={[anelBase, { left: 0, transform: [{ rotate: `${grausEsquerda + 45}deg` }] }]} />
      </View>

      <View style={s.centro}>{children ?? <Text style={s.pct}>{Math.round(p)}%</Text>}</View>
    </View>
  );
};

const s = StyleSheet.create({
  recorte: { position: 'absolute', overflow: 'hidden' },
  centro: { alignItems: 'center', justifyContent: 'center' },
  pct: { fontSize: 26, fontFamily: 'Nunito_800ExtraBold', color: '#fff' },
});

export default Anel;
