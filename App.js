import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Importação das suas telas
import Login from './src/screens/Auth/Login/index';
import Register from './src/screens/Auth/Register/index';
import ForgotPassword from './src/screens/Auth/ForgotPassword/index';
import VerifyCode from './src/screens/Auth/VerifyCode/index';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          // Mantém o estado da tela anterior, evitando flashes no gradiente
          freezeOnBlur: true, 
          animation: 'fade_from_bottom', 
        }}
      >
        {/* Tela Principal de Login */}
        <Stack.Screen name="Login" component={Login} />
        
        {/* Registro: Usa a animação padrão fade_from_bottom */}
        <Stack.Screen name="Register" component={Register} />

        {/* Esqueci a Senha: Sem animação para a pata não "pular" */}
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{
            animation: 'none', 
          }}
        />

        {/* Verificação de Código: Também sem animação de transição de página. 
            Como a pata está no mesmo lugar, a troca de tela parecerá 
            apenas uma mudança suave no conteúdo do formulário. */}
        <Stack.Screen 
          name="VerifyCode" 
          component={VerifyCode} 
          options={{
            animation: 'none',
          }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}