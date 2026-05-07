import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// --- Importações de Autenticação ---
import Login from './src/screens/Auth/Login/index';
import Register from './src/screens/Auth/Register/index';
import ForgotPassword from './src/screens/Auth/ForgotPassword/index';
import VerifyCode from './src/screens/Auth/VerifyCode/index';
import ResetPassword from './src/screens/Auth/ResetPassword/index';

// --- Importações do Aplicativo (Ecossistema nima) ---
import Home from './src/screens/App/Home/index'; 
import Match from './src/screens/App/Match/index';
import MyPet from './src/screens/App/MyPet/index';
import SmartTag from './src/screens/App/SmartTag/index';
import Donation from './src/screens/App/Donation/index';
import Guide from './src/screens/App/Guide/index';
import Profile from './src/screens/App/Profile/index';
import PetDetails from './src/screens/App/PetDetails/index';
import Settings from './src/screens/App/Settings/index'; // Importação da nova tela

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          freezeOnBlur: true, 
          animation: 'fade_from_bottom', 
        }}
      >
        {/* Grupo de Autenticação */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{ animation: 'none' }}
        />
        <Stack.Screen 
          name="VerifyCode" 
          component={VerifyCode} 
          options={{ animation: 'none' }}
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPassword} 
          options={{ animation: 'none' }}
        />

        {/* Grupo do Aplicativo (Áreas principais do nima) */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ animation: 'fade' }} 
        />
        <Stack.Screen name="Match" component={Match} />
        <Stack.Screen name="MyPet" component={MyPet} />
        <Stack.Screen name="SmartTag" component={SmartTag} />
        <Stack.Screen name="Donation" component={Donation} />
        <Stack.Screen name="Guide" component={Guide} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="PetDetails" component={PetDetails} />
        
        {/* Nova Rota de Configurações */}
        <Stack.Screen 
          name="Settings" 
          component={Settings} 
          options={{ animation: 'slide_from_right' }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}