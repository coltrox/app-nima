import axios from 'axios';

const API_URL = 'http://192.168.0.233:3000/api/auth';

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
   * Registra um novo tutor no sistema.
   */
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
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
      // Aqui o 'message' capturará: "A nova senha não pode ser igual à senha atual."
      const message = error.response?.data?.message || 'Erro ao redefinir senha.';
      console.error(`[FRONT] Erro no ResetPassword: ${message}`);
      throw message;
    }
  }
};

export default authService;