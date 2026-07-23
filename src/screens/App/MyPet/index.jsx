import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import { Carregando, Erro, Vazio } from '../../components/Estado';
import { BRAND } from '../../../theme';
import useCarregar from '../../../hooks/useCarregar';
import solicitacaoService from '../../../services/solicitacaoService';
import animalService, { primeiraFoto } from '../../../services/animalService';
import { statusDoErro } from '../../../services/http';

// Meu Pet ligado no backend.
//
// Duas ressalvas honestas, ambas em docs/ALINHAMENTO-BACKEND.md:
//  1. Não existe vínculo tutor→animal no banco. `animais.dono_*` é texto livre
//     que a ONG digita. Então "meus pets" = adoções APROVADAS do tutor.
//  2. GET /animais/:id/leituras hoje exige cargo ong/desenvolvedor. Um tutor
//     leva 403 — a tela mostra o aviso em vez de fingir que não pediu.
//
// A Patinha é tag NFC passiva: sem bateria e sem GPS contínuo. O card mostra a
// ÚLTIMA LEITURA registrada, não rastreamento ao vivo.

const formatarData = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const localDaLeitura = (leitura) =>
  leitura.latitude != null && leitura.longitude != null
    ? `${Number(leitura.latitude).toFixed(4)}, ${Number(leitura.longitude).toFixed(4)}`
    : 'Local não informado';

