import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const quizData = await request.json();

    const prompt = `Você é um personal trainer experiente. Crie um plano de treino COMPLETO e DETALHADO baseado nos seguintes dados:

DADOS DO USUÁRIO:
- Nome: ${quizData.nome}
- Idade: ${quizData.idade} anos
- Peso: ${quizData.peso}kg
- Altura: ${quizData.altura}cm
- Gênero: ${quizData.genero}
- Objetivo: ${quizData.objetivo}
- Experiência: ${quizData.experiencia}
- Dias disponíveis: ${quizData.diasDisponiveis} dias/semana
- Tempo por treino: ${quizData.tempoTreino} minutos
- Período: ${quizData.periodoTreino}
- Local: ${quizData.localTreino}
- Equipamentos: ${quizData.equipamentos?.join(', ') || 'Todos disponíveis'}
- Lesões: ${quizData.lesoes?.join(', ') || 'Nenhuma'}
- Restrições: ${quizData.restricoes?.join(', ') || 'Nenhuma'}

INSTRUÇÕES:
1. Crie um plano de treino semanal COMPLETO com exercícios específicos
2. Para cada exercício, inclua: nome, séries, repetições, descanso e dicas de execução
3. Divida os treinos por grupos musculares de forma inteligente
4. Inclua aquecimento e alongamento
5. Adapte à experiência do usuário (iniciante/intermediário/avançado)
6. Considere as lesões e restrições mencionadas
7. Seja ESPECÍFICO e DETALHADO - este é um plano real que a pessoa vai seguir

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem explicações extras):
{
  "titulo": "Plano de Treino Personalizado",
  "descricao": "Descrição geral do plano",
  "semanas": 4,
  "treinos": [
    {
      "dia": "Segunda-feira",
      "foco": "Peito e Tríceps",
      "duracao": 60,
      "aquecimento": "5 min de esteira + mobilidade articular",
      "exercicios": [
        {
          "nome": "Supino reto com barra",
          "series": 4,
          "repeticoes": "8-12",
          "descanso": "90s",
          "dicas": "Mantenha os pés firmes no chão e controle a descida"
        }
      ],
      "alongamento": "5 min focado em peito e tríceps"
    }
  ],
  "observacoes": "Dicas gerais e recomendações"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um personal trainer experiente especializado em criar planos de treino personalizados. Sempre retorne JSON válido sem markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const workoutPlan = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(workoutPlan);
  } catch (error) {
    console.error('Erro ao gerar treino:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar treino. Tente novamente.' },
      { status: 500 }
    );
  }
}
