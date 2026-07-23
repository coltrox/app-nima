// Carregamento padrão das telas: chama o service, guarda dado/erro e recarrega
// quando a tela volta ao foco. Toda tela ligada no backend usa este hook para
// não repetir o mesmo try/catch/loading dez vezes.
//
// Importadores: Home, Donation, MyPet, Match, PetDetails, Solicitacoes, Vagas,
// Ongs, Desaparecidos, SmartTag.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { mensagemDoErro } from '../services/http';

/**
 * @param {Function} carregador  função async que devolve os dados
 * @param {Object}   opcoes
 * @param {any}      opcoes.inicial      valor antes da primeira resposta
 * @param {boolean}  opcoes.aoFocar      recarrega quando a tela ganha foco (padrão: true)
 * @param {Array}    opcoes.deps         dependências que disparam nova busca
 */
export default function useCarregar(carregador, { inicial = null, aoFocar = true, deps = [] } = {}) {
  const [dados, setDados] = useState(inicial);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Evita setState depois que a tela saiu (o Render free demora e o usuário navega).
  const vivo = useRef(true);
  useEffect(() => {
    vivo.current = true;
    return () => { vivo.current = false; };
  }, []);

  const buscar = useCallback(async ({ silencioso = false } = {}) => {
    if (!silencioso) setCarregando(true);
    setErro(null);
    try {
      const resultado = await carregador();
      if (vivo.current) setDados(resultado);
    } catch (e) {
      if (vivo.current) setErro(mensagemDoErro(e));
    } finally {
      if (vivo.current) setCarregando(false);
    }
    // `carregador` costuma ser inline; as deps explícitas é que mandam.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { buscar(); }, [buscar]);

  useFocusEffect(
    useCallback(() => {
      if (aoFocar) buscar({ silencioso: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buscar, aoFocar])
  );

  return { dados, carregando, erro, recarregar: buscar };
}
