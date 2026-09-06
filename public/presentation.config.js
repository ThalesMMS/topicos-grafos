/**
 * Seminário de 88 minutos para quatro integrantes. Roteiro e fontes:
 * docs/ROTEIRO_SEMINARIO.md. Autenticação e protocolo de sala são preservados.
 * Os módulos anteriores continuam no repositório como material de consulta;
 * não são importados pelo roteiro principal.
 */
import { slides, polls, DURACAO_ESTIMADA } from './slides/seminario/index.js';

export const CONFIG = {
  title: 'Grafos, rotas e algoritmos',
  subtitle: 'Seminário de Ciência da Computação · ENADE e POSCOMP',
  presenter: { name: 'Antônio', role: 'Ciência da Computação — PUC Minas' },
  brand: {
    name: 'Teoria dos Grafos',
    colors: {
      background: '#f5f2e9', surface: '#fffdf7', text: '#252c30',
      muted: '#535d61', accent: '#17685b', accentStrong: '#14594d'
    }
  },
  estimatedMinutes: DURACAO_ESTIMADA,
  polls,
  slides
};
