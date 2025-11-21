// Tipos do Personal IA

export interface QuizData {
  // Dados pessoais
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  genero: 'masculino' | 'feminino' | 'outro';
  
  // Objetivo
  objetivo: 'perder_peso' | 'ganhar_massa' | 'definir' | 'manter' | 'performance';
  
  // Experiência
  experiencia: 'iniciante' | 'intermediario' | 'avancado';
  
  // Rotina
  diasDisponiveis: number;
  tempoTreino: number; // minutos
  periodoTreino: 'manha' | 'tarde' | 'noite';
  
  // Equipamentos
  equipamentos: string[]; // ['halteres', 'barra', 'peso_corporal', etc]
  localTreino: 'academia' | 'casa' | 'parque';
  
  // Limitações
  lesoes: string[];
  restricoes: string[];
  
  // Preferências alimentares
  preferenciasAlimentares: string[]; // ['vegetariano', 'vegano', 'sem_lactose', etc]
  alimentosEvitar: string[];
  refeicoesPreferidas: number;
}

export interface Exercise {
  id: string;
  nome: string;
  grupoMuscular: string;
  series: number;
  repeticoes: string; // "8-12" ou "30 segundos"
  descanso: string; // "60 segundos"
  
  // Detalhes técnicos
  descricao: string;
  instrucoes: string[];
  respiracao: string;
  musculaturaAlvo: string[];
  velocidade: string;
  tempoTensao?: string;
  
  // Dicas e erros
  dicasOuro: string[];
  errosComuns: string[];
  
  // Alternativas
  exerciciosAlternativos: string[];
  
  // Ilustração
  ilustracaoUrl?: string;
  ilustracaoPrompt?: string;
}

export interface WorkoutDay {
  dia: string;
  foco: string;
  exercicios: Exercise[];
  observacoes: string[];
}

export interface WorkoutPlan {
  id: string;
  titulo: string;
  descricao: string;
  objetivo: string;
  duracao: string; // "8 semanas"
  frequencia: string; // "4x por semana"
  dias: WorkoutDay[];
  dicasGerais: string[];
  progressao: string;
  createdAt: Date;
}

export interface MealPlan {
  id: string;
  titulo: string;
  objetivo: string;
  calorias: number;
  macros: {
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  refeicoes: Meal[];
  listaCompras: string[];
  createdAt: Date;
}

export interface Meal {
  nome: string;
  horario: string;
  alimentos: FoodItem[];
  calorias: number;
  macros: {
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  preparo?: string;
  alternativas?: string[];
}

export interface FoodItem {
  nome: string;
  quantidade: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

export interface FoodAnalysis {
  id: string;
  imageUrl: string;
  alimentos: DetectedFood[];
  caloriasTotal: number;
  macrosTotal: {
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  timestamp: Date;
  refeicao?: string;
  editado: boolean;
}

export interface DetectedFood {
  nome: string;
  confianca: number; // 0-100
  porcao: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  quizData?: QuizData;
  workoutPlan?: WorkoutPlan;
  mealPlan?: MealPlan;
  foodHistory: FoodAnalysis[];
  createdAt: Date;
  updatedAt: Date;
}
