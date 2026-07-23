import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/Logo';
import Campo from '../../components/Campo';
import { Carregando, Erro } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import patinhaService, { STATUS, estaAberto } from '../../../services/patinhaService';
import ongService from '../../../services/ongService';
import animalService from '../../../services/animalService';
import { mensagemDoErro } from '../../../services/http';

// Como conseguir uma Patinha — agora com pedido de verdade (migração 017).
//
// Três origens, e elas NÃO se verificam do mesmo jeito:
//   voluntariado → o backend confere se há inscrição 'aceito' numa vaga da ONG
//                  e recusa na hora se não houver;
//   doacao       → ninguém consegue verificar: o PIX é da própria ONG e
//                  acontece fora do app. Quem confirma é a ONG, no extrato;
//   compra       → não passa por ONG, é venda da Nima, e exige endereço.
//
// TODAS as funções que montam formulário aqui RETORNAM JSX e são chamadas
// como `formCompra()`. Se fossem componentes declarados neste corpo, cada
// tecla recriaria a função, o React remontaria a árvore e o campo perderia o
// foco — o mesmo defeito que quebrava o cadastro de pet.

const TOM_BADGE = {
  azul: [t.badgeAzul, t.badgeAzulTexto],
  verde: [t.badgeVerde, t.badgeVerdeTexto],
  ambar: [t.badgeAmbar, t.badgeAmbarTexto],
  vermelho: [t.badgeVermelho, t.badgeVermelhoTexto],
};

const CAMINHOS = [
  {
    origem: 'compra',
    icone: 'bag-handle-outline',
    titulo: 'Comprar e receber em casa',
    texto: 'A Patinha chega pelo correio, já gravada. É o caminho mais rápido.',
  },
  {
    origem: 'doacao',
    icone: 'heart-outline',
    titulo: 'Ganhar apoiando uma vaquinha',
    texto: 'Doou para uma campanha? A ONG reserva uma Patinha do estoque dela para você.',
  },
  {
    origem: 'voluntariado',
    icone: 'hand-right-outline',
    titulo: 'Ganhar sendo voluntário',
    texto: 'Foi aceito numa vaga de voluntariado? A ONG pode entregar uma como reconhecimento.',
  },
];

const entregaVazia = {
  entrega_nome: '', entrega_cep: '', entrega_linha1: '',
  entrega_linha2: '', entrega_cidade: '', entrega_uf: '',
};

