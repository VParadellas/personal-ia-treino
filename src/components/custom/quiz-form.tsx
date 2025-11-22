// obter token antes de chamar API
const session = await (async () => {
  // import supabase client donde você já tem (no client)
  const { data } = await (await import('@/lib/supabase')).supabase.auth.getSession();
  return data?.session ?? null;
})();

const accessToken = session?.access_token;

const response = await fetch('/api/generate-treino', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify(formData),
});
