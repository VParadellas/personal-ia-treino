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
        { error: 'URL da imagem é obrigatória' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise esta imagem de alimento e forneça uma resposta APENAS em formato JSON válido, sem texto adicional antes ou depois. Use esta estrutura exata:

{
  "alimentos": [
    {
      "nome": "nome do alimento",
      "porcao": "quantidade estimada (ex: 150g, 1 unidade)",
      "calorias": número,
      "proteinas": número,
      "carboidratos": número,
      "gorduras": número
    }
  ],
  "total": {
    "calorias": número,
    "proteinas": número,
    "carboidratos": número,
    "gorduras": número
  },
  "observacoes": "observações sobre a refeição (opcional)"
}

Seja preciso nas estimativas de porção e valores nutricionais. Se não conseguir identificar claramente, informe na observação.`,
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
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('Resposta vazia da API');
    }

    // Parse do JSON retornado
    const analysis = JSON.parse(content);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Erro ao analisar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao analisar imagem: ' + error.message },
      { status: 500 }
    );
  }
}
