import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Você é um nutricionista especializado em análise de alimentos. Analise a imagem fornecida e identifique:
1. Todos os alimentos visíveis
2. Estimativa de porção de cada alimento
3. Calorias e macros (proteínas, carboidratos, gorduras) de cada alimento
4. Total geral da refeição

Seja PRECISO e REALISTA nas estimativas. Retorne APENAS JSON válido no formato:
{
  "alimentos": [
    {
      "nome": "Nome do alimento",
      "porcao": "Quantidade estimada (ex: 150g, 1 unidade)",
      "calorias": 250,
      "proteinas": 20,
      "carboidratos": 30,
      "gorduras": 8
    }
  ],
  "total": {
    "calorias": 500,
    "proteinas": 40,
    "carboidratos": 60,
    "gorduras": 15
  },
  "observacoes": "Observações gerais sobre a refeição"
}`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analise esta refeição e forneça as informações nutricionais detalhadas.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      temperature: 0.5,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao analisar imagem. Tente novamente.' },
      { status: 500 }
    );
  }
}
