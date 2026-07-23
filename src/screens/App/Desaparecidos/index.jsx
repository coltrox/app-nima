import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/NavBar/navbar';
import { Carregando, Erro, Vazio } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import animalService, { primeiraFoto } from '../../../services/animalService';

// Mural colaborativo de desaparecidos (RF15) — GET /api/animais/desaparecidos.
// Só lista: quem marca um animal como "Desaparecido" é a ONG, pelo painel web.

const DesaparecidosScreen = ({ navigation }) => {
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => animalService.desaparecidos(),
    { inicial: [] }
  );

  const lista = dados || [];

  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={t.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={t.conteudo}>
        <View style={t.cabecalho}>
          <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
          </TouchableOpacity>
          <Text style={[t.cardTitulo, { fontSize: 16 }]}>Mural de desaparecidos</Text>
        </View>

        <Text style={t.titulo}>Viu algum deles?</Text>
        <Text style={t.subtitulo}>
          Se encontrar um animal com a Patinha, escaneie a tag: o contato do responsável aparece na hora.
        </Text>

        <TouchableOpacity
          style={[t.botaoSecundario, { marginHorizontal: PAD, marginTop: 16 }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SmartTag')}
        >
          <Ionicons name="scan-outline" size={19} color={BRAND.blue} />
          <Text style={t.botaoSecundarioTexto}>Consultar uma Patinha</Text>
        </TouchableOpacity>

        {carregando && lista.length === 0 ? (
          <Carregando texto="Carregando o mural…" />
        ) : erro && lista.length === 0 ? (
          <Erro mensagem={erro} onTentarDeNovo={recarregar} />
        ) : lista.length === 0 ? (
          <Vazio
            icone="happy-outline"
            titulo="Nenhum animal desaparecido"
            texto="Boa notícia: não há registros de desaparecimento no momento."
          />
        ) : (
          <View style={t.grade}>
            {lista.map((a) => {
              const foto = primeiraFoto(a);
              return (
                <TouchableOpacity
                  key={a.id}
                  style={t.petCard}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('PetDetails', { id: a.id })}
                >
                  <View>
                    {foto ? (
                      <Image source={{ uri: foto }} style={t.petFoto} />
                    ) : (
                      <View style={t.petFotoVazia}>
                        <Ionicons name="paw" size={30} color={BRAND.blue} />
                      </View>
                    )}
                    <View style={[t.badge, t.badgeFoto]}>
                      <Ionicons name="alert-circle" size={12} color={BRAND.danger} />
                      <Text style={[t.badgeTexto, t.badgeVermelhoTexto]}>Sumiu</Text>
                    </View>
                  </View>
                  <View style={t.petCorpo}>
                    <Text style={t.petNome} numberOfLines={1}>{a.nome}</Text>
                    <Text style={t.petMeta} numberOfLines={1}>
                      {[a.raca, a.porte].filter(Boolean).join(' · ')}
                    </Text>
                    {a.smart_tag_id ? (
                      <Text style={[t.petMeta, { color: BRAND.blue }]} numberOfLines={1}>
                        Patinha {a.smart_tag_id}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Home" />
    </SafeAreaView>
  );
};

export default DesaparecidosScreen;
