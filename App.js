import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// --- Importações de Autenticação ---
import Login from './src/screens/Auth/Login/index';
import Register from './src/screens/Auth/Register/index';
import ForgotPassword from './src/screens/Auth/ForgotPassword/index';
import VerifyCode from './src/screens/Auth/VerifyCode/index';
import ResetPassword from './src/screens/Auth/ResetPassword/index';

// --- Importações do Aplicativo ---
import Home from './src/screens/App/Home/index'; 
import Match from './src/screens/App/Match/index';
import MyPet from './src/screens/App/MyPet/index';
import SmartTag from './src/screens/App/SmartTag/index';
import Donation from './src/screens/App/Donation/index';
import Guide from './src/screens/App/Guide/index';
import Profile from './src/screens/App/Profile/index';
import PetDetails from './src/screens/App/PetDetails/index';
import Settings from './src/screens/App/Settings/index';

// --- Dashboards Específicos ---
import AdminDashboard from './src/screens/Admin/Dashboard/index';
import OngDashboard from './src/screens/Ong/Dashboard/index';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('@nima_token');
        const role = await AsyncStorage.getItem('@nima_user_role');
        const wasRemembered = await AsyncStorage.getItem('@nima_remember_me');

        // LÓGICA CORRIGIDA:
        // Só redireciona automaticamente se houver token E a caixa estava marcada.
        if (token && wasRemembered === 'true') {
          if (role === 'admin') {
            setInitialRoute('AdminDashboard');
          } else if (role === 'ong') {
            setInitialRoute('OngDashboard');
          } else {
            setInitialRoute('Home');
          }
        } else {
          // Se não marcou para lembrar ou não tem token, a rota inicial SEMPRE será Login.
          // Removido o multiRemove daqui para não bugar o login manual.
          setInitialRoute('Login');
        }
      } catch (e) {
        setInitialRoute('Login');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#05082b', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom', 
        }}
      >
        {/* Telas de Auth */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />

        {/* Telas de App / Dashboards */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="OngDashboard" component={OngDashboard} />
        
        {/* Outras Rotas */}
        <Stack.Screen name="Match" component={Match} />
        <Stack.Screen name="MyPet" component={MyPet} />
        <Stack.Screen name="SmartTag" component={SmartTag} />
        <Stack.Screen name="Donation" component={Donation} />
        <Stack.Screen name="Guide" component={Guide} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="PetDetails" component={PetDetails} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}