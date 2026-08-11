import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView,
  Modal, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Campo from '../../components/Campo';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import perfilService from '../../../services/perfilService';
import { mensagemDoErro } from '../../../services/http';

// Coleta o "dossiê do adotante" antes da candidatura: contato (telefone =
// WhatsApp), endereço, documento (RG/CNH) e comprovante de endereço. Os arquivos
// vão para o bucket privado; a ONG vê por signed URL. O backend também barra a
// candidatura sem esses dados (code 'dossie-incompleto') — aqui evitamos o erro.

const TIPOS_DOC = ['RG', 'CNH'];

const DossieModal = ({ visivel, onFechar, onCompleto, nomePet }) => {
  const [carregando, setCarregando] = useState(true);
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [docTipo, setDocTipo] = useState('RG');
  const [docAsset, setDocAsset] = useState(null);      // foto recém-escolhida (documento)
  const [compAsset, setCompAsset] = useState(null);    // foto recém-escolhida (comprovante)
  const [docEnviado, setDocEnviado] = useState(false); // já existe no servidor
  const [compEnviado, setCompEnviado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!visivel) return;
    let vivo = true;
    setCarregando(true);
    setErro(null);
    setDocAsset(null);
    setCompAsset(null);
    perfilService.obter()
      .then((p) => {
        if (!vivo) return;
        setTelefone(p?.telefone || p?.whatsapp || '');
        setEndereco(p?.endereco || '');
        setDocTipo(p?.documento_tipo || 'RG');
        setDocEnviado(!!p?.documento_enviado);
        setCompEnviado(!!p?.comprovante_enviado);
      })
      .catch(() => {})
      .finally(() => { if (vivo) setCarregando(false); });
    return () => { vivo = false; };
  }, [visivel]);

  const escolherFoto = async (setter) => {
    setErro(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setErro('Precisamos de acesso às suas fotos para anexar o documento.');
      return;
    }
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!r.canceled && r.assets?.[0]) setter(r.assets[0]);
  };

  const confirmar = async () => {
    if (!telefone.trim()) return setErro('Informe seu telefone (WhatsApp).');
    if (!endereco.trim()) return setErro('Informe seu endereço.');
    if (!docTipo) return setErro('Escolha o tipo de documento (RG ou CNH).');
    if (!docAsset && !docEnviado) return setErro('Anexe uma foto do seu documento.');
    if (!compAsset && !compEnviado) return setErro('Anexe o comprovante de endereço.');

    setSalvando(true);
    setErro(null);
    try {
      await perfilService.atualizar({
        telefone: telefone.trim(),
        whatsapp: telefone.trim(), // um campo só preenche os dois
        endereco: endereco.trim(),
        documento_tipo: docTipo,
      });
      if (docAsset) await perfilService.enviarDocumento('documento', docAsset);
      if (compAsset) await perfilService.enviarDocumento('comprovante', compAsset);
      onCompleto();
    } catch (e) {
      setErro(mensagemDoErro(e, 'Não foi possível salvar seus dados. Tente de novo.'));
    } finally {
      setSalvando(false);
    }
  };

  const anexo = (rotulo, icone, asset, enviado, onEscolher) => (
    <View style={[t.card, { marginTop: 0, gap: 10 }]}>
      <Text style={t.rotulo}>{rotulo}</Text>
      {asset ? (
        <Image source={{ uri: asset.uri }} style={{ width: '100%', height: 150, borderRadius: 12 }} resizeMode="cover" />
      ) : enviado ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="checkmark-circle" size={20} color={BRAND.success} />
          <Text style={[t.cardTexto, { marginTop: 0 }]}>Já enviado. Toque abaixo para trocar.</Text>
        </View>
      ) : (
        <Text style={[t.cardTexto, { marginTop: 0 }]}>Nenhum arquivo anexado ainda.</Text>
      )}
      <TouchableOpacity style={t.botaoSecundario} activeOpacity={0.85} onPress={onEscolher}>
        <Ionicons name={icone} size={18} color={BRAND.blue} />
        <Text style={t.botaoSecundarioTexto}>{asset || enviado ? 'Trocar imagem' : 'Anexar imagem'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visivel} animationType="slide" onRequestClose={onFechar}>
      <SafeAreaView style={t.tela}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={t.cabecalho}>
            <TouchableOpacity style={t.voltar} onPress={onFechar} disabled={salvando}>
              <Ionicons name="close" size={20} color={BRAND.ink} />
            </TouchableOpacity>
            <Text style={[t.cardTitulo, { fontSize: 16 }]}>Cadastro de adotante</Text>
          </View>

          {carregando ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={BRAND.blue} />
            </View>
          ) : (
            <ScrollView style={t.scroll} contentContainerStyle={t.conteudoSemBarra} showsVerticalScrollIndicator={false}>
              <Text style={t.titulo}>Quase lá!</Text>
              <Text style={t.subtitulo}>
                Para adotar {nomePet ? `o ${nomePet}` : 'um pet'}, a ONG precisa conhecer você. Esses dados
                ficam protegidos e só a ONG responsável vê.
              </Text>

              <View style={{ paddingHorizontal: PAD, marginTop: 18, gap: 16 }}>
                <Campo
                  rotulo="Telefone (WhatsApp)"
                  icone="logo-whatsapp"
                  placeholder="(11) 99999-9999"
                  keyboardType="phone-pad"
                  value={telefone}
                  onChangeText={setTelefone}
                />
                <Campo
                  rotulo="Endereço"
                  icone="location-outline"
                  placeholder="Rua, número, bairro, cidade"
                  value={endereco}
                  onChangeText={setEndereco}
                  multilinha
                />

                <View>
                  <Text style={t.rotulo}>Tipo de documento</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {TIPOS_DOC.map((d) => {
                      const ativo = docTipo === d;
                      return (
                        <TouchableOpacity
                          key={d}
                          style={[t.botaoSecundario, { flex: 1 }, ativo && { backgroundColor: BRAND.blue, borderColor: BRAND.blue }]}
                          activeOpacity={0.85}
                          onPress={() => setDocTipo(d)}
                        >
                          <Ionicons name="card-outline" size={17} color={ativo ? '#fff' : BRAND.blue} />
                          <Text style={[t.botaoSecundarioTexto, ativo && { color: '#fff' }]}>{d}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {anexo(`Foto do ${docTipo}`, 'card-outline', docAsset, docEnviado, () => escolherFoto(setDocAsset))}
                {anexo('Comprovante de endereço', 'home-outline', compAsset, compEnviado, () => escolherFoto(setCompAsset))}

                {erro ? (
                  <View style={[t.faixaErro, { marginHorizontal: 0 }]}>
                    <Ionicons name="alert-circle" size={19} color={BRAND.danger} />
                    <Text style={t.faixaErroTexto}>{erro}</Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>
          )}

          {!carregando ? (
            <View style={t.rodape}>
              <TouchableOpacity
                style={[t.botao, salvando && t.botaoDesabilitado]}
                activeOpacity={0.85}
                onPress={confirmar}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="heart" size={19} color="#fff" />
                    <Text style={t.botaoTexto}>Confirmar e enviar candidatura</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default DossieModal;
