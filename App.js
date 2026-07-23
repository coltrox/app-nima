import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

// --- Autenticação ---
import Login from './src/screens/Auth/Login/index';
import Register from './src/screens/Auth/Register/index';
import ForgotPassword from './src/screens/Auth/ForgotPassword/index';
import VerifyCode from './src/screens/Auth/VerifyCode/index';
import ResetPassword from './src/screens/Auth/ResetPassword/index';

// --- App do tutor ---
//
// O Nima mobile é a superfície do TUTOR: adoção, Patinha, guias e apoio às
// campanhas. Contas de ONG e de desenvolvedor NÃO entram aqui — a gestão delas
// (acervo, homologação, candidaturas, equipe, log) vive só no painel web, e o
// Login recusa esses cargos com a explicação. Por isso não existem mais rotas
// de AdminDashboard/OngDashboard.
import Home from './src/screens/App/Home/index';
import Match from './src/screens/App/Match/index';
import MyPet from './src/screens/App/MyPet/index';
import SmartTag from './src/screens/App/SmartTag/index';
import Donation from './src/screens/App/Donation/index';
import Guide from './src/screens/App/Guide/index';
import Profile from './src/screens/App/Profile/index';
import PetDetails from './src/screens/App/PetDetails/index';
import Settings from './src/screens/App/Settings/index';
import Solicitacoes from './src/screens/App/Solicitacoes/index';
import Vagas from './src/screens/App/Vagas/index';
import Ongs from './src/screens/App/Ongs/index';
import Desaparecidos from './src/screens/App/Desaparecidos/index';
import Patinha from './src/screens/App/Patinha/index';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Home');

  // Fonte da marca carregada UMA vez na raiz. Antes só o Login chamava useFonts,
  // então no F5 as demais telas renderizavam com a fonte do sistema e trocavam
  // quando a Nunito terminava de carregar — era isso que fazia a fonte "pular".
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('@nima_token');
        const wasRemembered = await AsyncStorage.getItem('@nima_remember_me');

        // Com ou sem sessão a entrada é a Home: o app funciona para visitante,
        // e o que exige conta (adotar, meu pet, perfil) pede login na hora.
        setInitialRoute('Home');

        if (!token || wasRemembered !== 'true') {
          // Sessão não persistida: limpa para não reaproveitar token velho.
          if (token && wasRemembered !== 'true') {
            await AsyncStorage.multiRemove([
              '@nima_token',
              '@nima_user_role',
              '@nima_user_name',
              '@nima_profile_completed',
            ]);
          }
        }
      } catch (e) {
        setInitialRoute('Home');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Só renderiza depois que a sessão foi lida E a fonte carregou — sem isso
  // o app pisca com a fonte errada a cada recarga.
  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FBF6EC', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0151C8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        {/* Núcleo do tutor */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Match" component={Match} />
        <Stack.Screen name="PetDetails" component={PetDetails} />
        <Stack.Screen name="MyPet" component={MyPet} />
        <Stack.Screen name="Solicitacoes" component={Solicitacoes} />

        {/* Antiperda */}
        <Stack.Screen name="SmartTag" component={SmartTag} />
        <Stack.Screen name="Desaparecidos" component={Desaparecidos} />
        {/* Como conseguir uma Patinha: comprar, ou ganhar doando/sendo voluntário */}
        <Stack.Screen name="Patinha" component={Patinha} />

        {/* Apoiar e comunidade */}
        <Stack.Screen name="Donation" component={Donation} />
        <Stack.Screen name="Vagas" component={Vagas} />
        <Stack.Screen name="Ongs" component={Ongs} />

        {/* Conteúdo e conta */}
        <Stack.Screen name="Guide" component={Guide} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />

        {/* Auth */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
