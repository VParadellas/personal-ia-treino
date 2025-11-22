import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const quizData = await request.json();

    // Calcular IMC
    const imc = quizData.peso / Math.pow(quizData.altura / 100, 2);
    
    // Calcular TMB (Taxa Metabólica Basal) usando fórmula de Harris-Benedict
    let tmb;
    if (quizData.genero === 'masculino') {
      tmb = 88.362 + (13.397 * quizData.peso) + (4.799 * quizData.altura) - (5.677 * quizData.idade);
    } else {
      tmb = 447.593 + (9.247 * quizData.peso) + (3.098 * quizData.altura) - (4.330 * quizData.idade);
    }

    // Ajustar calorias baseado no objetivo e nível de atividade
    const fatorAtividade = quizData.diasDisponiveis >= 5 ? 1.55 : quizData.diasDisponiveis >= 3 ? 1.375 : 1.2;
    let caloriasAlvo = tmb * fatorAtividade;

    if (quizData.objetivo === 'perder_peso') {
      caloriasAlvo -= 500;
    } else if (quizData.objetivo === 'ganhar_massa') {
      caloriasAlvo += 500;
    }

    // Gerar plano de treino com OpenAI
    const treinoPrompt = `
Você é um personal trainer experiente. Crie um plano de treino COMPLETO e DETALHADO baseado nestas informações:

DADOS DO ALUNO:
- Nome: ${quizData.nome}
- Idade: ${quizData.idade} anos
- Peso: ${quizData.peso}kg | Altura: ${quizData.altura}cm | IMC: ${imc.toFixed(1)}
- Gênero: ${quizData.genero}
- Objetivo: ${quizData.objetivo}
- Experiência: ${quizData.experiencia}
- Dias disponíveis: ${quizData.diasDisponiveis} dias/semana
- Tempo por treino: ${quizData.tempoTreino} minutos
- Período: ${quizData.periodoTreino}
- Local: ${quizData.localTreino}
- Equipamentos: ${quizData.equipamentos?.join(', ') || 'Nenhum'}
- Lesões/Limitações: ${quizData.lesoes?.join(', ') || 'Nenhuma'}
- Restrições: ${quizData.restricoes?.join(', ') || 'Nenhuma'}

INSTRUÇÕES:
1. Crie um plano de ${quizData.diasDisponiveis} dias por semana
2. Cada treino deve ter duração aproximada de ${quizData.tempoTreino} minutos
3. Adapte ao nível ${quizData.experiencia}
4. Use APENAS os equipamentos disponíveis
5. Considere as lesões e limitações mencionadas
6. Inclua aquecimento e alongamento
7. Para cada exercício, especifique: séries, repetições, descanso e dicas de execução
8. Organize por grupos musculares de forma inteligente

FORMATO DE RESPOSTA (JSON):
{
  "titulo": "Plano de Treino Personalizado",
  "resumo": "Breve descrição do plano (2-3 linhas)",
  "observacoes": ["Dica importante 1", "Dica importante 2", "Dica importante 3"],
  "treinos": [
    {
      "dia": "Dia 1",
      "foco": "Peito e Tríceps",
      "duracao": "${quizData.tempoTreino} min",
      "aquecimento": "Descrição do aquecimento (5-10 min)",
      "exercicios": [
        {
          "nome": "Nome do exercício",
          "series": "3-4",
          "repeticoes": "8-12",
          "descanso": "60-90s",
          "observacoes": "Dicas de execução e cuidados"
        }
      ],
      "alongamento": "Descrição do alongamento (5-10 min)"
    }
  ]
}

Seja específico, profissional e motivador!`;

    const treinoResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um personal trainer experiente e certificado. Crie planos de treino detalhados, seguros e eficientes. Sempre responda em JSON válido.',
        },
        {
          role: 'user',
          content: treinoPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const planoTreino = JSON.parse(treinoResponse.choices[0].message.content || '{}');

    // Gerar plano alimentar com OpenAI
    const dietaPrompt = `
Você é um nutricionista experiente. Crie um plano alimentar COMPLETO e DETALHADO baseado nestas informações:

DADOS DO CLIENTE:
- Nome: ${quizData.nome}
- Idade: ${quizData.idade} anos
- Peso: ${quizData.peso}kg | Altura: ${quizData.altura}cm | IMC: ${imc.toFixed(1)}
- Gênero: ${quizData.genero}
- Objetivo: ${quizData.objetivo}
- TMB: ${tmb.toFixed(0)} kcal
- Calorias alvo: ${caloriasAlvo.toFixed(0)} kcal/dia
- Nível de atividade: ${quizData.diasDisponiveis} treinos/semana
- Preferências: ${quizData.preferenciasAlimentares?.join(', ') || 'Sem restrições'}
- Alimentos a evitar: ${quizData.alimentosEvitar?.join(', ') || 'Nenhum'}
- Refeições preferidas: ${quizData.refeicoesPreferidas || 4} por dia

INSTRUÇÕES:
1. Crie um plano de ${quizData.refeicoesPreferidas || 4} refeições por dia
2. Total de ${caloriasAlvo.toFixed(0)} kcal/dia
3. Distribua macros adequadamente para o objetivo
4. Respeite as preferências e restrições alimentares
5. Inclua opções variadas e práticas
6. Para cada refeição: horário sugerido, alimentos, quantidades e calorias aproximadas
7. Adicione dicas de preparo e substituições

FORMATO DE RESPOSTA (JSON):
{
  "titulo": "Plano Alimentar Personalizado",
  "resumo": "Breve descrição do plano (2-3 linhas)",
  "metasCalorias": {
    "total": ${caloriasAlvo.toFixed(0)},
    "proteinas": "valor em gramas",
    "carboidratos": "valor em gramas",
    "gorduras": "valor em gramas"
  },
  "observacoes": ["Dica importante 1", "Dica importante 2", "Dica importante 3"],
  "refeicoes": [
    {
      "nome": "Café da Manhã",
      "horario": "07:00 - 08:00",
      "calorias": "valor aproximado",
      "alimentos": [
        {
          "item": "Nome do alimento",
          "quantidade": "quantidade específica",
          "calorias": "valor aproximado"
        }
      ],
      "preparo": "Dicas de preparo",
      "substituicoes": ["Opção 1", "Opção 2"]
    }
  ],
  "listaCompras": {
    "proteinas": ["item 1", "item 2"],
    "carboidratos": ["item 1", "item 2"],
    "vegetais": ["item 1", "item 2"],
    "frutas": ["item 1", "item 2"],
    "outros": ["item 1", "item 2"]
  },
  "dicasGerais": ["Dica 1", "Dica 2", "Dica 3"]
}

Seja específico, prático e motivador!`;

    const dietaResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um nutricionista experiente e certificado. Crie planos alimentares detalhados, saudáveis e práticos. Sempre responda em JSON válido.',
        },
        {
          role: 'user',
          content: dietaPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const planoDieta = JSON.parse(dietaResponse.choices[0].message.content || '{}');

    // Retornar planos completos
    return NextResponse.json({
      success: true,
      dados: {
        nome: quizData.nome,
        imc: imc.toFixed(1),
        tmb: tmb.toFixed(0),
        caloriasAlvo: caloriasAlvo.toFixed(0),
      },
      treino: planoTreino,
      dieta: planoDieta,
    });
  } catch (error) {
    console.error('Erro ao gerar planos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao gerar seus planos personalizados. Tente novamente.' 
      },
      { status: 500 }
    );
  }
}
