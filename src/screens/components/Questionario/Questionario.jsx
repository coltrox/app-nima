import React, { useState, useMemo } from 'react';
import {
  Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
  SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { BRAND } from '../../../theme';
import Logo from '../Logo';
import Anel from '../Anel';
import Campo from '../Campo';

// Questionário de afinidade — 20 perguntas, UMA POR TELA.
//
// Fluxo (decisão do usuário, 2026-07-23):
//   1. as 5 ESSENCIAIS primeiro, com os cards ilustrados e a trilha;
//   2. logo em seguida as 15 EXTRAS, num layout mais simples (Sim/Não,
//      seleção ou texto);
//   3. TODAS obrigatórias — o botão só habilita com a pergunta respondida;
//   4. o botão "Próxima pergunta" fica logo abaixo do card, ANTES do painel
//      "perfil ganhando forma", para a navegação fluir sem rolagem.
//
// Única exceção à obrigatoriedade: a pergunta 9 (faixa etária das crianças)
// só entra na sequência se a 8 for "Sim"; sem crianças ela é pulada e enviada
// como "Não se aplica".
//
// As chaves ('1'..'20') são o contrato com o backend: questionarioController
// lê `incomingAnswers['1']` … `['20']` e mapeia para as colunas NOT NULL de
// `questionarios`.

const ESSENCIAIS = [
  {
    id: 1,
    rotulo: 'Rotina',
    icone: 'clock-outline',
    pergunta: 'Quanto tempo o animal ficará sozinho por dia?',
    dica: 'Isso define o quanto o pet precisa lidar bem com a solidão.',
    opcoes: [
      { valor: 'Menos de 4 horas', arte: 'home-heart', ajuda: 'Quase sempre junto' },
      { valor: 'Entre 4 e 8 horas', arte: 'home-clock', ajuda: 'Meio período' },
      { valor: 'Mais de 8 horas', arte: 'briefcase-clock', ajuda: 'Fora o dia todo' },
    ],
  },
  {
    id: 2,
    rotulo: 'Energia',
    icone: 'lightning-bolt',
    pergunta: 'Qual é o seu nível de energia?',
    dica: 'Escolha a opção que mais combina com a sua rotina.',
    opcoes: [
      { valor: 'Baixo', arte: 'sleep', ajuda: 'Mais tranquilo' },
      { valor: 'Moderado', arte: 'dog-side', ajuda: 'Equilibrado' },
      { valor: 'Alto', arte: 'run-fast', ajuda: 'Sempre ativo' },
    ],
  },
  {
    id: 3,
    rotulo: 'Passeios',
    icone: 'walk',
    pergunta: 'Com que frequência pretende passear?',
    dica: 'Cães de porte maior costumam precisar de saídas diárias.',
    opcoes: [
      { valor: 'Nenhuma', arte: 'home-outline', ajuda: 'Só em casa' },
      { valor: 'Leve (1–2x/semana)', arte: 'walk', ajuda: 'De vez em quando' },
      { valor: 'Moderada (3–5x/semana)', arte: 'shoe-sneaker', ajuda: 'Quase todo dia' },
      { valor: 'Intensa (todos os dias)', arte: 'run', ajuda: 'Todo dia' },
    ],
  },
  {
    id: 5,
    rotulo: 'Lar',
    icone: 'home-variant',
    pergunta: 'Como é a sua residência?',
    dica: 'O espaço ajuda a definir o porte ideal do animal.',
    opcoes: [
      { valor: 'Casa com quintal grande', arte: 'home-group', ajuda: 'Bastante espaço' },
      { valor: 'Casa com quintal pequeno', arte: 'home', ajuda: 'Espaço médio' },
      { valor: 'Apartamento com tela', arte: 'office-building', ajuda: 'Protegido' },
      { valor: 'Apartamento sem tela', arte: 'office-building-outline', ajuda: 'Sem proteção' },
    ],
  },
  {
    id: 11,
    rotulo: 'Companhia',
    icone: 'paw',
    pergunta: 'Que tipo de companhia você procura?',
    dica: 'Você poderá ajustar esta resposta depois.',
    opcoes: [
      { valor: 'Cachorro', arte: 'dog', ajuda: 'Mais interativo' },
      { valor: 'Gato', arte: 'cat', ajuda: 'Mais independente' },
      { valor: 'Indiferente', arte: 'paw-outline', ajuda: 'Tanto faz' },
    ],
  },
];

// As 15 restantes, agora obrigatórias e uma por tela (layout simples).
const EXTRAS = [
  { id: 4, secao: 'Perfil', pergunta: 'Quem será o principal responsável?', tipo: 'texto' },
  { id: 6, secao: 'Ambiente', pergunta: 'O ambiente é seguro contra fugas?', opcoes: ['Sim', 'Não'] },
  { id: 7, secao: 'Ambiente', pergunta: 'O animal terá acesso ao interior da casa?', opcoes: ['Sim', 'Não'] },
  { id: 8, secao: 'Família', pergunta: 'Existem crianças na residência?', opcoes: ['Sim', 'Não'] },
  { id: 9, secao: 'Família', pergunta: 'Qual a faixa etária das crianças?', tipo: 'texto', dependeDe: { id: 8, valor: 'Sim' } },
  { id: 10, secao: 'Família', pergunta: 'Existem outros animais? Se sim, quais?', tipo: 'texto' },
  { id: 12, secao: 'Preferências', pergunta: 'Porte preferido:', opcoes: ['Pequeno', 'Médio', 'Grande', 'Indiferente'] },
  { id: 13, secao: 'Preferências', pergunta: 'Idade preferida:', opcoes: ['Filhote', 'Adulto', 'Idoso'] },
  { id: 14, secao: 'Saúde', pergunta: 'Alguém possui alergia a pelos?', opcoes: ['Sim', 'Não'] },
  { id: 15, secao: 'Finanças', pergunta: 'Possui reserva para custos veterinários?', opcoes: ['Sim', 'Não'] },
  { id: 16, secao: 'Planejamento', pergunta: 'Viaja com frequência? O que fará com o animal?', tipo: 'texto' },
  { id: 17, secao: 'Experiência', pergunta: 'Já teve animais antes?', opcoes: ['Sim', 'Não'] },
  { id: 18, secao: 'Experiência', pergunta: 'Como classifica sua experiência?', opcoes: ['Nenhuma', 'Básica', 'Experiente'] },
  { id: 19, secao: 'Intenção', pergunta: 'Qual o motivo para adoção?', tipo: 'texto' },
  { id: 20, secao: 'Compromisso', pergunta: 'Está ciente da responsabilidade (10–15 anos)?', opcoes: ['Sim', 'Não'] },
];

// Sequência completa: essenciais primeiro, extras depois. `tipo` distingue o
// layout (cartão ilustrado x linha simples x campo de texto).
const TODAS = [
  ...ESSENCIAIS.map((e) => ({ ...e, tipo: 'essencial' })),
  ...EXTRAS.map((o) => ({ ...o, tipo: o.tipo === 'texto' ? 'texto' : 'selecao' })),
];

const preenchida = (v) => v !== undefined && String(v).trim() !== '';

/**
 * @param {boolean}  visible
 * @param {Function} onClose     "Salvar e sair" / voltar sem enviar
 * @param {Function} onComplete  recebe { '1': …, '20': … } com as 20 chaves
 * @param {boolean}  enviando
 * @param {string}   erro
 */
const Questionario = ({ visible, onClose, onComplete, enviando = false, erro = null }) => {
  const [pos, setPos] = useState(0);
  const [respostas, setRespostas] = useState({});

  // A pergunta 9 só entra se houver crianças. `sequencia` é a lista realmente
  // percorrida — recalculada quando a resposta da 8 muda.
  const sequencia = useMemo(
    () => TODAS.filter((q) => !q.dependeDe || respostas[q.dependeDe.id] === q.dependeDe.valor),
    [respostas]
  );

  const total = sequencia.length; // 20, ou 19 quando não há crianças
  const posSegura = Math.min(pos, total - 1);
  const atual = sequencia[posSegura];
  const ehUltima = posSegura >= total - 1;
  const pct = Math.round(((posSegura + 1) / total) * 100);
  const faltam = total - posSegura - 1;

  // O anel é o progresso REAL do perfil: respondidas / total aplicável.
  const pctPerfil = useMemo(() => {
    const feitas = sequencia.filter((q) => preenchida(respostas[q.id])).length;
    return Math.round((feitas / total) * 100);
  }, [respostas, sequencia, total]);

  const responder = (id, valor) => setRespostas((r) => ({ ...r, [id]: valor }));

  const respondidaAtual = preenchida(respostas[atual.id]);
  const podeAvancar = respondidaAtual && !enviando;

  const finalizar = () => {
    // Todas as 20 chaves. Com o gate de obrigatoriedade, todas já vêm
    // preenchidas; a 9 vira "Não se aplica" quando não há crianças. O
    // fallback "Não informado" é só um cinto de segurança — não deve ocorrer.
    const payload = {};
    for (const q of TODAS) {
      if (q.id === 9 && respostas[8] !== 'Sim') { payload[9] = 'Não se aplica'; continue; }
      const v = respostas[q.id];
      payload[q.id] = preenchida(v) ? v : 'Não informado';
    }
    onComplete(payload);
  };

  const avancar = () => {
    if (enviando || !podeAvancar) return;
    if (!ehUltima) setPos(posSegura + 1);
    else finalizar();
  };

  const voltar = () => {
    if (enviando) return;
    if (posSegura > 0) setPos(posSegura - 1);
    else onClose();
  };

  // ---- Trilha das 5 essenciais (só aparece na fase essencial) ----
  const trilha = () => (
    <View style={styles.trilha}>
      {ESSENCIAIS.map((e, i) => {
        const atualEtapa = i === posSegura;
        const concluida = preenchida(respostas[e.id]) && i < posSegura;
        return (
          <View key={e.id} style={styles.trilhaItem}>
            {i < ESSENCIAIS.length - 1 ? (
              <View style={[styles.trilhaLigacao, { left: '60%', right: '-40%' }]} />
            ) : null}
            <TouchableOpacity
              activeOpacity={0.85}
              // Só volta para uma essencial já vista; pular à frente deixaria buracos.
              onPress={() => i <= posSegura && setPos(i)}
            >
              <View style={[styles.trilhaCirculo, atualEtapa && styles.trilhaCirculoAtual]}>
                <MaterialCommunityIcons name={e.icone} size={24} color={atualEtapa ? '#fff' : BRAND.ink} />
              </View>
              {concluida ? (
                <View style={styles.trilhaCheck}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              ) : null}
            </TouchableOpacity>
            <Text style={[styles.trilhaRotulo, atualEtapa && styles.trilhaRotuloAtual]} numberOfLines={1}>
              {e.rotulo}
            </Text>
          </View>
        );
      })}
    </View>
  );

  // ---- Pill da seção (fase das 15) ----
  const secaoTag = () => (
    <View style={styles.secaoTag}>
      <Ionicons name="pricetag-outline" size={15} color={BRAND.blue} />
      <Text style={styles.secaoTagTexto}>{atual.secao}</Text>
    </View>
  );

  // ---- Opções em cartão (as 5 essenciais) ----
  const cartoesEssencial = () => (
    <View style={styles.opcoesLinha}>
      {atual.opcoes.map((o) => {
        const ativa = respostas[atual.id] === o.valor;
        return (
          <TouchableOpacity
            key={o.valor}
            style={[styles.opcaoCard, ativa && styles.opcaoCardAtiva]}
            activeOpacity={0.85}
            onPress={() => responder(atual.id, o.valor)}
          >
            {ativa ? (
              <View style={styles.opcaoCheck}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </View>
            ) : null}
            <MaterialCommunityIcons name={o.arte} size={40} color={ativa ? '#fff' : BRAND.blue} />
            <Text style={[styles.opcaoRotulo, ativa && styles.opcaoRotuloAtivo]} numberOfLines={2}>
              {o.valor}
            </Text>
            <Text style={[styles.opcaoAjuda, ativa && styles.opcaoAjudaAtiva]} numberOfLines={1}>
              {o.ajuda}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ---- Linhas de seleção ou campo de texto (as 15) ----
  const controleExtra = () => {
    if (atual.tipo === 'texto') {
      return (
        <View style={{ marginTop: 14 }}>
          <Campo
            placeholder="Escreva aqui…"
            value={respostas[atual.id] || ''}
            onChangeText={(txt) => responder(atual.id, txt)}
            multilinha
          />
        </View>
      );
    }
    return (
      <View style={{ marginTop: 6 }}>
        {atual.opcoes.map((valor) => {
          const ativa = respostas[atual.id] === valor;
          return (
            <TouchableOpacity
              key={valor}
              style={[styles.opcaoLinha, ativa && styles.opcaoLinhaAtiva]}
              activeOpacity={0.85}
              onPress={() => responder(atual.id, valor)}
            >
              <Text style={[styles.opcaoLinhaTexto, ativa && styles.opcaoLinhaTextoAtivo]}>{valor}</Text>
              <View style={[styles.radio, ativa && styles.radioAtivo]}>
                {ativa ? <View style={styles.radioDentro} /> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // ---- Card da pergunta atual ----
  const cardPergunta = () => (
    <View style={styles.cardPergunta}>
      <Text style={styles.perguntaNumero}>PERGUNTA {String(posSegura + 1).padStart(2, '0')}</Text>
      <Text style={styles.perguntaTexto}>{atual.pergunta}</Text>
      {atual.dica ? <Text style={styles.perguntaDica}>{atual.dica}</Text> : null}

      {atual.tipo === 'essencial' ? cartoesEssencial() : controleExtra()}

      {atual.tipo === 'essencial' ? (
        <Text style={styles.rodapeCard}>Você poderá ajustar esta resposta depois.</Text>
      ) : null}
    </View>
  );

  // ---- Painel navy do progresso (agora ABAIXO do botão) ----
  const painel = () => (
    <View style={styles.painel}>
      <Text style={styles.painelTitulo}>Seu perfil está ganhando forma</Text>
      <View style={styles.painelCorpo}>
        <Anel pct={pctPerfil} size={112} espessura={11} cor="#3B82F6">
          <Text style={{ fontSize: 25, fontFamily: 'Nunito_800ExtraBold', color: '#fff' }}>{pctPerfil}%</Text>
          <Ionicons name="paw" size={15} color="rgba(255,255,255,0.7)" />
        </Anel>

        <View style={styles.painelChips}>
          {ESSENCIAIS.filter((e) => preenchida(respostas[e.id]))
            .slice(-3)
            .map((e) => (
              <View key={e.id} style={styles.chip}>
                <MaterialCommunityIcons name={e.icone} size={15} color="#8FB4F5" />
                <Text style={styles.chipTexto} numberOfLines={1}>{respostas[e.id]}</Text>
              </View>
            ))}
          {Object.keys(respostas).length === 0 ? (
            <Text style={styles.painelNota}>
              Responda a primeira pergunta para começar a montar seu perfil.
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.tela}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
            <View style={styles.topo}>
              <TouchableOpacity style={styles.voltarCirculo} onPress={onClose} disabled={enviando}>
                <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
              </TouchableOpacity>
              <Logo height={26} />
              <TouchableOpacity onPress={onClose} disabled={enviando}>
                <Text style={styles.salvarSair}>Salvar e sair</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroTitulo}>Descubra seu{'\n'}match ideal</Text>
                <Text style={styles.heroTexto}>Cada resposta aproxima você do pet certo.</Text>
              </View>
              <View style={styles.heroArte}>
                <MaterialCommunityIcons name="dog-side" size={52} color={BRAND.blue} />
              </View>
            </View>

            <View style={styles.etapaLinha}>
              <Text style={styles.etapaTexto}>Pergunta {posSegura + 1} de {total}</Text>
              <Text style={styles.etapaPct}>{pct}%</Text>
            </View>
            <View style={styles.barraBg}>
              <View style={[styles.barraFill, { width: `${pct}%` }]} />
            </View>

            {/* Trilha nas 5 essenciais; pill de seção nas 15 extras. */}
            {atual.tipo === 'essencial' ? trilha() : secaoTag()}

            {cardPergunta()}

            {erro ? (
              <View style={styles.erroBox}>
                <Ionicons name="alert-circle-outline" size={18} color={BRAND.danger} />
                <Text style={styles.erroTexto}>{erro}</Text>
              </View>
            ) : null}

            {/* Botão logo abaixo do card, ANTES do painel — navegação fluida. */}
            <View style={styles.acoes}>
              <TouchableOpacity
                style={[styles.botao, !podeAvancar && styles.botaoDesabilitado]}
                activeOpacity={0.9}
                onPress={avancar}
                disabled={!podeAvancar}
              >
                {enviando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={[styles.botaoTexto, !podeAvancar && styles.botaoTextoDesabilitado]}>
                      {ehUltima ? 'Concluir questionário' : 'Próxima pergunta'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={podeAvancar ? '#fff' : '#8A8577'} />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={voltar} disabled={enviando}>
                <Text style={styles.voltarTexto}>Voltar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.faltam}>
              <Ionicons name="paw" size={15} color={BRAND.inkSoft} />
              <Text style={styles.faltamTexto}>
                {faltam > 0
                  ? `Faltam ${faltam} ${faltam === 1 ? 'pergunta' : 'perguntas'}.`
                  : 'Última pergunta.'}
              </Text>
            </View>

            {painel()}

            <View style={styles.privacidade}>
              <Ionicons name="shield-checkmark-outline" size={18} color={BRAND.blue} />
              <Text style={styles.privacidadeTexto}>
                Suas respostas são privadas e usadas apenas para melhorar os seus matches.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default Questionario;
