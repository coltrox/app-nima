// Blocos de estado reaproveitados por todas as telas ligadas no backend:
// carregando, erro (com "Tentar de novo") e vazio.
//
// Importadores: Home, Donation, MyPet, Match, PetDetails, Solicitacoes, Vagas,
// Ongs, Desaparecidos, SmartTag.
import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BRAND } from '../../../theme';

export const Carregando = ({ texto = 'Carregando…' }) => (
  <View style={estilos.bloco}>
    <ActivityIndicator size="large" color={BRAND.blue} />
    <Text style={estilos.texto}>{texto}</Text>
  </View>
);

export const Erro = ({ mensagem, onTentarDeNovo }) => (
  <View style={estilos.bloco}>
    <View style={estilos.iconeCirculo}>
      <Ionicons name="cloud-offline-outline" size={26} color={BRAND.danger} />
    </View>
    <Text style={estilos.titulo}>Não deu para carregar</Text>
    <Text style={estilos.texto}>{mensagem}</Text>
    {onTentarDeNovo ? (
      <TouchableOpacity style={estilos.botao} onPress={() => onTentarDeNovo()} activeOpacity={0.85}>
        <Ionicons name="refresh" size={17} color="#fff" />
        <Text style={estilos.botaoTexto}>Tentar de novo</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export const Vazio = ({ icone = 'paw-outline', titulo, texto, acao, onAcao }) => (
  <View style={estilos.bloco}>
    <View style={[estilos.iconeCirculo, { backgroundColor: '#E7EEFB' }]}>
      <Ionicons name={icone} size={26} color={BRAND.blue} />
    </View>
    <Text style={estilos.titulo}>{titulo}</Text>
    {texto ? <Text style={estilos.texto}>{texto}</Text> : null}
    {acao && onAcao ? (
      <TouchableOpacity style={estilos.botao} onPress={onAcao} activeOpacity={0.85}>
        <Text style={estilos.botaoTexto}>{acao}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

/** Faixa fina de aviso — usada quando os dados vieram, mas com ressalva. */
export const Aviso = ({ texto, icone = 'information-circle-outline' }) => (
  <View style={estilos.aviso}>
    <Ionicons name={icone} size={17} color={BRAND.blue} />
    <Text style={estilos.avisoTexto}>{texto}</Text>
  </View>
);

const estilos = StyleSheet.create({
  bloco: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 28, gap: 10 },
  iconeCirculo: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#FBE9E7',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  titulo: { fontSize: 17, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, textAlign: 'center' },
  texto: { fontSize: 14, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, textAlign: 'center', lineHeight: 20 },
  botao: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: BRAND.blue,
    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 22, marginTop: 8,
  },
  botaoTexto: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 14.5 },
  aviso: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EDF3FE',
    borderRadius: 14, padding: 12, marginHorizontal: 20, marginTop: 12,
  },
  avisoTexto: { flex: 1, fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: BRAND.ink, lineHeight: 18 },
});
