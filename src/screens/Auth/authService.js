import AsyncStorage from '@react-native-async-storage/async-storage';
import http from '../../services/http';
import {
  CREDENCIAIS_DEMO,
  TOKEN_DEMO,
  ativarDemo,
  demoAtivo,
  ehServidorInacessivel
} from '../../demo/modoDemo';

// Este arquivo usava `axios` cru com a URL montada à mão. Isso o deixava fora
// de tudo o que o cliente compartilhado (services/http.js) já resolve: timeout
// de 60s (o Render free hiberna e o 1º request leva ~50s), fallback automático
// para o Render quando o backend local não responde, e o adapter do modo
// demonstração. Justamente no login, que é a PRIMEIRA coisa que acontece na
// apresentação. Agora tudo passa pelo `http`, e os caminhos são relativos.
const AUTH = '/auth';

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

/** Sessão sintética da demonstração, no mesmo formato que o backend devolve. */
function sessaoDemo(email, senha, forcado = false) {
  const credencialBate =
    String(email || '').trim().toLowerCase() === CREDENCIAIS_DEMO.email &&
    String(senha || '') === CREDENCIAIS_DEMO.senha;

  if (!forcado && !credencialBate) {
    throw 'Sem servidor. Nesta situação só a conta de demonstração entra.';
  }

  return {
    token: TOKEN_DEMO,
    demonstracao: true,
    user: {
      id: 'demo-tutor',
      nome: CREDENCIAIS_DEMO.nome,
      email: CREDENCIAIS_DEMO.email,
      cargo: 'usuario',
      dono: true,
      permissoes: {}
    }
  };
}

/** Liga a demonstração se a credencial for a da conta demo. */
async function tentarEntrarEmDemo(email, senha) {
  const bate =
    String(email || '').trim().toLowerCase() === CREDENCIAIS_DEMO.email &&
    String(senha || '') === CREDENCIAIS_DEMO.senha;
  if (!bate) return null;
  await ativarDemo();
  return sessaoDemo(email, senha);
}

const authService = {
  /**
   * Realiza o login enviando credenciais ao backend.
   */
  /**
   * Login. Com servidor no ar, quem decide é SEMPRE o backend — senha errada
   * continua sendo senha errada e nada de demonstração acontece.
   *
   * Só quando não houve servidor nenhum (erro de rede, timeout, ou o 503
   * SERVIDOR_INDISPONIVEL do backend quando o banco está fora) o app cai na
   * demonstração, e mesmo aí apenas para as credenciais da conta demo.
   */
  login: async (identifier, password) => {
    // Já em demonstração (o app foi reaberto sem servidor): resolve local.
    if (demoAtivo()) return sessaoDemo(identifier, password);

    try {
      const response = await http.post(`${AUTH}/login`, { email: identifier, password });
      return response.data;
    } catch (error) {
      if (ehServidorInacessivel(error)) {
        const sessao = await tentarEntrarEmDemo(identifier, password);
        if (sessao) return sessao;
        throw 'Sem conexão com o servidor. Use a conta de demonstração para ver o app offline.';
      }
      const message = error.response?.data?.message || 'Erro de conexão';
      throw message;
    }
  },

  /** Entra na demonstração de propósito, pelo botão da tela de Login. */
  entrarEmDemonstracao: async () => {
    await ativarDemo();
    return sessaoDemo(CREDENCIAIS_DEMO.email, CREDENCIAIS_DEMO.senha, true);
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
      const response = await http.post(`${AUTH}/register`, {
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
      const response = await http.post(`${AUTH}/forgot-password`, { email });
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
      const response = await http.post(`${AUTH}/verify-code`, { email, code });
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
      const response = await http.post(`${AUTH}/reset-password`, { 
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
      const response = await http.post(`${AUTH}/complete-profile`, profileData, {
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