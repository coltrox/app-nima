import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/Logo';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';

// Como conseguir uma Patinha.
//
// Um tutor nasce sem Patinha: a tag é um objeto físico, fabricado em lote pelo
// dev e entregue à ONG, que vincula ao pet. São três caminhos até ele:
//
//   1. COMPRAR        — pedido pelo site, chega em casa
//   2. DOAR           — apoiar uma vaquinha dá direito a uma
//   3. SER VOLUNTÁRIO — participar de uma vaga também dá
//
// ATENÇÃO — o que existe e o que não existe no backend hoje:
//   existe     → `tags` (estoque por ONG), vínculo tag→pet feito pela ONG,
//                vaquinhas e vagas de voluntariado
//   NÃO existe → pedido de compra, pagamento, endereço de entrega, e qualquer
//                registro de "fulano ganhou uma Patinha por ter doado"
//
// Por isso esta tela ORIENTA e encaminha, mas não promete confirmação
// automática: quem entrega a tag é a ONG, no combinado direto com o tutor.
// Ver docs/ALINHAMENTO-BACKEND.md, item "aquisição de Patinha".

const URL_LOJA = 'https://adotenima.com.br/patinha';

const CAMINHOS = [
  {
    icone: 'bag-handle-outline',
    titulo: 'Comprar e receber em casa',
    texto:
      'Você pede pelo site da Nima e a Patinha chega pelo correio, já gravada. '
      + 'É o caminho mais rápido se você não quer esperar.',
    acao: 'Ver no site',
    tipo: 'link',
  },
  {
    icone: 'heart-outline',
    titulo: 'Ganhar apoiando uma vaquinha',
    texto:
      'Doou para uma campanha de uma ONG parceira? Fale com ela pelo app: '
      + 'as ONGs reservam Patinhas do estoque delas para quem apoia.',
    acao: 'Ver campanhas abertas',
    tipo: 'rota',
    rota: 'Donation',
  },
  {
    icone: 'hand-right-outline',
    titulo: 'Ganhar sendo voluntário',
    texto:
      'Participou de uma vaga de voluntariado e foi aceito? A ONG pode entregar '
      + 'uma Patinha como reconhecimento — combine direto com ela.',
    acao: 'Ver vagas abertas',
    tipo: 'rota',
    rota: 'Donation',
  },
];

const PatinhaScreen = ({ navigation }) => (
  <SafeAreaView style={t.tela}>
    <StatusBar barStyle="dark-content" />
    <ScrollView style={t.scroll} contentContainerStyle={t.conteudoSemBarra} showsVerticalScrollIndicator={false}>
      <View style={t.cabecalho}>
        <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
        </TouchableOpacity>
        <Logo height={24} />
      </View>

      <View style={{ alignItems: 'center', marginTop: 22 }}>
        <View
          style={{
            width: 92, height: 92, borderRadius: 46, backgroundColor: '#E7EEFB',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Ionicons name="pricetag" size={42} color={BRAND.blue} />
        </View>
      </View>

      <Text style={[t.titulo, { textAlign: 'center' }]}>Como ter uma Patinha</Text>
      <Text style={[t.subtitulo, { textAlign: 'center' }]}>
        A tag que faz quem encontra seu pet chegar até você em segundos.
      </Text>

      {/* O que é, antes de como conseguir */}
      <View style={[t.card, { backgroundColor: BRAND.navy, borderColor: BRAND.navy, marginTop: 20 }]}>
        <Text style={[t.cardTitulo, { color: '#fff' }]}>O que ela faz</Text>
        <Text style={[t.cardTexto, { color: 'rgba(255,255,255,0.78)' }]}>
          É uma tag NFC presa à coleira. Quem acha o animal encosta o celular ou digita o
          código, e vê na hora a ficha do pet e o seu contato. Cada leitura fica registrada
          para você saber onde ele passou.
        </Text>
        <View style={[t.cardLinha, { marginTop: 14 }]}>
          <Ionicons name="battery-dead-outline" size={17} color="#8FB4F5" />
          <Text style={[t.cardLinhaTexto, { color: 'rgba(255,255,255,0.78)' }]}>
            Sem bateria e sem mensalidade — não é rastreador por GPS.
          </Text>
        </View>
      </View>

      <Text style={t.secao}>Três formas de conseguir</Text>

      {CAMINHOS.map((c, i) => (
        <View key={c.titulo} style={t.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 44, height: 44, borderRadius: 14, backgroundColor: '#E7EEFB',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name={c.icone} size={22} color={BRAND.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={[t.badge, t.badgeAzul, { marginBottom: 5 }]}>
                <Text style={[t.badgeTexto, t.badgeAzulTexto, { fontSize: 11 }]}>
                  OPÇÃO {i + 1}
                </Text>
              </View>
              <Text style={t.cardTitulo}>{c.titulo}</Text>
            </View>
          </View>

          <Text style={t.cardTexto}>{c.texto}</Text>

          <TouchableOpacity
            style={[t.botaoSecundario, { marginTop: 14 }]}
            activeOpacity={0.85}
            onPress={() =>
              c.tipo === 'link'
                ? Linking.openURL(URL_LOJA).catch(() => {})
                : navigation.navigate(c.rota)
            }
          >
            <Ionicons
              name={c.tipo === 'link' ? 'open-outline' : 'arrow-forward'}
              size={18}
              color={BRAND.blue}
            />
            <Text style={t.botaoSecundarioTexto}>{c.acao}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Sinceridade sobre o processo: quem entrega e vincula é a ONG */}
      <View style={[t.card, { backgroundColor: '#EDF3FE', borderColor: '#D6E3FA' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
          <Ionicons name="information-circle-outline" size={20} color={BRAND.blue} />
          <Text style={[t.cardTitulo, { fontSize: 15, flex: 1 }]}>Depois que você tiver a tag</Text>
        </View>
        <Text style={t.cardTexto}>
          Quem vincula a Patinha ao seu pet é a ONG, pelo painel dela — é isso que garante que
          um código não seja usado em dois animais. Leve o código ou o cartão até ela, e o
          vínculo aparece aqui no app na hora.
        </Text>
      </View>

      <View style={{ paddingHorizontal: PAD, marginTop: 4, marginBottom: 24, gap: 12 }}>
        <TouchableOpacity
          style={t.botao}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Ongs')}
        >
          <Ionicons name="business-outline" size={19} color="#fff" />
          <Text style={t.botaoTexto}>Falar com uma ONG</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={t.botaoSecundario}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SmartTag')}
        >
          <Ionicons name="search" size={18} color={BRAND.blue} />
          <Text style={t.botaoSecundarioTexto}>Já tenho uma — consultar código</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default PatinhaScreen;
