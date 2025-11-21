import { NextRequest, NextResponse } from 'next/server';
import { generateWorkoutPlan } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const quizData = await request.json();
    
    // Validação básica
    if (!quizData.nome || !quizData.objetivo) {
      return NextResponse.json(
        { error: 'Dados do quiz incompletos' },
        { status: 400 }
      );
    }
    
    // Gerar plano de treino com IA
    const workoutPlan = await generateWorkoutPlan(quizData);
    
    return NextResponse.json(workoutPlan);
  } catch (error) {
    console.error('Erro ao gerar treino:', error);
    
    // Retornar mensagem de erro mais específica
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro ao gerar plano de treino. Tente novamente.';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
