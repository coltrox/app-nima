// Selo colorido de qualidade do GPS (RF02): verde < 10 m, amarelo 10–30 m,
// vermelho > 30 m. A regra mora em services/hardware.
//
// Importadores: App/Avistamento, App/MeusAvistamentos.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { classificarPrecisao } from '../../../services/hardware';

const PrecisaoGps = ({ metros, comDica = false }) => {
  const p = classificarPrecisao(metros);
  return (
    <View style={{ gap: 6 }}>
      <View
        style={[estilos.selo, { backgroundColor: p.fundo }]}
        accessibilityLabel={`${p.rotulo}${Number.isFinite(metros) ? `, margem de ${Math.round(metros)} metros` : ''}`}
      >
        <View style={[estilos.ponto, { backgroundColor: p.cor }]} />
        <Text style={[estilos.texto, { color: p.texto }]}>
          {p.rotulo}
          {Number.isFinite(metros) ? ` · ±${Math.round(metros)} m` : ''}
        </Text>
      </View>
      {comDica ? <Text style={estilos.dica}>{p.dica}</Text> : null}
    </View>
  );
};

const estilos = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  ponto: { width: 10, height: 10, borderRadius: 5 },
  texto: { fontSize: 12.5, fontFamily: 'Nunito_700Bold' },
  dica: { fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: '#5A6B7E', lineHeight: 17 },
});

export default PrecisaoGps;
