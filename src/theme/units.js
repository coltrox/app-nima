// src/theme/units.js
const BASE_WIDTH = 375;   // largura de referência do layout
const BASE_HEIGHT = 812;

// Escala horizontal (larguras, paddings, botões)
export const hs = (size, width) => (width / BASE_WIDTH) * size;

// Escala vertical (alturas dependentes da tela)
export const vs = (size, height) => (height / BASE_HEIGHT) * size;

// Escala moderada: cresce metade da variação — evita exagero em tablets
export const ms = (size, width, factor = 0.5) =>
  size + (hs(size, width) - size) * factor;

// Fontes: cresce um pouco menos (fator 0.4)
export const fs = (size, width, factor = 0.4) =>
  Math.round(size + (hs(size, width) - size) * factor);

// Padding lateral com teto — tablets não ficam com margens gigantes
export const getPad = (width) => Math.min(width * 0.055, 32);