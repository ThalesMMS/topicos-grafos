/**
 * Revisão curricular equilibrada. Conteúdo, objetivos e estimativas de tempo:
 * docs/ROTEIRO_EQUILIBRADO.md. Autenticação e protocolo de sala são preservados.
 * Os módulos anteriores continuam no repositório como material de consulta;
 * não são importados pelo roteiro principal.
 */
import { slides, polls, DURACAO_ESTIMADA } from './slides/equilibrada/index.js';

export const CONFIG = {
  title: 'Teoria dos Grafos e Computabilidade',
  subtitle: 'Fundamentos, problemas e algoritmos — revisão equilibrada de grafos',
  presenter: { name: 'Antônio', role: 'Ciência da Computação — PUC Minas' },
  brand: {
    name: 'Teoria dos Grafos',
    colors: {
      background: '#0b1220', surface: '#111c30', text: '#f6f8fc',
      muted: '#b7c2d8', accent: '#74d4b3', accentStrong: '#31b98a'
    }
  },
  estimatedMinutes: DURACAO_ESTIMADA,
  polls,
  slides
};
