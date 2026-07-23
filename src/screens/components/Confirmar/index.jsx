// Caixa de confirmação (sim/não) que funciona no app E no navegador.
//
// POR QUE ESTE COMPONENTE EXISTE
// `Alert.alert` com vários botões é implementado no iOS/Android, mas no
// react-native-web ele é um stub que não faz nada. Como o app roda no browser
// durante o desenvolvimento, todo botão que dependia de Alert.alert para
// confirmar simplesmente não respondia ao toque — foi o caso do "Sair" do
// Perfil, que parecia quebrado.
//
// Importadores: Profile (sair da conta), MyPet (remover pet),
// Patinha (cancelar pedido).
import React from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BRAND } from '../../../theme';

/**
 * @param {boolean}  visivel
 * @param {string}   titulo
 * @param {string}   texto
 * @param {string}   confirmar   rótulo do botão de ação (padrão "Confirmar")
 * @param {string}   cancelar    rótulo do botão neutro (padrão "Cancelar")
 * @param {boolean}  perigo      pinta o botão de ação de vermelho
 * @param {string}   icone       Ionicon do círculo do topo
 * @param {boolean}  informativo só avisa: esconde o "Cancelar" e fechar = OK
 * @param {Function} onConfirmar
 * @param {Function} onCancelar  também dispara no toque fora e no botão voltar
 */
const Confirmar = ({
  visivel,
  titulo,
  texto,
  confirmar = 'Confirmar',
  cancelar = 'Cancelar',
  perigo = false,
  icone = 'help-circle-outline',
  informativo = false,
  onConfirmar,
  onCancelar,
}) => {
  const cor = perigo ? BRAND.danger : BRAND.blue;
  // Num diálogo informativo não existe "recusar": fechar por fora equivale a OK.
  const fechar = informativo ? onConfirmar : onCancelar;

  return (
    <Modal
      visible={!!visivel}
      transparent
      animationType="fade"
      // Android: botão físico de voltar fecha sem confirmar.
      onRequestClose={fechar}
    >
      {/* Toque fora = cancelar. */}
      <Pressable style={estilos.fundo} onPress={fechar}>
        {/* O Pressable de dentro não faz nada: só impede que o toque na caixa
            chegue ao fundo e feche o diálogo sem querer. */}
        <Pressable style={estilos.caixa} onPress={() => {}}>
          <View style={[estilos.iconeCirculo, { backgroundColor: cor + '18' }]}>
            <Ionicons name={icone} size={26} color={cor} />
          </View>

          <Text style={estilos.titulo}>{titulo}</Text>
          {texto ? <Text style={estilos.texto}>{texto}</Text> : null}

          <View style={estilos.linhaBotoes}>
            {informativo ? null : (
              <TouchableOpacity
                style={[estilos.botao, estilos.botaoNeutro]}
                onPress={onCancelar}
                activeOpacity={0.75}
              >
                <Text style={estilos.textoNeutro}>{cancelar}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[estilos.botao, { backgroundColor: cor }]}
              onPress={onConfirmar}
              activeOpacity={0.85}
            >
              <Text style={estilos.textoAcao}>{confirmar}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(12, 35, 64, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  caixa: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: BRAND.card,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  iconeCirculo: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  titulo: {
    fontSize: 18, fontFamily: 'Nunito_800ExtraBold',
    color: BRAND.ink, textAlign: 'center',
  },
  texto: {
    fontSize: 14, fontFamily: 'Nunito_400Regular',
    color: BRAND.inkSoft, textAlign: 'center', lineHeight: 20,
  },
  linhaBotoes: { flexDirection: 'row', gap: 10, marginTop: 16, alignSelf: 'stretch' },
  botao: {
    flex: 1, minHeight: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12,
  },
  botaoNeutro: { backgroundColor: '#EFF2F6', borderWidth: 1, borderColor: BRAND.border },
  textoNeutro: { fontSize: 14.5, fontFamily: 'Nunito_700Bold', color: BRAND.ink },
  textoAcao: { fontSize: 14.5, fontFamily: 'Nunito_700Bold', color: '#fff' },
});

export default Confirmar;
