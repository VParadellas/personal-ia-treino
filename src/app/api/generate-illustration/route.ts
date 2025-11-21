import { NextRequest, NextResponse } from 'next/server';
import { generateExerciseIllustration } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { exerciseName, prompt } = await request.json();
    
    if (!exerciseName || !prompt) {
      return NextResponse.json(
        { error: 'Nome do exercício e prompt são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Gerar ilustração com DALL-E
    const imageUrl = await generateExerciseIllustration(exerciseName, prompt);
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Erro ao gerar ilustração:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar ilustração. Tente novamente.' },
      { status: 500 }
    );
  }
}
