import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import { Carregando, Erro, Vazio } from '../../components/Estado';
import { BRAND } from '../../../theme';
import useCarregar from '../../../hooks/useCarregar';
import vaquinhaService, { emReais, percentualDaMeta } from '../../../services/vaquinhaService';

// Vitrine Social ligada em GET /api/vaquinhas.
//
// O que o design pedia e o banco NÃO tem: foto da campanha, valor arrecadado,
// número de apoiadores, prazo e categoria. Em vez de inventar número em tela de
// doação, a campanha mostra só o que é verdade: ONG, título, descrição, meta e
// o PIX copia-e-cola que a própria ONG cadastrou.
// Ver docs/ALINHAMENTO-BACKEND.md.

const DonationsScreen = ({ navigation }) => {
  const [busca, setBusca] = useState('');
  const [pixAberto, setPixAberto] = useState(null);

  const { dados, carregando, erro, recarregar } = useCarregar(
    () => vaquinhaService.listar(),
    { inicial: [] }
  );

  const campanhas = dados || [];

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return campanhas;
    return campanhas.filter((c) =>
      `${c.titulo} ${c.descricao ?? ''} ${c.ong?.nome ?? ''}`.toLowerCase().includes(termo)
    );
  }, [campanhas, busca]);

  const destaque = filtradas[0] ?? null;
  const outras = filtradas.slice(1);
  const ongsDistintas = new Set(campanhas.map((c) => c.ong_id)).size;

  const Cabecalho = () => (
    <>
      <View style={styles.header}>
        <Logo height={26} />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.bellWrap}>
            <Ionicons name="notifications-outline" size={23} color={BRAND.ink} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Vitrine Social</Text>
      <Text style={styles.subtitle}>Apoie uma causa direto no PIX da ONG.</Text>
    </>
  );

  if (carregando && campanhas.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Cabecalho />
        <Carregando texto="Buscando campanhas…" />
        <Navbar navigation={navigation} currentRoute="Donation" />
      </SafeAreaView>
    );
  }

  if (erro && campanhas.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Cabecalho />
        <Erro mensagem={erro} onTentarDeNovo={recarregar} />
        <Navbar navigation={navigation} currentRoute="Donation" />
      </SafeAreaView>
    );
  }

  const CardPix = ({ campanha }) => {
    const aberto = pixAberto === campanha.id;
    return (
      <>
        <TouchableOpacity
          style={styles.pixBtn}
          activeOpacity={0.85}
          onPress={() => setPixAberto(aberto ? null : campanha.id)}
        >
          <Ionicons name={aberto ? 'chevron-up' : 'qr-code-outline'} size={20} color="#fff" />
          <Text style={styles.pixBtnText}>{aberto ? 'Esconder o PIX' : 'Doar via Pix'}</Text>
        </TouchableOpacity>

        {aberto ? (
          <View style={styles.pixBox}>
            <Text style={styles.pixLabel}>Pix copia e cola</Text>
            {/* selectable: dá para segurar e copiar sem depender de lib de clipboard */}
            <Text style={styles.pixCode} selectable>{campanha.pix_copia_cola}</Text>
            <Text style={styles.pixHint}>
              Segure o código para copiar e cole no app do seu banco.
              {campanha.pix_chave ? `  ·  Chave: ${campanha.pix_chave}` : ''}
            </Text>
          </View>
        ) : null}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Cabecalho />

        {/* Números reais: quantas campanhas estão abertas e de quantas ONGs */}
        <View style={styles.impactCard}>
          <View style={styles.impactIcon}>
            <Ionicons name="heart" size={26} color={BRAND.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.impactLabel}>Campanhas abertas agora</Text>
            <View style={styles.impactRow}>
              <View>
                <Text style={styles.impactValue}>{campanhas.length}</Text>
                <Text style={styles.impactCaption}>vaquinhas ativas</Text>
              </View>
              <View style={styles.impactDivider} />
              <View>
                <Text style={styles.impactValue}>{ongsDistintas}</Text>
                <Text style={styles.impactCaption}>{ongsDistintas === 1 ? 'ONG' : 'ONGs'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={19} color={BRAND.inkSoft} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar campanha ou ONG"
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

        {!destaque ? (
          <Vazio
            icone="heart-outline"
            titulo={busca ? 'Nenhuma campanha encontrada' : 'Nenhuma campanha aberta'}
            texto={
              busca
                ? 'Tente outro termo de busca.'
                : 'Assim que uma ONG publicar uma vaquinha, ela aparece aqui.'
            }
          />
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Campanha em destaque</Text>
            </View>

            <View style={styles.campaignCard}>
              <View style={styles.campaignCover}>
                <Ionicons name="heart" size={34} color={BRAND.blue} />
                <Text style={styles.campaignCoverText}>Vaquinha verificada</Text>
              </View>

              <View style={styles.campaignBody}>
                <View style={styles.ongRow}>
                  <Ionicons name="shield-checkmark" size={16} color={BRAND.blue} />
                  <Text style={styles.ongName}>{destaque.ong?.nome ?? 'ONG parceira'}</Text>
                </View>

                <Text style={styles.campaignTitle}>{destaque.titulo}</Text>
                {destaque.descricao ? (
                  <Text style={styles.campaignDesc}>{destaque.descricao}</Text>
                ) : null}

                {/* A barra só aparece se houver progresso real para mostrar. */}
                {percentualDaMeta(destaque) != null ? (
                  <View style={styles.barRow}>
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { width: `${percentualDaMeta(destaque)}%` }]} />
                    </View>
                    <Text style={styles.barPct}>{percentualDaMeta(destaque)}%</Text>
                  </View>
                ) : null}

                {emReais(destaque.meta) ? (
                  <View style={styles.metaRow}>
                    <Ionicons name="flag-outline" size={16} color={BRAND.inkSoft} />
                    <Text style={styles.metaTexto}>Meta: {emReais(destaque.meta)}</Text>
                  </View>
                ) : null}

                <CardPix campanha={destaque} />
              </View>
            </View>
          </>
        )}

        {outras.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Outras causas</Text>
            </View>

            {outras.map((c) => (
              <View key={c.id} style={[styles.otherCard, { marginBottom: 10 }]}>
                <View style={styles.otherThumb}>
                  <Ionicons name="paw" size={26} color={BRAND.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.otherOng}>
                    <Ionicons name="shield-checkmark" size={13} color={BRAND.blue} />
                    <Text style={styles.otherOngText}>{c.ong?.nome ?? 'ONG parceira'}</Text>
                  </View>
                  <Text style={styles.otherTitle}>{c.titulo}</Text>
                  {emReais(c.meta) ? (
                    <Text style={styles.otherRaised}>Meta {emReais(c.meta)}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.apoiarBtn}
                  activeOpacity={0.85}
                  onPress={() => setPixAberto(pixAberto === c.id ? null : c.id)}
                >
                  <Text style={styles.apoiarBtnText}>{pixAberto === c.id ? 'Fechar' : 'Apoiar'}</Text>
                </TouchableOpacity>
              </View>
            ))}

            {outras
              .filter((c) => pixAberto === c.id)
              .map((c) => (
                <View key={`pix-${c.id}`} style={[styles.pixBox, { marginHorizontal: 20, marginTop: 0 }]}>
                  <Text style={styles.pixLabel}>Pix de {c.ong?.nome ?? 'ONG parceira'}</Text>
                  <Text style={styles.pixCode} selectable>{c.pix_copia_cola}</Text>
                  <Text style={styles.pixHint}>Segure o código para copiar.</Text>
                </View>
              ))}
          </>
        )}

        <View style={styles.noteCard}>
          <Ionicons name="shield-checkmark" size={20} color={BRAND.blue} />
          <Text style={styles.noteText}>
            O PIX é da própria ONG, cadastrado por ela no painel. A Nima não intermedia o dinheiro.
          </Text>
        </View>
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Donation" />
    </SafeAreaView>
  );
};

export default DonationsScreen;
