import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/NavBar/navbar';
import { Carregando, Erro, Vazio } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import solicitacaoService, { STATUS_ROTULO } from '../../../services/solicitacaoService';
import { primeiraFoto } from '../../../services/animalService';

// Minhas solicitações de adoção (RF08) — GET /api/solicitacoes/minhas.
// Quem decide é a ONG; aqui o tutor só acompanha.

const ESTILO_STATUS = {
  pendente: [t.badgeAmbar, t.badgeAmbarTexto, 'time-outline'],
  aprovada: [t.badgeVerde, t.badgeVerdeTexto, 'checkmark-circle-outline'],
  recusada: [t.badgeVermelho, t.badgeVermelhoTexto, 'close-circle-outline'],
};

const formatarData = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('pt-BR');
};

const SolicitacoesScreen = ({ navigation }) => {
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => solicitacaoService.minhas(),
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
          <Text style={[t.cardTitulo, { fontSize: 16 }]}>Minhas adoções</Text>
        </View>

        <Text style={t.titulo}>Suas solicitações</Text>
        <Text style={t.subtitulo}>Acompanhe o que a ONG respondeu sobre cada pedido.</Text>

        {carregando && lista.length === 0 ? (
          <Carregando texto="Buscando suas solicitações…" />
        ) : erro && lista.length === 0 ? (
          <Erro mensagem={erro} onTentarDeNovo={recarregar} />
        ) : lista.length === 0 ? (
          <Vazio
            icone="clipboard-outline"
            titulo="Nenhuma solicitação ainda"
            texto="Quando você pedir para adotar um pet, o pedido aparece aqui com o status."
            acao="Ver pets disponíveis"
            onAcao={() => navigation.navigate('Match')}
          />
        ) : (
          lista.map((s) => {
            const [estilo, corTexto, icone] = ESTILO_STATUS[s.status] ?? ESTILO_STATUS.pendente;
            const foto = primeiraFoto(s.animal);
            return (
              <TouchableOpacity
                key={s.id}
                style={t.card}
                activeOpacity={0.88}
                onPress={() => s.animal?.id && navigation.navigate('PetDetails', { id: s.animal.id })}
              >
                <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                  {foto ? (
                    <Image source={{ uri: foto }} style={{ width: 64, height: 64, borderRadius: 14 }} />
                  ) : (
                    <View style={{ width: 64, height: 64, borderRadius: 14, backgroundColor: '#E7EEFB', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="paw" size={26} color={BRAND.blue} />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={t.cardTitulo}>{s.animal?.nome ?? 'Pet removido'}</Text>
                    <Text style={t.cardTexto}>
                      {[s.animal?.raca, s.animal?.porte].filter(Boolean).join('  ·  ')}
                    </Text>
                    <View style={[t.badge, estilo, { marginTop: 8 }]}>
                      <Ionicons name={icone} size={13} color={corTexto.color} />
                      <Text style={[t.badgeTexto, corTexto]}>
                        {STATUS_ROTULO[s.status] ?? s.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {s.mensagem ? (
                  <View style={t.cardLinha}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={BRAND.inkSoft} />
                    <Text style={[t.cardLinhaTexto, { fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft }]} numberOfLines={2}>
                      {s.mensagem}
                    </Text>
                  </View>
                ) : null}

                {formatarData(s.created_at) ? (
                  <Text style={[t.cardTexto, { marginTop: 8, fontSize: 12 }]}>
                    Enviada em {formatarData(s.created_at)}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="MyPet" />
    </SafeAreaView>
  );
};

export default SolicitacoesScreen;