const PatinhaScreen = ({ navigation }) => {
  const [aberto, setAberto] = useState(null);       // origem em edição
  const [ongSel, setOngSel] = useState(null);
  const [petSel, setPetSel] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [entrega, setEntrega] = useState(entregaVazia);
  const [enviando, setEnviando] = useState(false);
  const [erroForm, setErroForm] = useState(null);

  const dados = useCarregar(
    async () => {
      const [pedidos, ongs, pets] = await Promise.all([
        patinhaService.meus().catch(() => []),
        ongService.listar().catch(() => []),
        animalService.meus().catch(() => []),
      ]);
      return { pedidos, ongs, pets };
    },
    { inicial: { pedidos: [], ongs: [], pets: [] } }
  );

  const { pedidos = [], ongs = [], pets = [] } = dados.dados || {};
  const emAndamento = useMemo(() => pedidos.filter(estaAberto), [pedidos]);
  const encerrados = useMemo(() => pedidos.filter((p) => !estaAberto(p)), [pedidos]);

  const limpar = () => {
    setAberto(null);
    setOngSel(null);
    setPetSel(null);
    setObservacao('');
    setEntrega(entregaVazia);
    setErroForm(null);
  };

  const abrirForm = (origem) => {
    limpar();
    setAberto(origem);
  };

  const enviar = async () => {
    setErroForm(null);

    if (aberto !== 'compra' && !ongSel) {
      setErroForm('Escolha a ONG que vai atender o pedido.');
      return;
    }
    if (aberto === 'compra') {
      const faltando = ['entrega_nome', 'entrega_cep', 'entrega_linha1', 'entrega_cidade', 'entrega_uf']
        .filter((c) => !entrega[c].trim());
      if (faltando.length) {
        setErroForm('Preencha nome, CEP, endereço, cidade e UF.');
        return;
      }
    }

    setEnviando(true);
    try {
      const corpo = { origem: aberto, observacao: observacao.trim() || null };
      if (aberto === 'compra') Object.assign(corpo, entrega);
      else corpo.ong_id = ongSel;
      if (petSel) corpo.animal_id = petSel;

      await patinhaService.criar(corpo);
      limpar();
      dados.recarregar();
    } catch (e) {
      setErroForm(mensagemDoErro(e, 'Não foi possível enviar o pedido.'));
    } finally {
      setEnviando(false);
    }
  };

  const cancelar = (pedido) => {
    Alert.alert('Cancelar pedido', 'Tem certeza? Você pode pedir de novo depois.', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar pedido',
        style: 'destructive',
        onPress: async () => {
          try {
            await patinhaService.cancelar(pedido.id);
            dados.recarregar();
          } catch (e) {
            Alert.alert('Não deu certo', mensagemDoErro(e));
          }
        },
      },
    ]);
  };

  // ---- Cartão de um pedido ----
  const cardPedido = (p) => {
    const info = STATUS[p.status] ?? STATUS.pendente;
    const [estilo, corTexto] = TOM_BADGE[info.tom] ?? TOM_BADGE.azul;
    const destino = p.ong?.nome ?? 'Nima (compra)';

    return (
      <View key={p.id} style={t.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={[t.badge, estilo]}>
            <Ionicons name={info.icone} size={13} color={corTexto.color} />
            <Text style={[t.badgeTexto, corTexto]}>{info.rotulo}</Text>
          </View>
        </View>

        <Text style={[t.cardTitulo, { marginTop: 10 }]}>{destino}</Text>
        <Text style={t.cardTexto}>
          Pedido por {p.origem === 'compra' ? 'compra' : p.origem === 'doacao' ? 'doação' : 'voluntariado'}
          {p.animal?.nome ? ` · para ${p.animal.nome}` : ''}
        </Text>

        {p.tag?.codigo ? (
          <View style={t.cardLinha}>
            <Ionicons name="pricetag" size={16} color={BRAND.success} />
            <Text style={t.cardLinhaTexto}>Patinha {p.tag.codigo}</Text>
          </View>
        ) : null}

        {p.resposta ? (
          <View style={[t.cardLinha, { alignItems: 'flex-start' }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={BRAND.inkSoft} />
            <Text style={[t.cardLinhaTexto, { fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft }]}>
              {p.resposta}
            </Text>
          </View>
        ) : null}

        {p.status === 'pendente' ? (
          <TouchableOpacity style={[t.botaoSecundario, { marginTop: 14 }]} onPress={() => cancelar(p)}>
            <Ionicons name="close" size={17} color={BRAND.blue} />
            <Text style={t.botaoSecundarioTexto}>Cancelar pedido</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  // ---- Escolha de ONG (doação / voluntariado) ----
  const escolherOng = () => (
    <View style={{ marginTop: 14 }}>
      <Text style={t.rotulo}>Qual ONG?</Text>
      {ongs.length === 0 ? (
        <Text style={t.cardTexto}>Nenhuma ONG cadastrada ainda.</Text>
      ) : (
        ongs.map((o) => {
          const ativo = ongSel === o.id;
          return (
            <TouchableOpacity
              key={o.id}
              style={[
                {
                  flexDirection: 'row', alignItems: 'center', gap: 10,
                  borderWidth: 1.5, borderRadius: 14, padding: 14, marginTop: 8,
                  borderColor: ativo ? BRAND.blue : BRAND.border,
                  backgroundColor: ativo ? '#EDF3FE' : BRAND.card,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => setOngSel(o.id)}
            >
              <Ionicons
                name={ativo ? 'radio-button-on' : 'radio-button-off'}
                size={19}
                color={ativo ? BRAND.blue : '#C7CFD9'}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 14.5,
                  fontFamily: ativo ? 'Nunito_800ExtraBold' : 'Nunito_600SemiBold',
                  color: ativo ? BRAND.blue : BRAND.ink,
                }}
              >
                {o.nome}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );

  // ---- Escolha do pet (opcional) ----
  const escolherPet = () => {
    if (pets.length === 0) return null;
    return (
      <View style={{ marginTop: 16 }}>
        <Text style={t.rotulo}>Para qual pet? (opcional)</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {pets.map((p) => {
            const ativo = petSel === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  t.badge,
                  ativo ? { backgroundColor: BRAND.blue } : t.badgeAzul,
                  { paddingVertical: 10, paddingHorizontal: 16 },
                ]}
                activeOpacity={0.85}
                onPress={() => setPetSel(ativo ? null : p.id)}
              >
                <Text style={[t.badgeTexto, ativo ? { color: '#fff' } : t.badgeAzulTexto, { fontSize: 13.5 }]}>
                  {p.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={[t.cardTexto, { fontSize: 12 }]}>
          Escolhendo um pet, a Patinha já sai vinculada a ele.
        </Text>
      </View>
    );
  };

  // ---- Formulário de entrega (compra) ----
  const formEntrega = () => (
    <View style={{ marginTop: 14, gap: 14 }}>
      <Campo
        rotulo="Nome de quem recebe"
        icone="person-outline"
        placeholder="Nome completo"
        value={entrega.entrega_nome}
        onChangeText={(v) => setEntrega((e) => ({ ...e, entrega_nome: v }))}
        autoCapitalize="words"
      />
      <Campo
        rotulo="CEP"
        icone="location-outline"
        placeholder="00000-000"
        keyboardType="numeric"
        maxLength={9}
        value={entrega.entrega_cep}
        onChangeText={(v) => setEntrega((e) => ({ ...e, entrega_cep: v }))}
      />
      <Campo
        rotulo="Endereço"
        placeholder="Rua, número"
        value={entrega.entrega_linha1}
        onChangeText={(v) => setEntrega((e) => ({ ...e, entrega_linha1: v }))}
      />
      <Campo
        rotulo="Complemento (opcional)"
        placeholder="Apto, bloco, referência"
        value={entrega.entrega_linha2}
        onChangeText={(v) => setEntrega((e) => ({ ...e, entrega_linha2: v }))}
      />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Campo
          rotulo="Cidade"
          placeholder="Campinas"
          value={entrega.entrega_cidade}
          onChangeText={(v) => setEntrega((e) => ({ ...e, entrega_cidade: v }))}
          containerStyle={{ flex: 1 }}
        />
        <Campo
          rotulo="UF"
          placeholder="SP"
          autoCapitalize="characters"
          maxLength={2}
          value={entrega.entrega_uf}
          onChangeText={(v) => setEntrega((e) => ({ ...e, entrega_uf: v }))}
          containerStyle={{ width: 92 }}
        />
      </View>
    </View>
  );

  // ---- Formulário completo de um caminho ----
  const formulario = (c) => (
    <View style={{ marginTop: 16 }}>
      {c.origem === 'compra' ? formEntrega() : escolherOng()}
      {escolherPet()}

      <View style={{ marginTop: 16 }}>
        <Campo
          rotulo={c.origem === 'doacao' ? 'Conte sobre a sua doação' : 'Alguma observação? (opcional)'}
          placeholder={
            c.origem === 'doacao'
              ? 'Ex.: doei R$ 50 na campanha da ração no dia 12.'
              : 'Escreva aqui…'
          }
          value={observacao}
          onChangeText={setObservacao}
          multilinha
        />
      </View>

      {/* Honestidade sobre o que o sistema consegue conferir */}
      {c.origem === 'doacao' ? (
        <View style={[t.card, { marginHorizontal: 0, backgroundColor: '#FFF3D6', borderColor: '#F0DFB0' }]}>
          <Text style={[t.cardTexto, { marginTop: 0, color: '#8A6100' }]}>
            A doação acontece no PIX da própria ONG, fora do app — então não temos como
            confirmar sozinhos. Diga o valor e a data para ela achar no extrato.
          </Text>
        </View>
      ) : c.origem === 'voluntariado' ? (
        <View style={[t.card, { marginHorizontal: 0, backgroundColor: '#EDF3FE', borderColor: '#D6E3FA' }]}>
          <Text style={[t.cardTexto, { marginTop: 0 }]}>
            Conferimos automaticamente se você foi aceito numa vaga desta ONG.
          </Text>
        </View>
      ) : null}

      {erroForm ? (
        <View style={[t.faixaErro, { marginHorizontal: 0 }]}>
          <Ionicons name="alert-circle" size={19} color={BRAND.danger} />
          <Text style={t.faixaErroTexto}>{erroForm}</Text>
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <TouchableOpacity style={[t.botaoSecundario, { flex: 1 }]} onPress={limpar} disabled={enviando}>
          <Text style={t.botaoSecundarioTexto}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[t.botao, { flex: 1.4 }, enviando && t.botaoDesabilitado]}
          onPress={enviar}
          disabled={enviando}
          activeOpacity={0.85}
        >
          {enviando ? <ActivityIndicator color="#fff" /> : <Text style={t.botaoTexto}>Enviar pedido</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={t.scroll} contentContainerStyle={t.conteudoSemBarra} showsVerticalScrollIndicator={false}>
          <View style={t.cabecalho}>
            <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
            </TouchableOpacity>
            <Logo height={24} />
          </View>

          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <View
              style={{
                width: 88, height: 88, borderRadius: 44, backgroundColor: '#E7EEFB',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="pricetag" size={40} color={BRAND.blue} />
            </View>
          </View>

          <Text style={[t.titulo, { textAlign: 'center' }]}>Como ter uma Patinha</Text>
          <Text style={[t.subtitulo, { textAlign: 'center' }]}>
            A tag que faz quem encontra seu pet chegar até você em segundos.
          </Text>

          {dados.carregando && pedidos.length === 0 ? (
            <Carregando texto="Carregando…" />
          ) : dados.erro && !dados.dados ? (
            <Erro mensagem={dados.erro} onTentarDeNovo={dados.recarregar} />
          ) : (
            <>
              {emAndamento.length > 0 && (
                <>
                  <Text style={t.secao}>Seu pedido</Text>
                  {emAndamento.map(cardPedido)}
                </>
              )}

              <Text style={t.secao}>
                {emAndamento.length > 0 ? 'Outras formas de conseguir' : 'Três formas de conseguir'}
              </Text>

              {CAMINHOS.map((c) => {
                const jaPediu = emAndamento.some(
                  (p) => (c.origem === 'compra' ? !p.ong_id : p.ong_id) && p.origem === c.origem
                );
                const editando = aberto === c.origem;

                return (
                  <View key={c.origem} style={t.card}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View
                        style={{
                          width: 44, height: 44, borderRadius: 14, backgroundColor: '#E7EEFB',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Ionicons name={c.icone} size={22} color={BRAND.blue} />
                      </View>
                      <Text style={[t.cardTitulo, { flex: 1 }]}>{c.titulo}</Text>
                    </View>

                    <Text style={t.cardTexto}>{c.texto}</Text>

                    {editando ? (
                      formulario(c)
                    ) : jaPediu ? (
                      <View style={[t.badge, t.badgeAzul, { marginTop: 14 }]}>
                        <Ionicons name="time-outline" size={13} color={BRAND.blue} />
                        <Text style={[t.badgeTexto, t.badgeAzulTexto]}>Pedido em andamento</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[t.botaoSecundario, { marginTop: 14 }]}
                        activeOpacity={0.85}
                        onPress={() => abrirForm(c.origem)}
                      >
                        <Ionicons name="arrow-forward" size={18} color={BRAND.blue} />
                        <Text style={t.botaoSecundarioTexto}>
                          {c.origem === 'compra' ? 'Pedir e informar entrega' : 'Pedir a uma ONG'}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Atalhos para onde o mérito é conquistado */}
                    {!editando && c.origem !== 'compra' ? (
                      <TouchableOpacity
                        style={{ alignSelf: 'center', paddingVertical: 10 }}
                        onPress={() => navigation.navigate('Donation')}
                      >
                        <Text style={{ fontSize: 13.5, fontFamily: 'Nunito_700Bold', color: BRAND.blue }}>
                          {c.origem === 'doacao' ? 'Ver campanhas abertas' : 'Ver vagas abertas'}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              })}

              {encerrados.length > 0 && (
                <>
                  <Text style={t.secao}>Histórico</Text>
                  {encerrados.map(cardPedido)}
                </>
              )}
            </>
          )}

          <View style={[t.card, { backgroundColor: '#EDF3FE', borderColor: '#D6E3FA' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <Ionicons name="information-circle-outline" size={20} color={BRAND.blue} />
              <Text style={[t.cardTitulo, { fontSize: 15, flex: 1 }]}>Como ela funciona</Text>
            </View>
            <Text style={t.cardTexto}>
              É uma tag NFC presa à coleira, sem bateria e sem mensalidade — não é rastreador
              por GPS. Quem acha o animal consulta o código e vê na hora a sua ficha de contato.
            </Text>
            <TouchableOpacity
              style={[t.botaoSecundario, { marginTop: 14 }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('SmartTag')}
            >
              <Ionicons name="search" size={18} color={BRAND.blue} />
              <Text style={t.botaoSecundarioTexto}>Já tenho uma — consultar código</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 20, paddingHorizontal: PAD }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PatinhaScreen;
