// Leitura contínua do acelerômetro + checagem de estabilidade antes do envio.
//
// Guarda as amostras dos últimos segundos numa ref (sem re-render por amostra
// guardada) e expõe só o valor atual para o medidor da tela.
//
// Importador: App/Avistamento.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Accelerometer } from 'expo-sensors';
import { LIMITE_G, magnitudeG } from '../services/hardware';

const INTERVALO_MS = 100;       // 10 leituras por segundo
const HISTORICO_MS = 5000;      // quanto tempo de amostras manter
const ANTES_DO_TOQUE_MS = 1000; // o segundo antes de tocar em "Enviar" também conta

export default function useAcelerometro() {
  // null = ainda verificando; false = aparelho sem sensor (ou sensor falhou).
  const [disponivel, setDisponivel] = useState(null);
  const [atual, setAtual] = useState(1);
  const amostras = useRef([]);

  useEffect(() => {
    let assinatura;
    let ativo = true;

    (async () => {
      try {
        const ok = await Accelerometer.isAvailableAsync();
        if (!ativo) return;
        setDisponivel(ok);
        if (!ok) return;

        Accelerometer.setUpdateInterval(INTERVALO_MS);
        assinatura = Accelerometer.addListener((leitura) => {
          const g = magnitudeG(leitura);
          const agora = Date.now();
          const fila = amostras.current;
          fila.push({ t: agora, g });
          while (fila.length && agora - fila[0].t > HISTORICO_MS) fila.shift();
          setAtual(g);
        });
      } catch {
        if (ativo) setDisponivel(false);
      }
    })();

    // Desliga o sensor ao sair da tela: evita gasto de bateria e vazamento.
    return () => {
      ativo = false;
      assinatura?.remove();
    };
  }, []);

  /**
   * Observa o aparelho por `duracaoMs` e devolve o pico de aceleração.
   * Sem sensor, responde { disponivel: false } e a tela decide (degradação graciosa).
   */
  const verificarEstabilidade = useCallback(
    (duracaoMs = 1500) =>
      new Promise((resolve) => {
        if (!disponivel) {
          resolve({ disponivel: false, estavel: true, pico: null });
          return;
        }
        const inicio = Date.now() - ANTES_DO_TOQUE_MS;
        setTimeout(() => {
          const janela = amostras.current.filter((a) => a.t >= inicio);
          if (janela.length === 0) {
            // Sensor parou de mandar dados no meio do caminho.
            resolve({ disponivel: false, estavel: true, pico: null });
            return;
          }
          const pico = janela.reduce((maior, a) => Math.max(maior, a.g), 0);
          resolve({ disponivel: true, estavel: pico <= LIMITE_G, pico });
        }, duracaoMs);
      }),
    [disponivel]
  );

  return { disponivel, atual, verificarEstabilidade };
}
