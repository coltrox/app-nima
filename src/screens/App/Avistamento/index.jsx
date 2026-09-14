import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  AppState,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { BRAND } from '../../../theme';
import t from '../../../theme/telaStyles';
import PrecisaoGps from '../../components/PrecisaoGps';
import useAcelerometro from '../../../hooks/useAcelerometro';
import avistamentos from '../../../services/avistamentos';
import { LIMITE_G } from '../../../services/hardware';

// Reportar avistamento de um animal do Mural de Desaparecidos.
//
// Junta os recursos nativos do desafio:
//  - Câmera com tratamento de "Não perguntar novamente" (canAskAgain: false);
//  - GPS com selo de precisão (RF02);
//  - Trava de segurança do acelerômetro no envio (> 2.0g bloqueia);
//  - Registro salvo no aparelho (RF01) — ver services/avistamentos.
// Qualquer recurso ausente vira mensagem na tela, nunca crash (RNF01).

const TEMPO_GPS_MS = 15000;
const DESCONHECIDO = { id: 'desconhecido', nome: 'Não sei qual é' };

const comTempoLimite = (promessa, ms) =>
  Promise.race([promessa, new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error('timeout')), ms))]);

const PASSOS_CONFIG_CAMERA =
  Platform.OS === 'ios'
    ? ['Toque em "Abrir configurações" abaixo.', 'Ative a chave "Câmera".', 'Volte para o Nima e toque em "Tirar foto".']
    : [
        'Toque em "Abrir configurações" abaixo.',
        'Entre em "Permissões" e depois em "Câmera".',
        'Escolha "Permitir durante o uso do app".',
        'Volte para o Nima e toque em "Tirar foto".',
      ];

