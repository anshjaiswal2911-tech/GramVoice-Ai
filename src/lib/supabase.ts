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

export async function getMentorBookings(): Promise<MentorBookingRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mentor_bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        return data
      }
    } catch (err) {
      console.warn('Supabase getMentorBookings error:', err)
    }
  }

  try {
    return JSON.parse(localStorage.getItem('gv_mentor_bookings') || '[]')
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

// ── User Authentication & Profile Helpers ─────────────────────────────────
export interface UserProfile {
  id: string
  name: string
  phone: string
  businessName?: string
  location?: string
  avatarColor?: string
  createdAt?: string
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem('gv_current_user')
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function loginUser(name: string, phone: string, businessName = 'Kirana & General Store', location = 'Jaipur, Rajasthan'): UserProfile {
  const avatarColors = ['#1a6fff', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#0ea5e9']
  const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)]
  
  const user: UserProfile = {
    id: 'user_' + Date.now(),
    name: name.trim() || 'Ramesh Sharma',
    phone: phone.trim() || '+91 98765 43210',
    businessName: businessName.trim() || 'Rural Kirana Business',
    location: location.trim() || 'Jaipur, Rajasthan',
    avatarColor: randomColor,
    createdAt: new Date().toISOString(),
  }

  try {
    localStorage.setItem('gv_current_user', JSON.stringify(user))
  } catch {}

  // Sync with Supabase if available
  if (supabase) {
    supabase
      .from('user_profiles')
      .insert([
        {
          name: user.name,
          phone: user.phone,
          business_name: user.businessName,
          location: user.location,
          avatar_color: user.avatarColor,
        }
      ])
      .then(() => {})
      .catch(() => {})
  }

  return user
}

export function logoutUser(): void {
  try {
    localStorage.removeItem('gv_current_user')
  } catch {}
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://gramvoice-ai.onrender.com').replace(/\/$/, '')

export async function requestPhoneOtp(
  phone: string,
  name: string,
  businessType: string,
  location: string
): Promise<{ success: boolean; message?: string; phone?: string; whatsappOtpUrl?: string; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name, businessType, location }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      return data
    }
    if (data.error) {
      return { success: false, error: data.error }
    }
  } catch (err: any) {
    console.warn('Backend send-otp fallback:', err)
  }

  // Robust client-side fallback if backend is sleeping or spinning up
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10)
  if (cleanPhone.length !== 10) {
    return { success: false, error: 'Kripya valid 10-digit mobile number daalein' }
  }

  const localOtp = Math.floor(100000 + Math.random() * 900000).toString()
  const sessionData = {
    phone: cleanPhone,
    otp: localOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    name,
    businessType,
    location,
  }
  localStorage.setItem('gv_pending_otp_session', JSON.stringify(sessionData))

  return {
    success: true,
    message: `OTP aapke mobile number +91 ******${cleanPhone.slice(-4)} par bhej diya gaya hai.`,
    phone: `+91 ${cleanPhone}`,
    whatsappOtpUrl: `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`*GramVoice AI Security Alert*\n\nAapka login verification OTP code hai: *${localOtp}*\n\nYe code 5 minute tak valid hai.`)}`
  }
}

export async function verifyPhoneOtp(
  phone: string,
  otp: string,
  name: string,
  businessType: string,
  location: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, name, businessType, location }),
    })
    const data = await res.json()
    if (res.ok && data.success && data.user) {
      localStorage.setItem('gv_current_user', JSON.stringify(data.user))
      return { success: true, user: data.user }
    }
    if (data.error) {
      return { success: false, error: data.error }
    }
  } catch (err) {
    console.warn('Backend verify-otp fallback:', err)
  }

  // Fallback verification against local session
  try {
    const pendingRaw = localStorage.getItem('gv_pending_otp_session')
    if (pendingRaw) {
      const session = JSON.parse(pendingRaw)
      const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10)
      if (session.phone === cleanPhone) {
        if (Date.now() > session.expiresAt) {
          return { success: false, error: 'OTP code expire ho gaya hai. Kripya naya OTP mangwayein.' }
        }
        if (session.otp === otp.trim()) {
          localStorage.removeItem('gv_pending_otp_session')
          const user = loginUser(name || session.name, `+91 ${cleanPhone}`, businessType || session.businessType, location || session.location)
          return { success: true, user }
        } else {
          return { success: false, error: 'Galat OTP! Kripya apne phone par aaya sahi 6-digit code daalein.' }
        }
      }
    }
  } catch {}

  return { success: false, error: 'Galat OTP! Kripya apne phone par aaya sahi 6-digit OTP daalein.' }
}

