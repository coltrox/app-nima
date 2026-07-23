import React, { useState, forwardRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BRAND } from '../../../theme';

// Campo de texto único do app.
//
// Existia um input diferente em cada tela: uns com borda dentro de outra borda,
// uns com altura menor que o alvo mínimo de toque (por isso "nem dá para clicar"),
// e alguns com o ícone por cima da área de digitação, roubando o toque.
//
// Aqui a regra é uma só: a BORDA fica no wrapper, o TextInput por dentro não
// desenha nada e ocupa toda a área restante; os ícones ficam FORA do fluxo de
// digitação. Altura mínima 52 para o dedo pegar.
//
// Importadores: telas de Auth (Login, Register, ForgotPassword, VerifyCode,
// ResetPassword), Home (busca), Questionário, Meu Pet, PetDetails e Vagas.

const Campo = forwardRef(({
  rotulo,
  icone,
  erro,
  senha = false,
  multilinha = false,
  style,
  containerStyle,
  ...props
}, ref) => {
  const [focado, setFocado] = useState(false);
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={containerStyle}>
      {rotulo ? <Text style={s.rotulo}>{rotulo}</Text> : null}

      <View
        style={[
          s.wrapper,
          multilinha && s.wrapperMultilinha,
          focado && s.wrapperFocado,
          erro && s.wrapperErro,
        ]}
      >
        {icone ? (
          <Ionicons
            name={icone}
            size={20}
            color={focado ? BRAND.blue : BRAND.inkSoft}
            style={s.icone}
          />
        ) : null}

        <TextInput
          ref={ref}
          style={[s.input, multilinha && s.inputMultilinha, style]}
          placeholderTextColor="#9AA5B1"
          multiline={multilinha}
          secureTextEntry={senha && !visivel}
          onFocus={(e) => { setFocado(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocado(false); props.onBlur?.(e); }}
          // Sem isto o Android corta descendentes (g, p, ç) em campo de uma linha.
          textAlignVertical={multilinha ? 'top' : 'center'}
          underlineColorAndroid="transparent"
          {...props}
        />

        {senha ? (
          <TouchableOpacity
            onPress={() => setVisivel((v) => !v)}
            style={s.acao}
            // Área de toque maior que o ícone: 20px é pequeno demais pro dedo.
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={visivel ? 'eye-off-outline' : 'eye-outline'} size={20} color={BRAND.inkSoft} />
          </TouchableOpacity>
        ) : null}
      </View>

      {erro ? <Text style={s.erro}>{erro}</Text> : null}
    </View>
  );
});

Campo.displayName = 'Campo';

const s = StyleSheet.create({
  rotulo: {
    fontSize: 13.5,
    fontFamily: 'Nunito_700Bold',
    color: BRAND.ink,
    marginBottom: 7,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.card,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  wrapperMultilinha: { minHeight: 110, alignItems: 'flex-start', paddingVertical: 12 },
  wrapperFocado: { borderColor: BRAND.blue, backgroundColor: '#FBFCFF' },
  wrapperErro: { borderColor: BRAND.danger },

  icone: { marginRight: 10 },

  input: {
    flex: 1,
    fontSize: 15.5,
    fontFamily: 'Nunito_400Regular',
    color: BRAND.ink,
    // Zera o padding que o RN aplica por padrão no Android e desalinha o texto.
    paddingVertical: Platform.OS === 'android' ? 10 : 14,
    paddingHorizontal: 0,
    // O TextInput NÃO desenha borda: quem desenha é o wrapper. Era daqui que
    // vinha a "borda dentro da borda".
    borderWidth: 0,
    // Sem altura mínima o campo encolhe e o toque não pega no Android.
    minHeight: 44,
  },
  inputMultilinha: { minHeight: 86, paddingVertical: 0 },

  acao: { marginLeft: 10, padding: 2 },

  erro: {
    fontSize: 12.5,
    fontFamily: 'Nunito_600SemiBold',
    color: BRAND.danger,
    marginTop: 6,
  },
});

export default Campo;
