import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zjgrhlzpiqlldgqozrsz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Y2xTdEIQ8R_47ivzTAJktg_wrBhtHbN'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface VoiceChatRecord {
  id?: string
  user_message: string
  ai_response: string
  language?: string
  created_at?: string
}

export interface MentorBookingRecord {
  id?: string
  mentor_name: string
  user_name: string
  phone_number: string
  business_type?: string
  booking_date: string
  time_slot: string
  status?: string
  created_at?: string
}

export interface SavedSchemeRecord {
  id?: string
  scheme_id: string
  scheme_name: string
  category: string
  created_at?: string
}

// ── Voice History Helpers ──────────────────────────────────────────────────
export async function saveVoiceChat(userMessage: string, aiResponse: string, language: string = 'hi-IN') {
  // Always save locally first for instant availability
  try {
    const local = JSON.parse(localStorage.getItem('gv_voice_history') || '[]')
    const newRecord: VoiceChatRecord = {
      id: 'local_' + Date.now(),
      user_message: userMessage,
      ai_response: aiResponse,
      language,
      created_at: new Date().toISOString(),
    }
    localStorage.setItem('gv_voice_history', JSON.stringify([newRecord, ...local].slice(0, 50)))
  } catch {}

  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('voice_chats')
      .insert([
        {
          user_message: userMessage,
          ai_response: aiResponse,
          language,
        },
      ])
      .select()

    if (error) console.warn('Supabase voice_chats insert error:', error.message)
    return data
  } catch (err) {
    console.warn('Supabase voice_chats exception:', err)
    return null
  }
}

export async function getVoiceHistory(limit = 10): Promise<VoiceChatRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('voice_chats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!error && data && data.length > 0) {
        return data
      }
    } catch (err) {
      console.warn('Supabase getVoiceHistory error:', err)
    }
  }

  // Fallback to local storage
  try {
    return JSON.parse(localStorage.getItem('gv_voice_history') || '[]').slice(0, limit)
  } catch {
    return []
  }
}

// ── Mentor Booking Helpers ─────────────────────────────────────────────────
export async function createMentorBooking(booking: MentorBookingRecord) {
  try {
    const local = JSON.parse(localStorage.getItem('gv_mentor_bookings') || '[]')
    const newBooking = {
      ...booking,
      id: 'book_' + Date.now(),
      status: 'Confirmed',
      created_at: new Date().toISOString(),
    }
    localStorage.setItem('gv_mentor_bookings', JSON.stringify([newBooking, ...local]))
  } catch {}

  if (!supabase) return { success: true }

  try {
    const { data, error } = await supabase
      .from('mentor_bookings')
      .insert([
        {
          mentor_name: booking.mentor_name,
          user_name: booking.user_name,
          phone_number: booking.phone_number,
          business_type: booking.business_type || 'Rural Entrepreneurship',
          booking_date: booking.booking_date,
          time_slot: booking.time_slot,
          status: 'Confirmed',
        },
      ])
      .select()

    if (error) {
      console.warn('Supabase booking error:', error.message)
      return { success: true, warning: error.message }
    }
    return { success: true, data }
  } catch (err: any) {
    console.warn('Supabase booking exception:', err)
    return { success: true }
  }
}

export async function cancelMentorBooking(bookingId?: string, mentorName?: string, bookingDate?: string) {
  try {
    const cancelledList: string[] = JSON.parse(localStorage.getItem('gv_cancelled_booking_ids') || '[]')
    if (bookingId && !cancelledList.includes(bookingId)) {
      cancelledList.push(bookingId)
    }
    if (mentorName && !cancelledList.includes(mentorName)) {
      cancelledList.push(mentorName)
    }
    localStorage.setItem('gv_cancelled_booking_ids', JSON.stringify(cancelledList))

    const local: MentorBookingRecord[] = JSON.parse(localStorage.getItem('gv_mentor_bookings') || '[]')
    const updated = local.map(b => {
      if ((bookingId && b.id === bookingId) || (mentorName && b.mentor_name === mentorName)) {
        return { ...b, status: 'Cancelled' }
      }
      return b
    })
    localStorage.setItem('gv_mentor_bookings', JSON.stringify(updated))
  } catch {}

  if (!supabase) return { success: true }

  try {
    let query = supabase.from('mentor_bookings').update({ status: 'Cancelled' })
    if (bookingId && !bookingId.startsWith('book_') && !bookingId.startsWith('local_')) {
      query = query.eq('id', bookingId)
    } else if (mentorName) {
      query = query.eq('mentor_name', mentorName)
    }

    await query
  } catch (err) {
    console.warn('Supabase cancel booking exception:', err)
  }
  return { success: true }
}

export async function getMentorBookings(): Promise<MentorBookingRecord[]> {
  const cancelledList: string[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('gv_cancelled_booking_ids') || '[]')
    } catch {
      return []
    }
  })()

  const mergeCancelledStatus = (list: MentorBookingRecord[]) => {
    return list.map(b => {
      if (
        (b.id && cancelledList.includes(b.id)) ||
        (b.mentor_name && cancelledList.includes(b.mentor_name))
      ) {
        return { ...b, status: 'Cancelled' }
      }
      return b
    })
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mentor_bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        return mergeCancelledStatus(data)
      }
    } catch (err) {
      console.warn('Supabase getMentorBookings error:', err)
    }
  }

  try {
    const local = JSON.parse(localStorage.getItem('gv_mentor_bookings') || '[]')
    return mergeCancelledStatus(local)
  } catch {
    return []
  }
}

// ── Saved Schemes Helpers ──────────────────────────────────────────────────
export async function toggleSaveScheme(schemeId: string, schemeName: string, category: string) {
  let isSaved = false
  try {
    const local: SavedSchemeRecord[] = JSON.parse(localStorage.getItem('gv_saved_schemes') || '[]')
    const exists = local.some(s => s.scheme_id === schemeId)
    let updated: SavedSchemeRecord[] = []
    if (exists) {
      updated = local.filter(s => s.scheme_id !== schemeId)
      isSaved = false
    } else {
      updated = [{ scheme_id: schemeId, scheme_name: schemeName, category, created_at: new Date().toISOString() }, ...local]
      isSaved = true
    }
    localStorage.setItem('gv_saved_schemes', JSON.stringify(updated))
  } catch {}

  if (supabase) {
    try {
      if (isSaved) {
        await supabase.from('saved_schemes').insert([{ scheme_id: schemeId, scheme_name: schemeName, category }])
      } else {
        await supabase.from('saved_schemes').delete().match({ scheme_id: schemeId })
      }
    } catch (err) {
      console.warn('Supabase toggleSaveScheme error:', err)
    }
  }

  return isSaved
}

export async function getSavedSchemes(): Promise<SavedSchemeRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('saved_schemes')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        return data
      }
    } catch (err) {
      console.warn('Supabase getSavedSchemes error:', err)
    }
  }

  try {
    return JSON.parse(localStorage.getItem('gv_saved_schemes') || '[]')
  } catch {
    return []
  }
}
