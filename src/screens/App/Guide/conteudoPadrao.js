// Conteúdo de partida da tela Guia.
//
// Só aparece enquanto o dev não cadastrar guias em /dev/guias — assim a tela
// nunca fica vazia numa demonstração. Assim que a API devolver qualquer guia,
// isto é ignorado por completo (nada de misturar as duas fontes, senão fica
// impossível saber o que é conteúdo real).
//
// Mesmo formato da tabela `guias`, para a tela não precisar saber a origem.
// Importador: src/screens/App/Guide/index.jsx.

const guia = (id, categoria, tipo, icone, titulo, resumo, conteudo, ordem) => ({
  id, categoria, tipo, icone, titulo, resumo, conteudo, ordem, ativo: true, local: true,
});

const CONTEUDO_PADRAO = [
  // ---- Guias rápidos (faixa do topo) ----
  guia('l1', 'Saúde', 'rapido', 'medkit-outline',
    'Sinais de alerta',
    'Quando levar ao veterinário sem esperar.',
    'Procure um veterinário no mesmo dia se notar: recusa de água por mais de 12 horas, vômito repetido, dificuldade para respirar, barriga inchada e dura, convulsão, sangramento que não para, ou apatia súbita em um animal que costuma ser ativo.\n\nEmergência absoluta: suspeita de envenenamento, atropelamento, torção gástrica (barriga estufada + tentativa de vomitar sem sair nada) e golpe de calor. Nesses casos o tempo é o que decide.',
    1),
  guia('l2', 'Bem-estar', 'rapido', 'walk-outline',
    'Primeira semana em casa',
    'Como receber o pet sem sobrecarregar.',
    'Os primeiros dias são de adaptação, não de festa. Reserve um canto tranquilo com cama, água e um brinquedo, e deixe o animal explorar no ritmo dele.\n\nEvite visitas, banho e passeios longos na primeira semana. Mantenha a mesma ração que ele já comia e troque aos poucos, misturando um pouco da nova por vez ao longo de sete dias — mudança brusca causa diarreia.\n\nÉ normal o animal se esconder, comer pouco ou dormir muito no começo.',
    2),
  guia('l3', 'Segurança', 'rapido', 'shield-checkmark-outline',
    'Casa à prova de fuga',
    'O que revisar antes de o pet chegar.',
    'Confira frestas embaixo de portões, telas de janela e sacada, altura do muro e se há móvel encostado que sirva de escada.\n\nGuarde produtos de limpeza, remédios e plantas tóxicas (comigo-ninguém-pode, lírio, espada-de-são-jorge) fora de alcance. Fios soltos e sacolas plásticas também entram na lista.\n\nColeira com identificação desde o primeiro dia — inclusive dentro de casa.',
    3),

  // ---- Guias completos por categoria ----
  guia('l4', 'Saúde', 'completo', 'shield-checkmark-outline',
    'Calendário de vacinas',
    'O que cada dose previne e quando aplicar.',
    'Filhotes começam entre 6 e 8 semanas, com reforços a cada 21 a 30 dias até completar o protocolo. Adultos sem histórico recomeçam do zero.\n\nCÃES — a múltipla (V8 ou V10) cobre cinomose, parvovirose, hepatite, adenovirose e leptospirose. A antirrábica entra a partir dos 4 meses. Gripe canina e giárdia são opcionais, conforme a rotina do animal.\n\nGATOS — a múltipla (V3, V4 ou V5) cobre panleucopenia, rinotraqueíte e calicivirose; a V4 e a V5 acrescentam clamidiose e leucemia felina. A antirrábica segue o mesmo calendário.\n\nTodas precisam de reforço anual. Guarde a carteirinha: ela é exigida em hotel, creche e viagem.',
    1),
  guia('l5', 'Saúde', 'completo', 'bug-outline',
    'Vermífugo e antipulgas',
    'A parte que mais se esquece.',
    'Vermifugação: filhotes a cada 15 dias até os 3 meses, depois a cada 3 ou 4 meses. Adultos, de 3 a 4 vezes por ano. Vermes intestinais são comuns mesmo em animais que não saem de casa.\n\nAntipulgas e carrapatos: siga a validade do produto (a maioria dura de 1 a 3 meses). Carrapato transmite doenças graves, e pulga é a principal causa de dermatite alérgica.\n\nNunca use produto de cão em gato: permetrina, comum em antipulgas caninos, é tóxica para felinos.',
    2),
  guia('l6', 'Bem-estar', 'completo', 'happy-outline',
    'Ansiedade de separação',
    'Por que destrói tudo quando você sai.',
    'Latido constante, destruição perto da porta, xixi fora do lugar e salivação excessiva na sua ausência não são birra — são sinal de estresse.\n\nO que ajuda: sair e voltar sem despedida dramática; deixar brinquedo recheado que dê trabalho; fazer um passeio antes de sair; e treinar ausências curtas, aumentando o tempo aos poucos.\n\nO que piora: brigar quando você chega. O animal não associa a bronca ao que fez horas antes — só aprende que sua chegada é ruim.\n\nCasos intensos pedem acompanhamento de um veterinário comportamental.',
    1),
  guia('l7', 'Bem-estar', 'completo', 'tennisball-outline',
    'Enriquecimento ambiental',
    'Gasto de energia que não é passeio.',
    'Boa parte dos problemas de comportamento vem de tédio. Um animal cansado mentalmente é mais calmo que um só cansado fisicamente.\n\nPara cães: comedouro lento, brinquedo recheado com ração, esconder petiscos pela casa, sessões curtas de treino (5 minutos valem mais que 30) e variar o trajeto do passeio para ele farejar coisas novas.\n\nPara gatos: prateleiras e arranhadores em altura, caixas de papelão, varinha com penas em sessões curtas, e comedouro dividido em pontos diferentes da casa para simular a caça.',
    2),
  guia('l8', 'Alimentação', 'completo', 'nutrition-outline',
    'Quanto e o que dar',
    'Porção, frequência e o que nunca oferecer.',
    'A quantidade vem na embalagem da ração e depende do peso e da idade — meça, não estime pelo olho. Filhotes comem de 3 a 4 vezes ao dia; adultos, 2 vezes.\n\nÁgua fresca sempre disponível, trocada todo dia. Gatos bebem pouco: espalhe potes e considere uma fonte.\n\nNUNCA dar: chocolate, uva e uva-passa, cebola e alho, xilitol (adoçante), álcool, macadâmia, osso cozido (lasca e perfura) e massa de pão crua. Leite causa diarreia na maioria dos adultos.\n\nMudança de ração é sempre gradual, ao longo de 7 dias.',
    1),
  guia('l9', 'Adestramento', 'completo', 'megaphone-outline',
    'Comandos que importam',
    'Comece por estes três.',
    'SENTA — segure um petisco perto do focinho e leve para trás, por cima da cabeça. O bumbum desce sozinho. Marque com "isso!" e entregue.\n\nVEM — sempre associado a coisa boa. Nunca chame o animal para dar bronca, cortar unha ou dar banho, senão ele aprende a não vir.\n\nFICA — comece com 2 segundos e volte até ele para recompensar. Aumente o tempo antes de aumentar a distância.\n\nRegras gerais: sessões de 5 minutos, uma palavra por comando, e sempre terminar com um acerto. Punição física não ensina o que fazer — só ensina a ter medo de você.',
    1),
  guia('l10', 'Segurança', 'completo', 'pricetag-outline',
    'Se o pet sumir',
    'As primeiras horas são as que contam.',
    'Comece pela vizinhança imediata: animais assustados se escondem perto de casa, embaixo de carros e em terrenos. Chame com voz calma — grito afasta.\n\nLeve algo com o cheiro dele e a embalagem de petisco. Volte no mesmo lugar ao amanhecer e ao anoitecer, quando há menos movimento.\n\nAvise: grupos de bairro, clínicas veterinárias, pet shops e o canil municipal. Poste foto nítida, cor, porte e onde sumiu.\n\nSe o pet usa Patinha, quem encontrar escaneia a tag e chega no seu contato na hora — vale conferir se o número cadastrado está atualizado.',
    1),
];

export default CONTEUDO_PADRAO;
