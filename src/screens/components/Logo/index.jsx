import React from 'react';
import { Image } from 'react-native';

// Logo oficial da marca — fonte única. Nenhuma tela deve dar require direto no PNG
// nem desenhar a marca com texto "Nima" + ícone de patinha.
//
// O arquivo tem bastante área transparente em volta do desenho; as constantes
// abaixo descrevem onde a marca realmente fica dentro do canvas, e as margens
// negativas recortam essa sobra para o componente ocupar só a altura pedida.
// Se a logo for reexportada com outro enquadramento, ajuste só estes três números.
const CANVAS_RATIO = 0.79;   // largura ÷ altura do PNG
const MARK_H_RATIO = 0.212;  // altura do desenho ÷ altura do PNG
const MARK_W_RATIO = 0.758;  // largura do desenho ÷ largura do PNG

export default function Logo({ height = 26, style }) {
  const boxH = height / MARK_H_RATIO;
  const boxW = boxH * CANVAS_RATIO;
  const cropV = (boxH - height) / 2;
  const cropH = (boxW - boxW * MARK_W_RATIO) / 2;

  return (
    <Image
      source={require('../../../../assets/logo.png')}
      style={[{ width: boxW, height: boxH, marginVertical: -cropV, marginHorizontal: -cropH }, style]}
      resizeMode="contain"
    />
  );
}
