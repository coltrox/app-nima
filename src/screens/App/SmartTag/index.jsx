import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView,
  StatusBar, ActivityIndicator, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/Logo';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import tagService from '../../../services/tagService';
import { mensagemDoErro } from '../../../services/http';

// Consulta de Patinha (RF14/RF17).
//
// A rota GET /api/tag/:codigo é PÚBLICA: quem acha o animal na rua consulta sem
// ter conta. Cada consulta é registrada em `leituras_tag` pelo backend — é assim
// que o histórico do MyPet se alimenta.
//
// O app NÃO lê NFC por hardware: não há lib de NFC no projeto. Aqui o código é
// digitado. Ver docs/ALINHAMENTO-BACKEND.md, item "leitura NFC nativa".

const SmartTagScreen = ({ navigation, route }) => {
  const [codigo, setCodigo] = useState(route?.params?.codigo ?? '');
  const [consultando, setConsultando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const consultar = useCallback(async (valor) => {
    const alvo = (valor ?? codigo).trim();
    if (!alvo) return;
    setConsultando(true);
    setErro(null);
    setResultado(null);
    try {
      setResultado(await tagService.ler(alvo));
    } catch (e) {
      setErro(mensagemDoErro(e, 'Não foi possível consultar essa Patinha.'));
    } finally {
      setConsultando(false);
    }
  }, [codigo]);

  // Veio do MyPet já com o código do pet: consulta sozinho.
  useEffect(() => {
    const inicial = route?.params?.codigo;
    if (inicial) consultar(inicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.codigo]);

  const abrirWhatsapp = (numero) => {
    const limpo = String(numero).replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${limpo}`).catch(() => {});
  };

  const animal = resultado?.animal ?? null;
  const contato = resultado?.contato ?? null;

  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={t.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={t.conteudoSemBarra}>
        <View style={t.cabecalho}>
          <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
          </TouchableOpacity>
          <Logo height={24} />
        </View>

        <Text style={t.titulo}>Consultar Patinha</Text>
        <Text style={t.subtitulo}>
          Digite o código gravado na tag para ver de quem é o animal e falar com o responsável.
        </Text>

        <View style={[t.card, { marginTop: 18 }]}>
          <Text style={t.rotulo}>Código da Patinha</Text>
          <TextInput
            style={t.campo}
            placeholder="Ex.: NIMA-2048"
            placeholderTextColor={BRAND.inkSoft}
            autoCapitalize="characters"
            autoCorrect={false}
            value={codigo}
            onChangeText={setCodigo}
            onSubmitEditing={() => consultar()}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={[t.botao, { marginTop: 14 }, (!codigo.trim() || consultando) && t.botaoDesabilitado]}
            activeOpacity={0.85}
            onPress={() => consultar()}
            disabled={!codigo.trim() || consultando}
          >
            {consultando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="search" size={19} color="#fff" />
                <Text style={t.botaoTexto}>Consultar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {erro ? (
          <View style={t.faixaErro}>
            <Ionicons name="alert-circle" size={20} color={BRAND.danger} />
            <Text style={t.faixaErroTexto}>{erro}</Text>
          </View>
        ) : null}

        {animal ? (
          <>
            <View style={t.faixaSucesso}>
              <Ionicons name="checkmark-circle" size={20} color={BRAND.success} />
              <Text style={t.faixaSucessoTexto}>
                Patinha encontrada. A leitura foi registrada para o responsável.
              </Text>
            </View>

            <View style={t.card}>
              <Text style={t.cardTitulo}>{animal.nome}</Text>
              <Text style={t.cardTexto}>
                {[animal.especie, animal.raca, animal.porte, animal.idade].filter(Boolean).join('  ·  ')}
              </Text>

              {animal.temperamento ? (
                <View style={t.cardLinha}>
                  <Ionicons name="happy-outline" size={17} color={BRAND.inkSoft} />
                  <Text style={t.cardLinhaTexto}>{animal.temperamento}</Text>
                </View>
              ) : null}

              {animal.status_posse === 'Desaparecido' ? (
                <View style={[t.badge, t.badgeVermelho, { marginTop: 12 }]}>
                  <Ionicons name="alert-circle" size={13} color={BRAND.danger} />
                  <Text style={[t.badgeTexto, t.badgeVermelhoTexto]}>Este animal está desaparecido</Text>
                </View>
              ) : null}
            </View>

            {contato ? (
              <View style={t.card}>
                <Text style={t.cardTitulo}>
                  {contato.tipo === 'tutor' ? 'Fale com o tutor' : 'Fale com a ONG responsável'}
                </Text>
                {contato.nome ? (
                  <View style={t.cardLinha}>
                    <Ionicons name="person-outline" size={17} color={BRAND.inkSoft} />
                    <Text style={t.cardLinhaTexto}>{contato.nome}</Text>
                  </View>
                ) : null}
                {contato.telefone ? (
                  <TouchableOpacity style={t.cardLinha} onPress={() => Linking.openURL(`tel:${contato.telefone}`)}>
                    <Ionicons name="call-outline" size={17} color={BRAND.blue} />
                    <Text style={[t.cardLinhaTexto, { color: BRAND.blue }]}>{contato.telefone}</Text>
                  </TouchableOpacity>
                ) : null}
                {contato.whatsapp ? (
                  <TouchableOpacity
                    style={[t.botaoSecundario, { marginTop: 14 }]}
                    activeOpacity={0.85}
                    onPress={() => abrirWhatsapp(contato.whatsapp)}
                  >
                    <Ionicons name="logo-whatsapp" size={19} color={BRAND.blue} />
                    <Text style={t.botaoSecundarioTexto}>Chamar no WhatsApp</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : (
              <View style={t.card}>
                <Text style={t.cardTexto}>
                  Nenhum contato cadastrado para este animal. Procure a ONG responsável.
                </Text>
              </View>
            )}
          </>
        ) : null}

        <View style={[t.card, { marginTop: 18, backgroundColor: '#EDF3FE', borderColor: '#D6E3FA' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="information-circle-outline" size={19} color={BRAND.blue} />
            <Text style={[t.cardTitulo, { fontSize: 15 }]}>Como funciona a Patinha</Text>
          </View>
          <Text style={t.cardTexto}>
            É uma tag NFC passiva: não tem bateria e não rastreia o animal. Ela guarda um código —
            quem encontra o pet consulta esse código e chega no responsável na hora.
          </Text>
        </View>

        <View style={{ height: 20, paddingHorizontal: PAD }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SmartTagScreen;
