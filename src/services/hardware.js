// Regras puras dos recursos de hardware do fluxo de avistamento.
//
// Ficam fora das telas para serem fáceis de explicar e testar: nenhuma função
// aqui toca em sensor ou permissão, só interpreta números.
//
// Importadores: hooks/useAcelerometro, components/PrecisaoGps, App/Avistamento.

// Acima disso o envio é bloqueado (movimento brusco ou queda do aparelho).
export const LIMITE_G = 2.0;

/**
 * Aceleração vetorial agregada: |a| = √(x² + y² + z²).
 * O expo-sensors já entrega cada eixo em g, então parado sobre a mesa o
 * resultado fica perto de 1g (só a gravidade).
 */
export const magnitudeG = ({ x = 0, y = 0, z = 0 } = {}) => Math.sqrt(x * x + y * y + z * z);

/**
 * Qualidade do sinal de GPS a partir do raio de incerteza (coords.accuracy, em metros).
 *   Verde    alta  : < 10 m
 *   Amarelo  média : 10 m a 30 m
 *   Vermelho baixa : > 30 m
 */
export function classificarPrecisao(metros) {
  if (!Number.isFinite(metros)) {
    return {
      nivel: 'desconhecida',
      rotulo: 'Precisão desconhecida',
      cor: '#8A8577',
      fundo: '#EFEBE2',
      texto: '#5A6B7E',
      dica: 'O aparelho não informou a margem de erro da localização.',
    };
  }
  if (metros < 10) {
    return {
      nivel: 'alta',
      rotulo: 'Alta precisão',
      cor: '#2E9E5B',
      fundo: '#E3F3E9',
      texto: '#2E7D4F',
      dica: 'Sinal ótimo: o ponto marcado é confiável.',
    };
  }
  if (metros <= 30) {
    return {
      nivel: 'media',
      rotulo: 'Média precisão',
      cor: '#E0A800',
      fundo: '#FFF3D6',
      texto: '#8A6100',
      dica: 'Sinal razoável. Se puder, vá para um lugar aberto e atualize.',
    };
  }
  return {
    nivel: 'baixa',
    rotulo: 'Baixa precisão',
    cor: '#C0392B',
    fundo: '#FBE9E7',
    texto: '#C0392B',
    dica: 'Sinal fraco (prédios, cobertura ou modo economia). Atualize a localização ao ar livre.',
  };
}
