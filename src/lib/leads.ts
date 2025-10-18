import { supabase } from './supabaseClient'

// 📦 Buscar todos os leads
export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar leads:', error)
    return []
  }
  return data || []
}

// 📝 Atualizar informações do lead
export async function updateLead(id: string, updates: any) {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Erro ao atualizar lead:', error)
    return null
  }
  return data?.[0] || null
}

// 📞 Registrar chamada (ligar / desligar)
export async function logCall(leadId: string, action: 'call' | 'hangup', byUser: string) {
  const { data, error } = await supabase
    .from('lead_calls')
    .insert([{ lead_id: leadId, action, by_user: byUser }])
    .select()

  if (error) {
    console.error('Erro ao registrar chamada:', error)
    return null
  }
  return data?.[0] || null
}

// 💬 Adicionar nota/comentário
export async function addNote(leadId: string, content: string, byUser: string) {
  const { data, error } = await supabase
    .from('lead_notes')
    .insert([{ lead_id: leadId, content, by_user: byUser }])
    .select()

  if (error) {
    console.error('Erro ao adicionar nota:', error)
    return null
  }
  return data?.[0] || null
}
