import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL as BASE } from '../../config/api';

const API_URL = `${BASE}/auth`;

/**
 * Função interna baseada na fórmula do Módulo 11 para validação real de CPF.
 */
const validateCPF = (rawCpf) => {
  if (!rawCpf) return false;
  
  // Remove caracteres especiais como pontos e hífens
  const cleanCpf = rawCpf.replace(/[^\d]+/g, '');

  // Verifica comprimento padrão e elimina sequências repetidas conhecidas inválidas
  if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) {
    return false;
  }

  // 1. Cálculo do primeiro dígito verificador (10º dígito)
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let rest = sum % 11;
  let digit1 = rest < 2 ? 0 : 11 - rest;

  // Verifica se o 10º dígito confere
  if (digit1 !== parseInt(cleanCpf.charAt(9))) {
    return false;
  }

  // 2. Cálculo do segundo dígito verificador (11º dígito)
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  rest = sum % 11;
  let digit2 = rest < 2 ? 0 : 11 - rest;

  // Verifica se o 11º dígito confere
  if (digit2 !== parseInt(cleanCpf.charAt(10))) {
    return false;
  }

  return true;
};

const authService = {
  /**
   * Realiza o login enviando credenciais ao backend.
   */
  login: async (identifier, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { 
        email: identifier, 
        password 
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erro de conexão';
      throw message;
    }
  },

  /**
   * Registra um novo tutor no sistema com validação e higienização segura de dados.
   */
  register: async (userData) => {
    const { nome, email, cpf, password } = userData;

    // Executa a regra de validação segura antes de disparar a requisição HTTP
    if (!validateCPF(cpf)) {
      throw 'Por favor, insira um CPF válido.';
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        nome,
        email,
        cpf: cpf.replace(/[^\d]+/g, ''), // Envia estritamente os números limpos ao backend
        password
      });
      return response.data;
    } catch (error) {
      // Captura de forma robusta as mensagens do backend (ex: CPF/E-mail duplicado)
      const message = error.response?.data?.message || 'Erro ao criar conta';
      throw message;
    }
  },

  /**
   * Solicita o envio do código de recuperação por e-mail.
   */
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao solicitar recuperação.';
      throw message;
    }
  },

  /**
   * Valida se o código inserido pelo usuário coincide com o token no banco.
   */
  verifyCode: async (email, code) => {
    try {
      const response = await axios.post(`${API_URL}/verify-code`, { email, code });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Código inválido.';
      throw message;
    }
  },

  /**
   * Envia a nova senha. 
   * O backend agora valida se a senha é igual à anterior e retorna erro 400 se for.
   */
  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, { 
        email, 
        code, 
        password: newPassword 
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao redefinir senha.';
      console.error(`[FRONT] Erro no ResetPassword: ${message}`);
      throw message;
    }
  },

  /**
   * Método auxiliar para extrair apenas o primeiro nome do usuário.
   */
  getFirstName: (fullName) => {
    if (!fullName) return 'Usuário';
    return fullName.trim().split(' ')[0];
  },

  /**
   * Envia os dados do formulário de conclusão de perfil para o backend.
   */
  completeProfile: async (profileData) => {
    try {
      const token = await AsyncStorage.getItem('@nima_token');
      const response = await axios.post(`${API_URL}/complete-profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Salva localmente que o formulário foi respondido com sucesso
      await AsyncStorage.setItem('@nima_profile_completed', 'true');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar o formulário.';
      throw message;
    }
  }
};

export default authService;