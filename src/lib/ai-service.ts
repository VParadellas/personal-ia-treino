import { QuizData, WorkoutPlan, Exercise, WorkoutDay } from './types';

// Serviço de IA para gerar treinos personalizados
export async function generateWorkoutPlan(quizData: QuizData): Promise<WorkoutPlan> {
  // Validar API Key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada. Configure sua chave da OpenAI nas variáveis de ambiente.');
  }

  const prompt = buildWorkoutPrompt(quizData);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um personal trainer expert com 20 anos de experiência. Crie planos de treino personalizados, detalhados e seguros. 
            
IMPORTANTE: Retorne APENAS um JSON válido, sem markdown, sem explicações extras. O JSON deve seguir EXATAMENTE esta estrutura:

{
  "titulo": "string",
  "descricao": "string",
  "objetivo": "string",
  "duracao": "string",
  "frequencia": "string",
  "dias": [
    {
      "dia": "string",
      "foco": "string",
      "exercicios": [
        {
          "nome": "string",
          "grupoMuscular": "string",
          "series": number,
          "repeticoes": "string",
          "descanso": "string",
          "descricao": "string",
          "instrucoes": ["string"],
          "respiracao": "string",
          "musculaturaAlvo": ["string"],
          "velocidade": "string",
          "tempoTensao": "string",
          "dicasOuro": ["string"],
          "errosComuns": ["string"],
          "exerciciosAlternativos": ["string"],
          "ilustracaoPrompt": "string detalhado para gerar ilustração do exercício"
        }
      ],
      "observacoes": ["string"]
    }
  ],
  "dicasGerais": ["string"],
  "progressao": "string"
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro na API OpenAI: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Resposta inválida da API OpenAI');
    }

    const content = data.choices[0].message.content;
    
    // Remove markdown se houver
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const workoutData = JSON.parse(jsonContent);
    
    // Adiciona IDs e timestamps
    const workoutPlan: WorkoutPlan = {
      id: generateId(),
      ...workoutData,
      dias: workoutData.dias.map((dia: any) => ({
        ...dia,
        exercicios: dia.exercicios.map((ex: any) => ({
          id: generateId(),
          ...ex,
        })),
      })),
      createdAt: new Date(),
    };
    
    return workoutPlan;
  } catch (error) {
    console.error('Erro detalhado ao gerar treino:', error);
    
    // Mensagens de erro mais específicas
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        throw new Error('Configure sua chave da OpenAI para gerar treinos personalizados.');
      }
      if (error.message.includes('401')) {
        throw new Error('Chave da OpenAI inválida. Verifique suas credenciais.');
      }
      if (error.message.includes('429')) {
        throw new Error('Limite de requisições atingido. Tente novamente em alguns instantes.');
      }
      throw error;
    }
    
    throw new Error('Erro desconhecido ao gerar treino. Tente novamente.');
  }
}

function buildWorkoutPrompt(quiz: QuizData): string {
  return `Crie um plano de treino COMPLETO e DETALHADO para:

**PERFIL DO ALUNO:**
- Nome: ${quiz.nome}
- Idade: ${quiz.idade} anos
- Peso: ${quiz.peso}kg | Altura: ${quiz.altura}cm
- Gênero: ${quiz.genero}
- Objetivo: ${quiz.objetivo}
- Experiência: ${quiz.experiencia}

**DISPONIBILIDADE:**
- Dias disponíveis: ${quiz.diasDisponiveis}x por semana
- Tempo por treino: ${quiz.tempoTreino} minutos
- Período: ${quiz.periodoTreino}

**RECURSOS:**
- Local: ${quiz.localTreino}
- Equipamentos: ${quiz.equipamentos.join(', ')}

**LIMITAÇÕES:**
- Lesões: ${quiz.lesoes.length > 0 ? quiz.lesoes.join(', ') : 'Nenhuma'}
- Restrições: ${quiz.restricoes.length > 0 ? quiz.restricoes.join(', ') : 'Nenhuma'}

**INSTRUÇÕES:**
1. Crie um treino de ${quiz.diasDisponiveis} dias por semana
2. Cada exercício DEVE ter:
   - Séries, repetições e descanso específicos
   - Descrição completa do movimento
   - Instruções passo a passo (mínimo 4 passos)
   - Padrão respiratório correto
   - Musculatura alvo detalhada
   - Velocidade de execução
   - Tempo sob tensão (quando aplicável)
   - 3-5 DICAS DE OURO específicas
   - 3-5 ERROS COMUNS a evitar
   - 2-3 exercícios alternativos
   - Um prompt DETALHADO para gerar ilustração (descreva posição inicial, movimento, ângulos, postura)

3. Adapte ao nível de experiência (${quiz.experiencia})
4. Respeite as lesões e limitações
5. Use apenas equipamentos disponíveis
6. Inclua aquecimento e alongamento quando necessário
7. Adicione progressão clara para as próximas semanas

Retorne APENAS o JSON, sem explicações extras.`;
}

// Gerar ilustração de exercício usando DALL-E
export async function generateExerciseIllustration(exerciseName: string, prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  try {
    const enhancedPrompt = `Create a clear, professional fitness illustration showing the exercise "${exerciseName}". 
    
Style: Clean vector illustration, anatomical accuracy, simple background.
Show: Starting position and movement direction with arrows.
Details: ${prompt}
    
The illustration should be educational, showing proper form and technique clearly.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro ao gerar ilustração: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Erro ao gerar ilustração:', error);
    throw error;
  }
}

// Analisar foto de alimento
export async function analyzeFoodImage(imageUrl: string): Promise<any> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um nutricionista expert. Analise fotos de alimentos e retorne um JSON com:
            
{
  "alimentos": [
    {
      "nome": "string",
      "confianca": number (0-100),
      "porcao": "string (ex: 1 unidade, 100g, 1 xícara)",
      "calorias": number,
      "proteinas": number,
      "carboidratos": number,
      "gorduras": number
    }
  ],
  "observacoes": ["string"]
}

Seja preciso nas estimativas de porção e valores nutricionais.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta foto de alimento e retorne os dados nutricionais em JSON.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erro na análise: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('Erro ao analisar alimento:', error);
    throw error;
  }
}

// Utilitários
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
