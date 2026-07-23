import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PainelWeb from '../../components/PainelWeb';

// Destino do login quando cargo === 'desenvolvedor'.
// A grade de botões antiga não chamava nenhuma API — a governança do
// ecossistema (homologação, usuários, Patinhas em lote) vive no painel web.
const AdminDashboard = () => {
  const navigation = useNavigation();
  return <PainelWeb navigation={navigation} perfil="dev" />;
};

export default AdminDashboard;
