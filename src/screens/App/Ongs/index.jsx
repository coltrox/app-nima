import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/NavBar/navbar';
import { Carregando, Erro, Vazio } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import ongService from '../../../services/ongService';

// ONGs parceiras (RF20/RF23) — GET /api/ongs.
//
// O backend calcula `distancia_km` quando recebe ?lat= &lng=. O app não pede
// localização hoje (não há lib de geolocalização instalada), então a lista vem
// sem distância. Ver docs/ALINHAMENTO-BACKEND.md, item "distância das ONGs".
//
// Também não há mapa embutido: endereço e coordenadas abrem no app de mapas
// do aparelho.

const OngsScreen = ({ navigation }) => {
  const [busca, setBusca] = useState('');

  const { dados, carregando, erro, recarregar } = useCarregar(() => ongService.listar(), { inicial: [] });
  const ongs = dados || [];

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return ongs;
    return ongs.filter((o) => `${o.nome ?? ''} ${o.endereco ?? ''}`.toLowerCase().includes(termo));
  }, [ongs, busca]);

  const abrirMapa = (ong) => {
    const destino =
      ong.latitude != null && ong.longitude != null
        ? `${ong.latitude},${ong.longitude}`
        : ong.endereco;
    if (!destino) return;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destino)}`).catch(() => {});
  };

  const abrirWhatsapp = (numero) => {
    Linking.openURL(`https://wa.me/${String(numero).replace(/\D/g, '')}`).catch(() => {});
  };

  const abrirInstagram = (perfil) => {
    const usuario = String(perfil).replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '');
    Linking.openURL(`https://instagram.com/${usuario}`).catch(() => {});
  };

  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={t.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={t.conteudo}>
        <View style={t.cabecalho}>
          <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
          </TouchableOpacity>
          <Text style={[t.cardTitulo, { fontSize: 16 }]}>ONGs parceiras</Text>
        </View>

        <Text style={t.titulo}>Quem cuida por perto</Text>
        <Text style={t.subtitulo}>Fale direto com a organização, visite ou acompanhe o trabalho dela.</Text>

        <View style={t.buscaRow}>
          <Ionicons name="search" size={19} color={BRAND.inkSoft} />
          <TextInput
            style={t.buscaInput}
            placeholder="Buscar por nome ou endereço"
            placeholderTextColor={BRAND.inkSoft}
            value={busca}
            onChangeText={setBusca}
          />
          {busca ? (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={19} color={BRAND.inkSoft} />
            </TouchableOpacity>
          ) : null}
        </View>

        {carregando && ongs.length === 0 ? (
          <Carregando texto="Buscando ONGs…" />
        ) : erro && ongs.length === 0 ? (
          <Erro mensagem={erro} onTentarDeNovo={recarregar} />
        ) : filtradas.length === 0 ? (
          <Vazio
            icone="business-outline"
            titulo={busca ? 'Nenhuma ONG encontrada' : 'Nenhuma ONG cadastrada'}
            texto={busca ? 'Tente outro termo.' : 'As ONGs aparecem aqui depois de homologadas.'}
          />
        ) : (
          filtradas.map((o) => (
            <View key={o.id} style={t.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="shield-checkmark" size={17} color={BRAND.blue} />
                <Text style={[t.cardTitulo, { flex: 1 }]}>{o.nome}</Text>
                {o.distancia_km != null ? (
                  <View style={[t.badge, t.badgeAzul]}>
                    <Text style={[t.badgeTexto, t.badgeAzulTexto]}>{o.distancia_km} km</Text>
                  </View>
                ) : null}
              </View>

              {o.endereco ? (
                <TouchableOpacity style={t.cardLinha} onPress={() => abrirMapa(o)}>
                  <Ionicons name="location-outline" size={17} color={BRAND.blue} />
                  <Text style={[t.cardLinhaTexto, { color: BRAND.blue }]}>{o.endereco}</Text>
                </TouchableOpacity>
              ) : null}

              {o.telefone ? (
                <TouchableOpacity style={t.cardLinha} onPress={() => Linking.openURL(`tel:${o.telefone}`)}>
                  <Ionicons name="call-outline" size={17} color={BRAND.inkSoft} />
                  <Text style={t.cardLinhaTexto}>{o.telefone}</Text>
                </TouchableOpacity>
              ) : null}

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                {o.whatsapp ? (
                  <TouchableOpacity
                    style={[t.botaoSecundario, { flex: 1 }]}
                    activeOpacity={0.85}
                    onPress={() => abrirWhatsapp(o.whatsapp)}
                  >
                    <Ionicons name="logo-whatsapp" size={18} color={BRAND.blue} />
                    <Text style={t.botaoSecundarioTexto}>WhatsApp</Text>
                  </TouchableOpacity>
                ) : null}
                {o.instagram ? (
                  <TouchableOpacity
                    style={[t.botaoSecundario, { flex: 1 }]}
                    activeOpacity={0.85}
                    onPress={() => abrirInstagram(o.instagram)}
                  >
                    <Ionicons name="logo-instagram" size={18} color={BRAND.blue} />
                    <Text style={t.botaoSecundarioTexto}>Instagram</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Home" />
    </SafeAreaView>
  );
};

export default OngsScreen;
