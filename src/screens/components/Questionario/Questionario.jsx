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

// Questionário de afinidade.
//
// São 20 perguntas no backend, mas o fluxo é dividido: 5 ETAPAS ESSENCIAIS,
// uma por tela, e as outras 15 num bloco opcional que o tutor pode abrir ou
// deixar para depois.
//
// As chaves ('1'..'20') são o contrato com o backend: questionarioController
// lê `incomingAnswers['1']` … `['20']` e mapeia para as colunas de
// `questionarios`. Todas as colunas são NOT NULL, então o que não for
// respondido é enviado como "Não informado" — nunca vazio.

const ETAPAS = [
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

// As 15 restantes. Ficam num bloco recolhível, sem travar o envio.
const OPCIONAIS = [
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

const TOTAL_PERGUNTAS = ETAPAS.length + OPCIONAIS.length; // 20

/**
 * @param {boolean}  visible
 * @param {Function} onClose     "Salvar e sair" / voltar sem enviar
 * @param {Function} onComplete  recebe { '1': …, '20': … } com as 20 chaves
 * @param {boolean}  enviando
 * @param {string}   erro
 */
const Questionario = ({ visible, onClose, onComplete, enviando = false, erro = null }) => {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [abrirOpcionais, setAbrirOpcionais] = useState(false);

  const atual = ETAPAS[etapa];
  const ehUltima = etapa === ETAPAS.length - 1;
  const pctEtapas = Math.round(((etapa + 1) / ETAPAS.length) * 100);

  // O anel conta TODAS as 20 — é o progresso real do perfil, não o da etapa.
  const pctPerfil = useMemo(() => {
    const preenchidas = Object.values(respostas).filter((v) => v !== undefined && v !== '').length;
    return Math.round((preenchidas / TOTAL_PERGUNTAS) * 100);
  }, [respostas]);

  const responder = (id, valor) => setRespostas((r) => ({ ...r, [id]: valor }));

  const finalizar = () => {
    // Todas as 20 chaves, sempre. Coluna NOT NULL não aceita string vazia com
    // sentido de "pulou", então o não respondido vira "Não informado".
    const payload = {};
    for (const e of ETAPAS) payload[e.id] = respostas[e.id] ?? 'Não informado';
    for (const o of OPCIONAIS) {
      const bruto = respostas[o.id];
      const semCriancas = o.id === 9 && respostas[8] === 'Não';
      payload[o.id] = semCriancas ? 'Não se aplica' : (bruto && String(bruto).trim() ? bruto : 'Não informado');
    }
    onComplete(payload);
  };

  const avancar = () => {
    if (enviando) return;
    if (!ehUltima) setEtapa((e) => e + 1);
    else finalizar();
  };

  const respondida = respostas[atual.id] !== undefined && respostas[atual.id] !== '';
  const podeAvancar = respondida && !enviando;
  const faltam = ETAPAS.length - etapa - 1;

  // ---- Trilha de 5 etapas ----
  const Trilha = () => (
    <View style={styles.trilha}>
      {ETAPAS.map((e, i) => {
        const concluida = respostas[e.id] !== undefined && respostas[e.id] !== '' && i < etapa;
        const atualEtapa = i === etapa;
        return (
          <View key={e.id} style={styles.trilhaItem}>
            {/* Ligação pontilhada até o próximo círculo */}
            {i < ETAPAS.length - 1 ? (
              <View style={[styles.trilhaLigacao, { left: '60%', right: '-40%' }]} />
            ) : null}
            <TouchableOpacity
              activeOpacity={0.85}
              // Só deixa voltar para etapa já vista — pular para frente sem
              // responder deixaria buracos no meio do fluxo.
              onPress={() => i <= etapa && setEtapa(i)}
            >
              <View style={[styles.trilhaCirculo, atualEtapa && styles.trilhaCirculoAtual]}>
                <MaterialCommunityIcons
                  name={e.icone}
                  size={24}
                  color={atualEtapa ? '#fff' : BRAND.ink}
                />
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

  // ---- Opções em cartão (3 por linha) ----
  const Opcoes = () => (
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

  // ---- Resumo das etapas já respondidas ----
  const Resumos = () =>
    ETAPAS.slice(0, etapa)
      .filter((e) => respostas[e.id])
      .map((e) => (
        <View key={e.id} style={styles.resumo}>
          <View style={styles.resumoIcone}>
            <Ionicons name="checkmark" size={18} color={BRAND.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.resumoTitulo}>{e.rotulo} concluída</Text>
            <Text style={styles.resumoValor}>{respostas[e.id]}</Text>
          </View>
          <TouchableOpacity
            style={styles.resumoEditar}
            onPress={() => setEtapa(ETAPAS.findIndex((x) => x.id === e.id))}
          >
            <Ionicons name="create-outline" size={16} color={BRAND.blue} />
            <Text style={styles.resumoEditarTexto}>Editar</Text>
          </TouchableOpacity>
        </View>
      ));

  // ---- Bloco das outras 15 ----
  const Opcionais = () => (
    <View style={styles.opcionais}>
      <TouchableOpacity
        style={styles.opcionaisTopo}
        activeOpacity={0.85}
        onPress={() => setAbrirOpcionais((v) => !v)}
      >
        <View style={styles.opcionaisIcone}>
          <Ionicons name="list-outline" size={19} color={BRAND.blue} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.opcionaisTitulo}>Outras {OPCIONAIS.length} perguntas</Text>
          <Text style={styles.opcionaisTexto}>Preferências, experiência, família e responsabilidade</Text>
        </View>
        <View style={styles.selo}>
          <Text style={styles.seloTexto}>Opcional agora</Text>
        </View>
        <Ionicons name={abrirOpcionais ? 'chevron-up' : 'chevron-down'} size={20} color={BRAND.inkSoft} />
      </TouchableOpacity>

      {abrirOpcionais
        ? OPCIONAIS
            // A faixa etária das crianças só faz sentido se houver crianças.
            .filter((o) => !o.dependeDe || respostas[o.dependeDe.id] === o.dependeDe.valor)
            .map((o) => (
              <View key={o.id} style={styles.opcionalItem}>
                <Text style={styles.opcionalPergunta}>{o.pergunta}</Text>

                {o.tipo === 'texto' ? (
                  <Campo
                    placeholder="Escreva aqui…"
                    value={respostas[o.id] || ''}
                    onChangeText={(txt) => responder(o.id, txt)}
                    multilinha
                  />
                ) : (
                  o.opcoes.map((valor) => {
                    const ativa = respostas[o.id] === valor;
                    return (
                      <TouchableOpacity
                        key={valor}
                        style={[styles.opcaoLinha, ativa && styles.opcaoLinhaAtiva]}
                        activeOpacity={0.85}
                        onPress={() => responder(o.id, valor)}
                      >
                        <Text style={[styles.opcaoLinhaTexto, ativa && styles.opcaoLinhaTextoAtivo]}>
                          {valor}
                        </Text>
                        <View style={[styles.radio, ativa && styles.radioAtivo]}>
                          {ativa ? <View style={styles.radioDentro} /> : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            ))
        : null}
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
              <Text style={styles.etapaTexto}>Etapa {etapa + 1} de {ETAPAS.length}</Text>
              <Text style={styles.etapaPct}>{pctEtapas}%</Text>
            </View>
            <View style={styles.barraBg}>
              <View style={[styles.barraFill, { width: `${pctEtapas}%` }]} />
            </View>

            <Trilha />

            <View style={styles.cardPergunta}>
              <Text style={styles.perguntaNumero}>
                PERGUNTA {String(etapa + 1).padStart(2, '0')}
              </Text>
              <Text style={styles.perguntaTexto}>{atual.pergunta}</Text>
              <Text style={styles.perguntaDica}>{atual.dica}</Text>
              <Opcoes />
              <Text style={styles.rodapeCard}>Você poderá ajustar esta resposta depois.</Text>
            </View>

            <View style={styles.painel}>
              <Text style={styles.painelTitulo}>Seu perfil está ganhando forma</Text>
              <View style={styles.painelCorpo}>
                <Anel pct={pctPerfil} size={112} espessura={11} cor="#3B82F6">
                  <Text style={{ fontSize: 25, fontFamily: 'Nunito_800ExtraBold', color: '#fff' }}>
                    {pctPerfil}%
                  </Text>
                  <Ionicons name="paw" size={15} color="rgba(255,255,255,0.7)" />
                </Anel>

                <View style={styles.painelChips}>
                  {ETAPAS.filter((e) => respostas[e.id])
                    .slice(-3)
                    .map((e) => (
                      <View key={e.id} style={styles.chip}>
                        <MaterialCommunityIcons name={e.icone} size={15} color="#8FB4F5" />
                        <Text style={styles.chipTexto} numberOfLines={1}>{respostas[e.id]}</Text>
                      </View>
                    ))}
                  {Object.keys(respostas).length === 0 ? (
                    <Text style={styles.painelNota}>
                      Responda a primeira etapa para começar a montar seu perfil.
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>

            <Resumos />
            <Opcionais />

            <View style={styles.privacidade}>
              <Ionicons name="shield-checkmark-outline" size={18} color={BRAND.blue} />
              <Text style={styles.privacidadeTexto}>
                Suas respostas são privadas e usadas apenas para melhorar os seus matches.
              </Text>
            </View>

            {erro ? (
              <View style={styles.erroBox}>
                <Ionicons name="alert-circle-outline" size={18} color={BRAND.danger} />
                <Text style={styles.erroTexto}>{erro}</Text>
              </View>
            ) : null}

            <View style={styles.faltam}>
              <Ionicons name="paw" size={15} color={BRAND.inkSoft} />
              <Text style={styles.faltamTexto}>
                {faltam > 0
                  ? `Faltam apenas ${faltam} ${faltam === 1 ? 'etapa essencial' : 'etapas essenciais'}.`
                  : 'Última etapa essencial.'}
              </Text>
            </View>

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
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={podeAvancar ? '#fff' : '#8A8577'}
                    />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => (etapa > 0 ? setEtapa((e) => e - 1) : onClose())}
                disabled={enviando}
              >
                <Text style={styles.voltarTexto}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default Questionario;
