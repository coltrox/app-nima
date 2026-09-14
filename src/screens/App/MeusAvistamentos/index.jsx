import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BRAND } from '../../../theme';
import t from '../../../theme/telaStyles';
import { Carregando, Vazio } from '../../components/Estado';
import PrecisaoGps from '../../components/PrecisaoGps';
import avistamentos from '../../../services/avistamentos';

// Histórico local de avistamentos (RF01). Lê só o AsyncStorage: funciona offline.
// Em paisagem vira grade de 2 colunas (RNF02).

const doisDigitos = (n) => String(n).padStart(2, '0');
const formatarData = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()} às ${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
};

const confirmar = (titulo, texto, aoConfirmar) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${texto}`)) aoConfirmar();
    return;
  }
  Alert.alert(titulo, texto, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: aoConfirmar },
  ]);
};

const ItemAvistamento = ({ item, onRemover }) => {
  // A foto mora no cache do app; se o sistema limpou, mostra o espaço vazio.
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const temFoto = item.foto && !fotoFalhou;

  const abrirMapa = () => {
    const { latitude, longitude } = item.coords;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`).catch(() =>
      Alert.alert('Mapa indisponível', 'Não há um app de mapas para abrir o local.')
    );
  };

  return (
    <View style={e.card}>
      {temFoto ? (
        <Image source={{ uri: item.foto }} style={e.foto} onError={() => setFotoFalhou(true)} />
      ) : (
        <View style={[e.foto, e.fotoVazia]}>
          <Ionicons name={item.foto ? 'image-outline' : 'paw'} size={28} color={BRAND.blue} />
          {item.foto ? <Text style={e.meta}>Foto não está mais no aparelho</Text> : null}
        </View>
      )}

      <View style={e.corpo}>
        <View style={e.topo}>
          <Text style={[t.petNome, { flex: 1 }]} numberOfLines={2}>
            {item.descricao || item.petNome}
          </Text>
          <TouchableOpacity onPress={() => onRemover(item)} hitSlop={10} accessibilityLabel="Excluir avistamento">
            <Ionicons name="trash-outline" size={19} color={BRAND.danger} />
          </TouchableOpacity>
        </View>
        <Text style={e.meta}>{formatarData(item.criadoEm)}</Text>

        {item.coords ? (
          <View style={{ marginTop: 10, gap: 6 }}>
            <PrecisaoGps metros={item.precisao} />
            <TouchableOpacity style={e.mapa} onPress={abrirMapa}>
              <Ionicons name="location-outline" size={15} color={BRAND.blue} />
              <Text style={e.mapaTexto}>
                {item.coords.latitude.toFixed(5)}, {item.coords.longitude.toFixed(5)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[e.meta, { marginTop: 8 }]}>Enviado sem localização (GPS indisponível).</Text>
        )}

        {item.observacao ? <Text style={t.cardTexto}>“{item.observacao}”</Text> : null}
      </View>
    </View>
  );
};

const MeusAvistamentosScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const colunas = width > height && width >= 600 ? 2 : 1;
  const pad = Math.max(16, Math.min(width * 0.055, 32));

  const [lista, setLista] = useState(null);

  // Recarrega sempre que a tela ganha foco (ex.: voltando de um novo envio).
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      avistamentos.listar().then((l) => {
        if (ativo) setLista(l);
      });
      return () => {
        ativo = false;
      };
    }, [])
  );

  const remover = (item) =>
    confirmar('Excluir avistamento?', 'O registro sai deste aparelho.', async () => {
      try {
        setLista(await avistamentos.remover(item.id));
      } catch {
        Alert.alert('Não deu para excluir', 'Tente de novo em instantes.');
      }
    });

  return (
    <SafeAreaView style={t.tela} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={[t.cabecalho, { paddingTop: 8, paddingHorizontal: pad }]}>
        <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
        </TouchableOpacity>
        <Text style={[t.cardTitulo, { fontSize: 16 }]}>Meus avistamentos</Text>
      </View>

      {lista === null ? (
        <Carregando texto="Lendo o histórico do aparelho…" />
      ) : (
        <FlatList
          key={colunas} // numColumns não pode mudar sem remontar a lista
          data={lista}
          numColumns={colunas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemAvistamento item={item} onRemover={remover} />}
          columnWrapperStyle={colunas > 1 ? { gap: 12 } : undefined}
          contentContainerStyle={{ paddingHorizontal: pad, paddingTop: 12, paddingBottom: 32, gap: 12 }}
          ListHeaderComponent={
            lista.length > 0 ? (
              <Text style={e.contador}>
                {lista.length} {lista.length === 1 ? 'registro salvo' : 'registros salvos'} neste aparelho · disponível offline
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <Vazio
              icone="eye-outline"
              titulo="Nenhum avistamento ainda"
              texto="Quando você reportar um animal do mural, ele aparece aqui — mesmo sem internet."
              acao="Ir para o mural"
              onAcao={() => navigation.navigate('Desaparecidos')}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const e = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: BRAND.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BRAND.border,
    overflow: 'hidden',
  },
  foto: { width: '100%', height: 170 },
  fotoVazia: { backgroundColor: '#E7EEFB', alignItems: 'center', justifyContent: 'center', gap: 4 },
  corpo: { padding: 14 },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  meta: { fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 2 },
  mapa: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  mapaTexto: { fontSize: 13, fontFamily: 'Nunito_700Bold', color: BRAND.blue },
  contador: { fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: BRAND.inkSoft },
});

export default MeusAvistamentosScreen;
