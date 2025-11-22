export interface QuizData {
  // Dados pessoais
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  genero: string;

  // Objetivo
  objetivo: string;

  // Experiência e rotina
  experiencia: string;
  diasDisponiveis: number;
  tempoTreino: number;
  periodoTreino: string;

  // Local e equipamentos
  localTreino: string;
  equipamentos: string[];

  // Limitações
  lesoes: string[];
  restricoes: string[];

  // Alimentação
  preferenciasAlimentares: string[];
  alimentosEvitar: string[];
  refeicoesPreferidas?: number;
}
