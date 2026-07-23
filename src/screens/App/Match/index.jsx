import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import { Carregando, Erro, Vazio, Aviso } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import animalService, { primeiraFoto } from '../../../services/animalService';

// Vitrine completa (RF06). Usa o feed recomendado quando o tutor já respondeu o
// questionário; senão cai para a lista geral e avisa por quê.

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'Cachorro', label: 'Cachorros' },
  { key: 'Gato', label: 'Gatos' },
];

const MatchScreen = ({ navigation }) => {
  const [busca, setBusca] = useState('');
  const [especie, setEspecie] = useState('todos');

  const { dados, carregando, erro, recarregar } = useCarregar(() => animalService.feed(), {
    inicial: { lista: [], personalizado: false, aviso: null },
  });

  const { lista, personalizado, aviso } = dados || { lista: [], personalizado: false, aviso: null };

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return lista.filter((a) => {
      // "Adotado" some da vitrine: não dá para solicitar mesmo.
      if (a.status_posse === 'Adotado') return false;
      if (especie !== 'todos' && a.especie !== especie) return false;
      if (!termo) return true;
      return `${a.nome ?? ''} ${a.raca ?? ''} ${a.porte ?? ''} ${a.temperamento ?? ''}`
        .toLowerCase()
        .includes(termo);
    });
  }, [lista, busca, especie]);

  return (
    <SafeAreaView style={t.tela}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={t.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={t.conteudo}>
        <View style={t.cabecalho}>
          <TouchableOpacity style={t.voltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={BRAND.ink} />
          </TouchableOpacity>
          <Logo height={24} />
        </View>

        <Text style={t.titulo}>{personalizado ? 'Seus matches' : 'Para adoção'}</Text>
        <Text style={t.subtitulo}>
          {personalizado
            ? 'Ordenados pela compatibilidade com as suas respostas.'
            : 'Todos os animais cadastrados pelas ONGs parceiras.'}
        </Text>

        <View style={t.buscaRow}>
          <Ionicons name="search" size={19} color={BRAND.inkSoft} />
          <TextInput
            style={t.buscaInput}
            placeholder="Nome, raça, porte ou temperamento"
            placeholderTextColor={BRAND.inkSoft}
            value={busca}
            onChangeText={setBusca}
          />
          {busca ? (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={19} color={BRAND.inkSoft} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: PAD, marginTop: 12 }}>
          {FILTROS.map((f) => {
            const ativo = especie === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[t.badge, ativo ? { backgroundColor: BRAND.blue } : t.badgeAzul, { paddingVertical: 9, paddingHorizontal: 16 }]}
                onPress={() => setEspecie(f.key)}
                activeOpacity={0.85}
              >
                <Text style={[t.badgeTexto, ativo ? { color: '#fff' } : t.badgeAzulTexto, { fontSize: 13.5 }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {aviso ? <Aviso texto={aviso} /> : null}

        {carregando && lista.length === 0 ? (
          <Carregando texto="Carregando a vitrine…" />
        ) : erro && lista.length === 0 ? (
          <Erro mensagem={erro} onTentarDeNovo={recarregar} />
        ) : filtrados.length === 0 ? (
          <Vazio
            icone="paw-outline"
            titulo="Nenhum pet nesse filtro"
            texto="Tente outra espécie ou limpe a busca."
          />
        ) : (
          <View style={t.grade}>
            {filtrados.map((a) => {
              const foto = primeiraFoto(a);
              return (
                <TouchableOpacity
                  key={a.id}
                  style={t.petCard}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('PetDetails', { id: a.id })}
                >
                  <View>
                    {foto ? (
                      <Image source={{ uri: foto }} style={t.petFoto} />
                    ) : (
                      <View style={t.petFotoVazia}>
                        <Ionicons name="paw" size={30} color={BRAND.blue} />
                      </View>
                    )}
                    {a.compatibilidade != null && (
                      <View style={[t.badge, t.badgeFoto]}>
                        <Ionicons name="heart" size={12} color={BRAND.blue} />
                        <Text style={[t.badgeTexto, t.badgeAzulTexto]}>{Math.round(a.compatibilidade)}%</Text>
                      </View>
                    )}
                  </View>
                  <View style={t.petCorpo}>
                    <Text style={t.petNome} numberOfLines={1}>{a.nome}</Text>
                    <Text style={t.petMeta} numberOfLines={1}>
                      {[a.raca, a.idade].filter(Boolean).join(' · ')}
                    </Text>
                    <Text style={t.petMeta} numberOfLines={1}>
                      {[a.porte, a.especie].filter(Boolean).join(' · ')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Home" />
    </SafeAreaView>
  );
};

export default MatchScreen;
