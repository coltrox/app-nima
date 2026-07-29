import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import Campo from '../../components/Campo';
import favoritos from '../../../services/favoritos';
import { Carregando, Erro, Vazio, Aviso } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import animalService, { primeiraFoto } from '../../../services/animalService';

// Vitrine completa (RF06). Usa o feed recomendado quando o tutor já respondeu o
// questionário; senão cai para a lista geral e avisa por quê.

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  // O CHECK de animais.especie aceita só 'Cão'/'Gato' — o filtro compara com o
  // valor do banco, então a key precisa ser 'Cão' (era 'Cachorro' e não pegava).
  { key: 'Cão', label: 'Cachorros' },
  { key: 'Gato', label: 'Gatos' },
];

const MatchScreen = ({ navigation }) => {
  const [busca, setBusca] = useState('');
  const [especie, setEspecie] = useState('todos');

  // "Ver de longe": inclui pets de fora do raio de 50 km. O ref carrega o valor
  // atual para dentro do loader do useCarregar (que é fixado na criação).
  const [verDeLonge, setVerDeLonge] = useState(false);
  const verDeLongeRef = useRef(false);
  const { dados, carregando, erro, recarregar } = useCarregar(
    () => animalService.feed({ todos: verDeLongeRef.current }),
    { inicial: { lista: [], personalizado: false, aviso: null } }
  );
  const alternarLonge = () => {
    const novo = !verDeLonge;
    setVerDeLonge(novo);
    verDeLongeRef.current = novo;
    recarregar();
  };

  // Favoritos moram no aparelho (não há tabela no backend). Recarrega ao voltar
  // o foco porque o coração também pode ser alterado na ficha do pet.
  const [favIds, setFavIds] = useState([]);
  useFocusEffect(
    useCallback(() => {
      let vivo = true;
      favoritos.listar().then((ids) => { if (vivo) setFavIds(ids); });
      return () => { vivo = false; };
    }, [])
  );

  const alternarFavorito = async (id) => {
    await favoritos.alternar(id);
    setFavIds(await favoritos.listar());
  };

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

        <Campo
          icone="search"
          placeholder="Nome, raça, porte ou temperamento"
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
          returnKeyType="search"
          containerStyle={{ marginHorizontal: PAD, marginTop: 14 }}
        />

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

        {/* Ver de longe — só faz sentido no feed personalizado (com raio). */}
        {personalizado ? (
          <TouchableOpacity
            onPress={alternarLonge}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
              marginHorizontal: PAD, marginTop: 12, paddingVertical: 8, paddingHorizontal: 12,
              borderRadius: 12, borderWidth: 1.5,
              borderColor: verDeLonge ? BRAND.blue : BRAND.border,
              backgroundColor: verDeLonge ? '#EDF3FE' : BRAND.card,
            }}
          >
            <Ionicons
              name={verDeLonge ? 'earth' : 'location'}
              size={16}
              color={verDeLonge ? BRAND.blue : BRAND.inkSoft}
            />
            <Text style={{ fontSize: 13, fontFamily: 'Nunito_700Bold', color: verDeLonge ? BRAND.blue : BRAND.ink }}>
              {verDeLonge ? 'Mostrando pets de todas as regiões' : 'Ver pets de outras regiões'}
            </Text>
          </TouchableOpacity>
        ) : null}

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
                    {/* A % de match NÃO aparece na vitrine — o tutor a revela na
                        ficha do pet ("Ver match"). Aqui fica só a distância. */}

                    <TouchableOpacity
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 34, height: 34, borderRadius: 17,
                        backgroundColor: 'rgba(255,255,255,0.94)',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      onPress={() => alternarFavorito(a.id)}
                    >
                      <Ionicons
                        name={favIds.includes(String(a.id)) ? 'heart' : 'heart-outline'}
                        size={18}
                        color={favIds.includes(String(a.id)) ? BRAND.danger : BRAND.ink}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={t.petCorpo}>
                    <Text style={t.petNome} numberOfLines={1}>{a.nome}</Text>
                    <Text style={t.petMeta} numberOfLines={1}>
                      {[a.raca, a.idade].filter(Boolean).join(' · ')}
                    </Text>
                    <Text style={t.petMeta} numberOfLines={1}>
                      {[a.porte, a.especie].filter(Boolean).join(' · ')}
                    </Text>
                    {a.distancia_km != null && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 }}>
                        <Ionicons name="location-outline" size={12} color={BRAND.blue} />
                        <Text style={[t.petMeta, { color: BRAND.blue }]} numberOfLines={1}>
                          {a.distancia_km === 0 ? 'pertinho' : `${a.distancia_km} km`}
                        </Text>
                      </View>
                    )}
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