const MyPetScreen = ({ navigation }) => {
  const [indice, setIndice] = useState(0);

  const pets = useCarregar(() => solicitacaoService.meusPets(), { inicial: [] });
  const lista = pets.dados || [];
  const pet = lista[indice] ?? null;

  // Se a lista encolher entre focos, não deixa o índice apontar para o vazio.
  useEffect(() => {
    if (indice > 0 && indice >= lista.length) setIndice(0);
  }, [lista.length, indice]);

  const [leituras, setLeituras] = useState([]);
  const [leiturasBloqueadas, setLeiturasBloqueadas] = useState(false);

  useEffect(() => {
    let ativo = true;
    setLeituras([]);
    setLeiturasBloqueadas(false);
    if (!pet?.id) return undefined;

    animalService
      .leituras(pet.id)
      .then((dados) => { if (ativo) setLeituras(dados || []); })
      .catch((e) => { if (ativo && statusDoErro(e) === 403) setLeiturasBloqueadas(true); });

    return () => { ativo = false; };
  }, [pet?.id]);

  const vacinas = useMemo(() => {
    const bruto = pet?.prontuario_vacinas;
    return Array.isArray(bruto) ? bruto : [];
  }, [pet]);

  const ultimaLeitura = leituras[0] ?? null;

  const Cabecalho = () => (
    <View style={styles.header}>
      <Logo height={26} />
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.bellWrap}>
          <Ionicons name="notifications-outline" size={23} color={BRAND.ink} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatarSmall} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (pets.carregando && lista.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Cabecalho />
        <Carregando texto="Buscando seus pets…" />
        <Navbar navigation={navigation} currentRoute="MyPet" />
      </SafeAreaView>
    );
  }

  if (pets.erro && lista.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Cabecalho />
        <Erro mensagem={pets.erro} onTentarDeNovo={pets.recarregar} />
        <Navbar navigation={navigation} currentRoute="MyPet" />
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Cabecalho />
        <Text style={styles.title}>Meu pet</Text>
        <Vazio
          icone="paw-outline"
          titulo="Você ainda não tem um pet por aqui"
          texto="Seu pet aparece aqui quando uma ONG aprovar a sua solicitação de adoção."
          acao="Ver pets disponíveis"
          onAcao={() => navigation.navigate('Match')}
        />
        <Navbar navigation={navigation} currentRoute="MyPet" />
      </SafeAreaView>
    );
  }

  const foto = primeiraFoto(pet);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Cabecalho />

        <Text style={styles.title}>Meu pet</Text>
        <Text style={styles.subtitle}>Tudo sobre o {pet.nome} em um só lugar.</Text>

        {lista.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcherRow}>
            {lista.map((p, i) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.switchChip, i === indice && styles.switchChipAtivo]}
                onPress={() => setIndice(i)}
                activeOpacity={0.85}
              >
                <Text style={[styles.switchChipText, i === indice && styles.switchChipTextAtivo]}>{p.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Card do pet */}
        <View style={styles.petCard}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.petPhoto} />
          ) : (
            <View style={styles.petPhotoVazia}>
              <Ionicons name="paw" size={34} color={BRAND.blue} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.petNameRow}>
              <Text style={styles.petName}>{pet.nome}</Text>
            </View>
            <Text style={styles.petBreed}>
              {[pet.raca, pet.idade].filter(Boolean).join('  ·  ')}
            </Text>

            {pet.smart_tag_id ? (
              <View style={styles.tagBadge}>
                <Ionicons name="radio-outline" size={14} color="#fff" />
                <Text style={styles.tagBadgeText}>Patinha ativa</Text>
              </View>
            ) : (
              <View style={[styles.tagBadge, { backgroundColor: BRAND.inkSoft }]}>
                <Ionicons name="alert-circle-outline" size={14} color="#fff" />
                <Text style={styles.tagBadgeText}>Sem Patinha</Text>
              </View>
            )}

            {pet.smart_tag_id ? (
              <View style={styles.petMetaRow}>
                <Ionicons name="pricetag-outline" size={15} color={BRAND.inkSoft} />
                <View>
                  <Text style={styles.petMetaLabel}>Código</Text>
                  <Text style={styles.petMetaValue}>{pet.smart_tag_id}</Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>

        {/* Acessos rápidos — só o que tem tela de verdade */}
        <Text style={styles.sectionTitle}>Acessos rápidos</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PetDetails', { id: pet.id })}
          >
            <Ionicons name="document-text-outline" size={24} color={BRAND.blue} />
            <Text style={styles.quickLabel}>Ficha completa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SmartTag', { codigo: pet.smart_tag_id ?? '' })}
          >
            <Ionicons name="pricetag-outline" size={24} color={BRAND.blue} />
            <Text style={styles.quickLabel}>Patinha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Solicitacoes')}
          >
            <Ionicons name="clipboard-outline" size={24} color={BRAND.blue} />
            <Text style={styles.quickLabel}>Minhas adoções</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Guide')}
          >
            <Ionicons name="book-outline" size={24} color={BRAND.blue} />
            <Text style={styles.quickLabel}>Guia de cuidados</Text>
          </TouchableOpacity>
        </View>

        {/* Monitoramento da Patinha — última leitura NFC */}
        <View style={styles.tagCard}>
          <Text style={styles.tagCardTitle}>Monitoramento da Patinha</Text>
          <View style={styles.tagOnlineRow}>
            <View style={[styles.tagOnlineDot, { backgroundColor: pet.smart_tag_id ? '#4ADE80' : '#94A3B8' }]} />
            <Text style={styles.tagOnlineText}>
              {pet.smart_tag_id ? 'Tag registrada e ativa' : 'Nenhuma Patinha vinculada'}
            </Text>
          </View>

          {leiturasBloqueadas ? (
            <Text style={styles.tagAvisoTexto}>
              O histórico de leituras hoje só é liberado para a ONG responsável. Peça a ela para
              conferir quando e onde a Patinha foi escaneada.
            </Text>
          ) : ultimaLeitura ? (
            <>
              <View style={styles.tagBody}>
                <View style={styles.tagMapThumb}>
                  <Ionicons name="location" size={32} color={BRAND.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tagInfoLabel}>Última leitura detectada</Text>
                  <Text style={styles.tagInfoValue}>
                    {localDaLeitura(ultimaLeitura)}
                    {formatarData(ultimaLeitura.lida_em) ? `  ·  ${formatarData(ultimaLeitura.lida_em)}` : ''}
                  </Text>
                </View>
              </View>

              {leituras.slice(1, 5).map((l) => (
                <View key={l.id} style={styles.leituraItem}>
                  <Ionicons name="scan-outline" size={17} color="rgba(255,255,255,0.7)" />
                  <View style={styles.leituraTexto}>
                    <Text style={styles.leituraLocal}>{localDaLeitura(l)}</Text>
                    <Text style={styles.leituraData}>{formatarData(l.lida_em) ?? '—'}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.tagAvisoTexto}>
              {pet.smart_tag_id
                ? 'Nenhuma leitura registrada ainda. A primeira aparece aqui assim que alguém escanear a Patinha.'
                : 'Assim que a ONG vincular uma Patinha ao seu pet, as leituras aparecem aqui.'}
            </Text>
          )}
        </View>

        {/* Vacinas — direto do prontuário que a ONG mantém */}
        <Text style={styles.sectionTitle}>Saúde</Text>
        {vacinas.length === 0 ? (
          <View style={styles.vacCard}>
            <View style={styles.vacIcon}>
              <Ionicons name="shield-outline" size={24} color={BRAND.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vacTitle}>Sem vacinas registradas</Text>
              <Text style={styles.vacSub}>O prontuário é preenchido pela ONG no painel dela.</Text>
            </View>
          </View>
        ) : (
          vacinas.map((v, i) => (
            <View key={`${v.nome ?? 'vacina'}-${i}`} style={styles.vacItem}>
              <Ionicons name="shield-checkmark" size={20} color={BRAND.success} />
              <Text style={styles.vacItemNome}>{v.nome ?? v.vacina ?? 'Vacina'}</Text>
              <Text style={styles.vacItemData}>{v.data ?? v.aplicada_em ?? ''}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="MyPet" />
    </SafeAreaView>
  );
};

export default MyPetScreen;
