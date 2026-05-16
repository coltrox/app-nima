import axios from 'axios';

  const API_URL = 'http://192.168.0.233:3000/api/auth';

  const authService = {
    // O parâmetro 'identifier' agora recebe o que foi digitado (ex: "pedro")
    login: async (identifier, password) => {
      try {
        console.log(`[FRONT] Tentando login para: ${identifier}`);
        
        // Enviamos 'email' como chave, mas o valor é o identificador genérico
        const response = await axios.post(`${API_URL}/login`, { 
          email: identifier, 
          password 
        });
        
        console.log(`[FRONT] Sucesso 200 (Login):`, response.data);
        return response.data;
      } catch (error) {
        const message = error.response?.data?.message || 'Erro de conexão';
        console.error(`[FRONT] Erro: ${message}`);
        throw message;
      }
    },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao criar conta';
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao solicitar recuperação.';
    }
  },

  verifyCode: async (email, code) => {
    try {
      const response = await axios.post(`${API_URL}/verify-code`, { email, code });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Código inválido.';
    }
  },

  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, { 
        email, 
        code, 
        password: newPassword 
      });
      return response.data;
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      throw serverMessage || 'Erro ao redefinir senha.';
    }
  }
};

export default authService;