const AvistamentoScreen = ({ navigation, route }) => {
  const { width, height } = useWindowDimensions();
  const paisagem = width > height;

  const pets = [...(route.params?.pets || []), DESCONHECIDO];
  const [petId, setPetId] = useState(route.params?.petId ?? null);

  // ---------- Câmera ----------
  // 'livre' | 'negada' (pode pedir de novo) | 'bloqueada' (canAskAgain: false) | 'indisponivel'
  const [camera, setCamera] = useState('livre');
  const [foto, setFoto] = useState(null);

  const tirarFoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        setCamera(perm.canAskAgain ? 'negada' : 'bloqueada');
        return;
      }
      setCamera('livre');
      const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.5 });
      if (!r.canceled && r.assets?.[0]?.uri) setFoto(r.assets[0].uri);
    } catch {
      // Emulador sem câmera, câmera em uso por outro app, preview web…
      setCamera('indisponivel');
    }
  };

  const escolherDaGaleria = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Galeria sem permissão', 'Libere o acesso às fotos nas configurações do aparelho.');
        return;
      }
      const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
      if (!r.canceled && r.assets?.[0]?.uri) setFoto(r.assets[0].uri);
    } catch {
      Alert.alert('Galeria indisponível', 'Não foi possível abrir as fotos deste aparelho.');
    }
  };

  const abrirConfiguracoes = () => {
    Linking.openSettings().catch(() =>
      Alert.alert('Abra manualmente', 'Vá em Configurações > Apps > Nima (ou Expo Go) > Permissões.')
    );
  };

  // Quando o usuário volta das Configurações, confere se ele liberou a câmera.
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (estado) => {
      if (estado !== 'active' || camera !== 'bloqueada') return;
      try {
        const perm = await ImagePicker.getCameraPermissionsAsync();
        if (perm.granted) setCamera('livre');
      } catch {
        // mantém o aviso na tela
      }
    });
    return () => sub.remove();
  }, [camera]);

  // ---------- GPS ----------
  // estado: 'buscando' | 'ok' | 'desligado' | 'negado' | 'bloqueado' | 'erro'
  const [gps, setGps] = useState({ estado: 'buscando' });

  const lerGps = useCallback(async () => {
    setGps({ estado: 'buscando' });
    try {
      const ligado = await Location.hasServicesEnabledAsync();
      if (!ligado) {
        setGps({ estado: 'desligado' });
        return;
      }
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        setGps({ estado: perm.canAskAgain ? 'negado' : 'bloqueado' });
        return;
      }
      let pos;
      try {
        pos = await comTempoLimite(
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
          TEMPO_GPS_MS
        );
      } catch {
        // Sem fix a tempo (lugar fechado): usa a última posição conhecida.
        pos = await Location.getLastKnownPositionAsync();
      }
      if (!pos?.coords) {
        setGps({ estado: 'erro' });
        return;
      }
      const { latitude, longitude, accuracy } = pos.coords;
      setGps({ estado: 'ok', coords: { latitude, longitude }, precisao: accuracy });
    } catch {
      setGps({ estado: 'erro' });
    }
  }, []);

  useEffect(() => {
    lerGps();
  }, [lerGps]);

  // ---------- Acelerômetro + envio ----------
  const acelerometro = useAcelerometro();
  const [observacao, setObservacao] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  const enviar = async () => {
    setErroEnvio(null);
    if (!petId) {
      setErroEnvio('Escolha qual animal você viu.');
      return;
    }

    setVerificando(true);
    const { disponivel, estavel, pico } = await acelerometro.verificarEstabilidade();
    setVerificando(false);

    if (disponivel && !estavel) {
      const detalhe = `Pico de ${pico.toFixed(2)}g (limite ${LIMITE_G.toFixed(1)}g). Segure o celular firme, fique parado e envie de novo.`;
      setErroEnvio(`Instabilidade Física Detectada. ${detalhe}`);
      Alert.alert('Instabilidade Física Detectada', detalhe);
      return;
    }

    setSalvando(true);
    try {
      const pet = pets.find((p) => p.id === petId);
      await avistamentos.salvar({
        petId,
        petNome: pet?.nome || DESCONHECIDO.nome,
        foto,
        observacao: observacao.trim(),
        coords: gps.coords || null,
        precisao: Number.isFinite(gps.precisao) ? gps.precisao : null,
        picoG: pico,
        sensorDisponivel: disponivel,
      });
      Alert.alert('Avistamento registrado', 'Salvo neste aparelho. Consulte em "Meus avistamentos", mesmo sem internet.');
      navigation.replace('MeusAvistamentos');
    } catch {
      setErroEnvio('Não foi possível salvar no aparelho. Verifique o armazenamento e tente de novo.');
    } finally {
      setSalvando(false);
    }
  };

  const ocupado = verificando || salvando;

  // ---------- Blocos ----------
  const blocoPet = (
    <View style={t.card}>
      <Text style={t.cardTitulo}>Qual animal você viu?</Text>
      <View style={e.chips}>
        {pets.map((p) => {
          const ativo = p.id === petId;
          return (
            <TouchableOpacity
              key={String(p.id)}
              style={[e.chip, ativo && e.chipAtivo]}
              onPress={() => setPetId(p.id)}
              activeOpacity={0.85}
            >
              <Text style={[e.chipTexto, ativo && e.chipTextoAtivo]} numberOfLines={1}>
                {p.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const blocoFoto = (
    <View style={t.card}>
      <Text style={t.cardTitulo}>Foto do animal</Text>

      {foto ? (
        <Image source={{ uri: foto }} style={[e.foto, { height: paisagem ? 150 : 210 }]} resizeMode="cover" />
      ) : (
        <View style={[e.fotoVazia, { height: paisagem ? 110 : 150 }]}>
          <Ionicons name="camera-outline" size={34} color={BRAND.blue} />
          <Text style={t.cardTexto}>Uma foto ajuda a ONG a confirmar que é o mesmo animal.</Text>
        </View>
      )}

      {camera === 'bloqueada' ? (
        <View style={e.alerta}>
          <View style={e.alertaTopo}>
            <Ionicons name="lock-closed" size={18} color={BRAND.danger} />
            <Text style={e.alertaTitulo}>Acesso à câmera bloqueado</Text>
          </View>
          <Text style={e.alertaTexto}>
            Você marcou "Não perguntar novamente", então o app não pode mais pedir a permissão sozinho. Para liberar:
          </Text>
          {PASSOS_CONFIG_CAMERA.map((passo, i) => (
            <Text key={passo} style={e.passo}>
              {i + 1}. {passo}
            </Text>
          ))}
          <TouchableOpacity style={[t.botao, { marginTop: 10 }]} onPress={abrirConfiguracoes} activeOpacity={0.85}>
            <Ionicons name="settings-outline" size={18} color="#fff" />
            <Text style={t.botaoTexto}>Abrir configurações</Text>
          </TouchableOpacity>
        </View>
      ) : camera === 'negada' ? (
        <View style={[e.alerta, e.alertaAmbar]}>
          <Text style={[e.alertaTexto, { color: '#8A6100' }]}>
            Sem a permissão da câmera não dá para tirar a foto. Toque em "Tirar foto" e escolha "Permitir".
          </Text>
        </View>
      ) : camera === 'indisponivel' ? (
        <View style={[e.alerta, e.alertaAmbar]}>
          <Text style={[e.alertaTexto, { color: '#8A6100' }]}>
            Não encontramos uma câmera disponível neste aparelho. Você pode enviar uma foto da galeria.
          </Text>
        </View>
      ) : null}

      <View style={e.linhaBotoes}>
        <TouchableOpacity style={[t.botao, e.botaoFlex]} onPress={tirarFoto} activeOpacity={0.85}>
          <Ionicons name="camera" size={18} color="#fff" />
          <Text style={t.botaoTexto}>{foto ? 'Tirar outra' : 'Tirar foto'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[t.botaoSecundario, e.botaoFlex]} onPress={escolherDaGaleria} activeOpacity={0.85}>
          <Ionicons name="images-outline" size={18} color={BRAND.blue} />
          <Text style={t.botaoSecundarioTexto}>Galeria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const mensagemGps = {
    desligado: 'O GPS do aparelho está desligado. Ative a localização e toque em "Atualizar".',
    negado: 'Sem permissão de localização. Toque em "Atualizar" e escolha "Permitir".',
    bloqueado: 'A localização foi bloqueada para o app. Libere nas configurações do aparelho.',
    erro: 'Não conseguimos obter sua posição agora. Você ainda pode enviar sem localização.',
  }[gps.estado];

  const blocoGps = (
    <View style={t.card}>
      <View style={e.tituloLinha}>
        <Text style={t.cardTitulo}>Onde você viu</Text>
        <TouchableOpacity style={e.atualizar} onPress={lerGps} disabled={gps.estado === 'buscando'}>
          <Ionicons name="refresh" size={16} color={BRAND.blue} />
          <Text style={e.atualizarTexto}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      {gps.estado === 'buscando' ? (
        <View style={t.cardLinha}>
          <ActivityIndicator color={BRAND.blue} />
          <Text style={t.cardLinhaTexto}>Buscando sinal de GPS…</Text>
        </View>
      ) : gps.estado === 'ok' ? (
        <View style={{ marginTop: 10, gap: 8 }}>
          <PrecisaoGps metros={gps.precisao} comDica />
          <Text style={e.coords}>
            {gps.coords.latitude.toFixed(5)}, {gps.coords.longitude.toFixed(5)}
          </Text>
        </View>
      ) : (
        <View style={[e.alerta, e.alertaAmbar]}>
          <Text style={[e.alertaTexto, { color: '#8A6100' }]}>{mensagemGps}</Text>
          {gps.estado === 'bloqueado' ? (
            <TouchableOpacity onPress={abrirConfiguracoes} style={{ marginTop: 6 }}>
              <Text style={e.atualizarTexto}>Abrir configurações</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );

  const acima = acelerometro.atual > LIMITE_G;
  const blocoEstabilidade = (
    <View style={t.card}>
      <Text style={t.cardTitulo}>Estabilidade do aparelho</Text>
      {acelerometro.disponivel === false ? (
        <Text style={t.cardTexto}>
          Sensor de movimento indisponível neste aparelho. A trava de segurança fica desativada, mas o envio continua funcionando.
        </Text>
      ) : (
        <>
          <View style={[t.cardLinha, { gap: 10 }]}>
            <View style={t.barraBg}>
              <View
                style={[
                  t.barraFill,
                  {
                    width: `${Math.min(acelerometro.atual / 3, 1) * 100}%`,
                    backgroundColor: acima ? BRAND.danger : BRAND.success,
                  },
                ]}
              />
            </View>
            <Text style={[e.valorG, { color: acima ? BRAND.danger : BRAND.ink }]}>
              {acelerometro.atual.toFixed(2)} g
            </Text>
          </View>
          <Text style={t.cardTexto}>
            Parado, o celular marca cerca de 1g. Acima de {LIMITE_G.toFixed(1)}g (tranco ou queda) o envio é bloqueado.
          </Text>
        </>
      )}
    </View>
  );

  const blocoEnvio = (
    <>
      <View style={t.card}>
        <Text style={t.rotulo}>Observação (opcional)</Text>
        <TextInput
          style={[t.campo, t.campoMultilinha]}
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Ex.: estava perto da praça, com coleira azul"
          placeholderTextColor={BRAND.inkSoft}
          multiline
          maxLength={280}
        />
      </View>

      {erroEnvio ? (
        <View style={[e.alerta, e.alertaEnvio]}>
          <View style={e.alertaTopo}>
            <Ionicons name="warning" size={18} color={BRAND.danger} />
            <Text style={[e.alertaTexto, { flex: 1, marginTop: 0, color: BRAND.danger, fontFamily: 'Nunito_700Bold' }]}>
              {erroEnvio}
            </Text>
          </View>
        </View>
      ) : null}

      <TouchableOpacity
        style={[t.botao, e.enviar, ocupado && t.botaoDesabilitado]}
        onPress={enviar}
        disabled={ocupado}
        activeOpacity={0.85}
      >
        {ocupado ? <ActivityIndicator color="#8A8577" /> : <Ionicons name="send" size={18} color="#fff" />}
        <Text style={[t.botaoTexto, ocupado && t.botaoTextoDesabilitado]}>
          {verificando ? 'Mantenha o celular firme…' : salvando ? 'Salvando…' : 'Enviar avistamento'}
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={t.tela} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={t.scroll} contentContainerStyle={t.conteudoSemBarra} keyboardShouldPersistTaps="handled">
        <View style={[t.cabecalho, { paddingTop: 8 }]}>
          <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
          </TouchableOpacity>
          <Text style={[t.cardTitulo, { fontSize: 16 }]}>Reportar avistamento</Text>
          <TouchableOpacity
            style={t.cabecalhoDireita}
            onPress={() => navigation.navigate('MeusAvistamentos')}
            accessibilityLabel="Meus avistamentos"
          >
            <Ionicons name="time-outline" size={22} color={BRAND.blue} />
          </TouchableOpacity>
        </View>

        <Text style={t.titulo}>Viu um deles?</Text>
        <Text style={t.subtitulo}>Foto, localização e um recado. Tudo fica salvo no seu celular, mesmo offline.</Text>

        {paisagem ? (
          <View style={e.colunas}>
            <View style={e.coluna}>
              {blocoPet}
              {blocoFoto}
            </View>
            <View style={e.coluna}>
              {blocoGps}
              {blocoEstabilidade}
              {blocoEnvio}
            </View>
          </View>
        ) : (
          <>
            {blocoPet}
            {blocoFoto}
            {blocoGps}
            {blocoEstabilidade}
            {blocoEnvio}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const e = StyleSheet.create({
  colunas: { flexDirection: 'row', alignItems: 'flex-start' },
  coluna: { flex: 1, minWidth: 0 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    maxWidth: '100%',
    borderWidth: 1.5,
    borderColor: BRAND.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: BRAND.card,
  },
  chipAtivo: { borderColor: BRAND.blue, backgroundColor: '#E7EEFB' },
  chipTexto: { fontSize: 13.5, fontFamily: 'Nunito_600SemiBold', color: BRAND.ink },
  chipTextoAtivo: { color: BRAND.blue, fontFamily: 'Nunito_800ExtraBold' },

  foto: { width: '100%', borderRadius: 14, marginTop: 12 },
  fotoVazia: {
    width: '100%',
    borderRadius: 14,
    marginTop: 12,
    backgroundColor: '#F3F6FC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },

  linhaBotoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  botaoFlex: { flexGrow: 1, flexBasis: 130, paddingHorizontal: 12 },

  alerta: { backgroundColor: '#FBE9E7', borderRadius: 14, padding: 13, marginTop: 12 },
  alertaAmbar: { backgroundColor: '#FFF3D6' },
  alertaEnvio: { marginHorizontal: '5.5%' },
  alertaTopo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alertaTitulo: { fontSize: 14.5, fontFamily: 'Nunito_800ExtraBold', color: BRAND.danger },
  alertaTexto: { fontSize: 13.5, fontFamily: 'Nunito_600SemiBold', color: BRAND.ink, lineHeight: 19, marginTop: 4 },
  passo: { fontSize: 13.5, fontFamily: 'Nunito_400Regular', color: BRAND.ink, lineHeight: 20, marginTop: 2 },

  tituloLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  atualizar: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  atualizarTexto: { fontSize: 13.5, fontFamily: 'Nunito_700Bold', color: BRAND.blue },
  coords: { fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: BRAND.inkSoft },

  valorG: { width: 64, textAlign: 'right', fontSize: 15, fontFamily: 'Nunito_800ExtraBold' },

  enviar: { marginTop: 16, marginHorizontal: '5.5%' },
});

export default AvistamentoScreen;
