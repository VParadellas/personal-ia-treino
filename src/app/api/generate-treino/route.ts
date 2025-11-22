// src/app/api/generate-treino/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateWorkoutPlan } from '@/lib/ai-service';
import type { QuizData } from '@/lib/types';

// SERVER: usar SERVICE ROLE KEY (NUNCA commitar no client)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Missing Supabase env vars for server');
}

const supabaseServer = createClient(supabaseUrl, supabaseServiceRole, {
  auth: { persistSession: false },
});

export async function POST(request: NextRequest) {
  try {
    const quizData: QuizData = await request.json();

    // Validação básica
    if (!quizData || !quizData.nome || !quizData.objetivo) {
      return NextResponse.json({ error: 'Dados do quiz incompletos' }, { status: 400 });
    }

    // 1) obter access token do header Authorization
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
      return NextResponse.json({ error: 'Token de autorização ausente' }, { status: 401 });
    }

    // 2) validar token e buscar usuário
    // supabaseServer.auth.getUser(token) - a API aceita a passagem do token
    const { data: userData, error: userError } = await supabaseServer.auth.getUser(token);

    if (userError || !userData?.user) {
      console.error('Erro ao obter usuário da sessão:', userError);
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
    }

    const user = userData.user;
    const userId = user.id;

    // 3) gerar plano de treino via IA (sua função existente)
    const workoutPlan = await generateWorkoutPlan(quizData);

    // 4) salvar (upsert) no user_profiles
    const upsertBody = {
      id: userId,
      email: user.email,
      nome: quizData.nome || user.user_metadata?.name || null,
      quiz_data: quizData,
      workout_plan: workoutPlan,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabaseServer
      .from('user_profiles')
      .upsert(upsertBody, { onConflict: 'id' });

    if (upsertError) {
      console.error('Erro ao salvar perfil/workout:', upsertError);
      return NextResponse.json({ error: 'Falha ao salvar plano.' }, { status: 500 });
    }

    // 5) retornar o plano salvo (pode incluir um campo indicando persistência)
    return NextResponse.json({ workoutPlan, saved: true });
  } catch (error) {
    console.error('Erro ao gerar treino (server):', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
