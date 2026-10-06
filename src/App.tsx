import { useState, useEffect, useRef, type CSSProperties } from 'react'
import {
  saveVoiceChat,
  getVoiceHistory,
  createMentorBooking,
  getMentorBookings,
  toggleSaveScheme,
  getSavedSchemes,
  isSupabaseConfigured,
  type VoiceChatRecord,
  type MentorBookingRecord,
  type SavedSchemeRecord
} from './lib/supabase'

type Page = 'landing' | 'voice' | 'schemes' | 'ideas' | 'mentor' | 'dashboard' | 'about'

type IconProps = {
  size?: number
  className?: string
  style?: CSSProperties
}

// ── Icons ────────────────────────────────────────────────────────────────────
const MicIcon = ({ size = 24, className = '', style = {} }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
    <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const SparklesIcon = ({ size = 20, className = '', style = {} }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 17L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="currentColor" />
  </svg>
)

const ChevronRight = ({ size = 16, className = '', style = {} }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CheckIcon = ({ size = 16, className = '', style = {} }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SearchIcon = ({ size = 18, className = '', style = {} }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const ArrowRight = ({ size = 16, className = '', style = {} }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const VolumeIcon = ({ size = 16, className = '', style = {} }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ current, navigate }: { current: Page; navigate: (p: Page) => void }) {
  const [open, setOpen] = useState(false)

  const links: { label: string; page: Page }[] = [
    { label: 'Voice Assistant', page: 'voice' },
    { label: 'Gov. Schemes', page: 'schemes' },
    { label: 'Business Ideas', page: 'ideas' },
    { label: 'Find Mentor', page: 'mentor' },
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'About', page: 'about' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(226,232,240,0.8)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate('landing')} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center">
            <MicIcon size={16} className="text-white" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight" style={{ color: '#0d1117' }}>
            Gram<span className="gradient-text">Voice</span> AI
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button
              key={l.page}
              onClick={() => navigate(l.page)}
              className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
              style={{
                color: current === l.page ? '#1a6fff' : '#3d4755',
                background: current === l.page ? '#e8f0ff' : 'transparent',
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('voice')} className="hidden sm:block px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-btn cursor-pointer transition-all hover:scale-105">
            Voice Assistant
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg cursor-pointer" style={{ color: '#3d4755' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1" style={{ borderTop: '1px solid #e2e8f0' }}>
          {links.map(l => (
            <button
              key={l.page}
              onClick={() => { navigate(l.page); setOpen(false) }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
              style={{ color: current === l.page ? '#1a6fff' : '#3d4755', background: current === l.page ? '#e8f0ff' : 'transparent' }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

// ── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ navigate }: { navigate: (p: Page) => void }) {
  const features = [
    { icon: '🧭', title: 'Business Guide', desc: 'Step-by-step guidance to register and launch your business in your language.', color: '#e8f0ff', accent: '#1a6fff', page: 'voice' as Page },
    { icon: '🏛️', title: 'Government Schemes', desc: 'Discover subsidies, grants, and schemes tailored for rural entrepreneurs.', color: '#d1fae5', accent: '#10b981', page: 'schemes' as Page },
    { icon: '🤝', title: 'Business Mentor', desc: 'Connect with experienced mentors across industries for real guidance.', color: '#fef3c7', accent: '#f59e0b', page: 'mentor' as Page },
    { icon: '📣', title: 'Marketing Tips', desc: 'Learn how to reach more customers with simple digital and offline tactics.', color: '#fce7f3', accent: '#ec4899', page: 'voice' as Page },
    { icon: '💳', title: 'Loan Assistance', desc: 'Find the right microfinance or bank loan options for your business stage.', color: '#ede9fe', accent: '#8b5cf6', page: 'schemes' as Page },
    { icon: '🌐', title: 'Multilingual Support', desc: 'Speak in Hindi, Tamil, Marathi, Telugu or English — we understand all.', color: '#e0f2fe', accent: '#0ea5e9', page: 'voice' as Page },
  ]

  const steps = [
    { icon: '🎙️', label: 'Voice Input', desc: 'Ask your question in any language' },
    { icon: '📚', label: 'Knowledge Base', desc: 'Searched across 10,000+ verified sources' },
    { icon: '🤖', label: 'GramVoice AI Engine', desc: 'Processed and simplified by Indian Business AI' },
    { icon: '🔊', label: 'Voice Response', desc: 'Answered in your preferred language' },
  ]

  const stats = [
    { value: '2.4L+', label: 'Entrepreneurs Helped' },
    { value: '18', label: 'Languages Supported' },
    { value: '500+', label: 'Govt. Schemes Indexed' },
    { value: '98%', label: 'Satisfaction Rate' },
  ]

  return (
    <div style={{ background: '#fff' }}>
      {/* Hero */}
      <section className="pt-36 pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* bg blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)' }} />
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #a7f3d0 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: '#e8f0ff', color: '#1a6fff', border: '1px solid #bfdbfe' }}>
                <SparklesIcon size={13} /> Official Rural Business AI Platform
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.07] tracking-tight mb-6"
                style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
                GramVoice
                <br />
                <span className="gradient-text italic">AI</span>
              </h1>

              <p className="text-2xl sm:text-3xl font-medium mb-4" style={{ color: '#3d4755', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                Your Voice. Your Business. Your Growth.
              </p>

              <p className="text-[17px] leading-relaxed mb-10 max-w-lg" style={{ color: '#7a8799' }}>
                Speak naturally in your language and get simple, actionable business guidance powered by AI — from registration to marketing.
              </p>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('voice')}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-white text-[15px] font-semibold gradient-btn">
                  <MicIcon size={18} /> Start Voice Assistant
                </button>
                <button onClick={() => navigate('about')}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[15px] font-semibold border-2 transition-all hover:bg-gray-50"
                  style={{ color: '#3d4755', borderColor: '#e2e8f0' }}>
                  Learn More <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="fade-up-2 flex justify-center">
              <div className="relative">
                <div className="float w-80 h-80 rounded-3xl shadow-2xl flex items-center justify-center relative"
                  style={{ background: 'linear-gradient(135deg, #e8f0ff 0%, #d1fae5 100%)', border: '1px solid #e2e8f0' }}>
                  {/* Waveform illustration */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg gradient-btn">
                      <MicIcon size={36} className="text-white" />
                    </div>
                    <div className="flex items-end gap-1.5 h-10">
                      {[4,8,14,20,28,20,14,8,4,12,24,16,8].map((h, i) => (
                        <div key={i} className="rounded-full"
                          style={{ width: 6, height: h, background: 'linear-gradient(to top, #1a6fff, #10b981)', opacity: 0.7 + (i % 3) * 0.1 }} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#1a6fff' }}>Listening in Hindi...</span>
                  </div>

                  {/* floating chips */}
                  <div className="absolute -top-4 -left-8 px-3.5 py-2 rounded-xl shadow-lg text-xs font-semibold"
                    style={{ background: '#fff', color: '#10b981', border: '1px solid #d1fae5' }}>
                    ✓ PM Mudra Yojana eligible
                  </div>
                  <div className="absolute -bottom-4 -right-8 px-3.5 py-2 rounded-xl shadow-lg text-xs font-semibold"
                    style={{ background: '#fff', color: '#1a6fff', border: '1px solid #bfdbfe' }}>
                    💡 3 business ideas found
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4" style={{ background: '#f7f9fc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold mb-1 gradient-text">{s.value}</div>
              <div className="text-sm" style={{ color: '#7a8799' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold mb-3 gradient-text uppercase tracking-widest">Everything You Need</div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
              Built for Rural India
            </h2>
            <p className="text-[17px] max-w-xl mx-auto" style={{ color: '#7a8799' }}>
              From registering your first business to scaling it — GramVoice AI guides you through every step.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} onClick={() => navigate(f.page)} className="card-hover p-6 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
                style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: f.color }}>
                  {f.icon}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[16px]" style={{ color: '#0d1117' }}>{f.title}</h3>
                  <span className="text-xs font-semibold" style={{ color: f.accent }}>Explore →</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#7a8799' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6" style={{ background: '#f7f9fc' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-sm font-semibold mb-3 gradient-text uppercase tracking-widest">The Process</div>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
              How It Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={step.label} className="relative">
                <div className="p-6 rounded-2xl text-center" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg, #e8f0ff, #d1fae5)' }}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold mb-2 gradient-text uppercase tracking-widest">Step {i + 1}</div>
                  <h4 className="font-semibold mb-2" style={{ color: '#0d1117' }}>{step.label}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: '#7a8799' }}>{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 items-center justify-center w-6 h-6 rounded-full"
                    style={{ background: '#e8f0ff' }}>
                    <ChevronRight size={12} className="text-blue-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a6fff 0%, #0ea5e9 50%, #10b981 100%)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-4 relative" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Start Speaking. Start Growing.
            </h2>
            <p className="text-white/80 text-lg mb-8 relative">
              Join 2.4 lakh+ rural entrepreneurs already building their businesses with GramVoice AI.
            </p>
            <button onClick={() => navigate('voice')}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-[15px] font-semibold transition-all hover:scale-105"
              style={{ background: '#fff', color: '#1a6fff' }}>
              <MicIcon size={18} /> Try Voice Assistant Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  )
}

// ── Voice Assistant Page ─────────────────────────────────────────────────────
type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking'

function VoiceAssistantPage({ navigate }: { navigate: (page: Page) => void }) {
  const [state, setState] = useState<VoiceState>('idle')
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN'>('hi-IN')
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'ai', text: 'नमस्ते! मैं ग्रामवॉइस एआई हूँ। बिजनेस रजिस्ट्रेशन, सरकारी योजनाएं, लोन, या मार्केटिंग — कुछ भी पूछिए। माइक टैप करके बोलें या टाइप करें! 🎤' },
  ])
  const [inputText, setInputText] = useState('')
  const [keyError, setKeyError] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<any>(null)
  const latestTranscriptRef = useRef<string>('')
  const isSpeakingCancelledRef = useRef<boolean>(false)

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
    }, 100)
  }

  const stopSpeaking = () => {
    isSpeakingCancelledRef.current = true
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
      } catch {}
    }
    setState('idle')
  }

  const handleLanguageChange = (lang: 'hi-IN' | 'en-IN') => {
    setVoiceLang(lang)
    stopSpeaking()
    if (lang === 'hi-IN') {
      setMessages([
        { role: 'ai', text: 'नमस्ते! मैं ग्रामवॉइस एआई हूँ। बिजनेस रजिस्ट्रेशन, सरकारी योजनाएं, लोन, या मार्केटिंग — कुछ भी पूछिए। माइक टैप करके बोलें या टाइप करें! 🎤' },
      ])
    } else {
      setMessages([
        { role: 'ai', text: 'Hello! I am GramVoice AI, your business mentor. Ask me about government schemes, loans, business registration, or marketing. Tap the mic to speak or type your question! 🎤' },
      ])
    }
  }

  useEffect(() => {
    // Automatically wake up Render backend as soon as user opens the page
    const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
    fetch(`${API_BASE_URL}/api/health`).catch(() => {})

    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }
  }, [])

  // ── Male Voice Selector & Tuner Helper ──────────────────────────────────────
  const getBestMaleVoice = (voices: SpeechSynthesisVoice[], isHindi: boolean) => {
    const femaleExclude = [
      'lekha', 'neerja', 'kalpana', 'sangeeta', 'heera', 'zira', 'samantha',
      'karen', 'victoria', 'veena', 'aditi', 'swara', 'priya', 'pooja',
      'female', 'woman', 'girl', 'catherine', 'helena', 'moira', 'tessa', 'fiona',
      'hazel', 'susan', 'allison', 'ava', 'kate', 'serena', 'agnes', 'kathy', 'vicki',
      'princess', 'ting-ting', 'kyoko', 'sin-ji', 'yuna', 'miren',
      'x-hia', 'x-hid', 'x-hif', 'ananya', 'shruti', 'kavya', 'deepa', 'pallavi',
      'alva', 'klara', 'monica', 'amira', 'nora', 'sara', 'damayanti', 'yuri'
    ]

    const maleKeywords = [
      'hemant', 'neel', 'rishi', 'ravi', 'madhav', 'prabhat', 'david', 'mark',
      'alex', 'guy', 'daniel', 'george', 'arthur', 'oliver', 'fred', 'tom',
      'male', 'man', 'boy', 'deep', 'tarun', 'hi-in-x-hie', 'hi-in-x-hic',
      'en-in-x-ene', 'en-in-x-end', 'en-us-x-sfg', 'en-us-x-iob'
    ]

    if (isHindi) {
      // 1. Direct Male Hindi Voice matches
      const maleHindi = voices.find(v =>
        (v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) &&
        maleKeywords.some(m => v.name.toLowerCase().includes(m))
      )
      if (maleHindi) return maleHindi

      // 2. Hindi voice that is not in the female exclude list
      const neutralHindi = voices.find(v =>
        (v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) &&
        !femaleExclude.some(f => v.name.toLowerCase().includes(f))
      )
      if (neutralHindi) return neutralHindi

      // 3. Indian English male voice (like Rishi/Neel)
      const indianMale = voices.find(v =>
        (v.lang.includes('IN') || v.name.toLowerCase().includes('india')) &&
        maleKeywords.some(m => v.name.toLowerCase().includes(m)) &&
        !femaleExclude.some(f => v.name.toLowerCase().includes(f))
      )
      if (indianMale) return indianMale

      // 4. Any Hindi voice fallback (pitch will be lowered to masculine tone)
      return voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'))
    } else {
      // 1. Indian English Male
      const maleIndianEn = voices.find(v =>
        (v.lang.startsWith('en-IN') || v.name.toLowerCase().includes('india')) &&
        maleKeywords.some(m => v.name.toLowerCase().includes(m)) &&
        !femaleExclude.some(f => v.name.toLowerCase().includes(f))
      )
      if (maleIndianEn) return maleIndianEn

      // 2. Global Male English Voices
      const maleGlobalEn = voices.find(v =>
        v.lang.startsWith('en') &&
        maleKeywords.some(m => v.name.toLowerCase().includes(m)) &&
        !femaleExclude.some(f => v.name.toLowerCase().includes(f))
      )
      if (maleGlobalEn) return maleGlobalEn

      // 3. Non-female English
      const neutralEn = voices.find(v =>
        v.lang.startsWith('en') &&
        !femaleExclude.some(f => v.name.toLowerCase().includes(f))
      )
      if (neutralEn) return neutralEn

      return voices.find(v => v.lang.startsWith('en'))
    }
  }

  const speakText = (rawText: string) => {
    if (!('speechSynthesis' in window)) return

    stopSpeaking()
    isSpeakingCancelledRef.current = false

    try {
      window.speechSynthesis.resume()

      const hasDevanagari = /[\u0900-\u097F]/.test(rawText)
      const hindiKeywords = /\b(kaise|kya|kyu|kitna|yojana|sarkari|loan|paise|batao|karein|chahiye|mera|hai|milega|dukan|shuru|rupaye|lakh)\b/i
      const isHindi = hasDevanagari || (voiceLang === 'hi-IN' && hindiKeywords.test(rawText)) || voiceLang === 'hi-IN'

      // Comprehensive voice normalization for clear natural pronunciation
      let cleanText = rawText

      if (isHindi) {
        cleanText = cleanText
          .replace(/₹\s*([0-9,]+)/g, '$1 रुपये ')
          .replace(/\bRs\.?\s*([0-9,]+)/gi, '$1 रुपये ')
          .replace(/%/g, ' प्रतिशत ')
          .replace(/&/g, ' और ')
          .replace(/\//g, ' या ')
          .replace(/\bMSME\b/g, 'एम एस एम ई')
          .replace(/\bGST\b/g, 'जी एस टी')
          .replace(/\bPM\b/g, 'पी एम')
          .replace(/\bFSSAI\b/g, 'एफ एस एस ए आई')
          .replace(/\bPMEGP\b/g, 'पी एम ई जी पी')
      } else {
        cleanText = cleanText
          .replace(/₹\s*([0-9,]+)/g, '$1 Rupees ')
          .replace(/\bRs\.?\s*([0-9,]+)/gi, '$1 Rupees ')
          .replace(/%/g, ' percent ')
          .replace(/&/g, ' and ')
          .replace(/\//g, ' or ')
      }

      cleanText = cleanText
        .replace(/[*#_`~|]/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\bhttps?:\/\/\S+/gi, '')
        .replace(/[•–—]/g, ' ')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim()

      if (!cleanText) return

      // Delay by 80ms for mobile/desktop audio hardware transition
      setTimeout(() => {
        if (isSpeakingCancelledRef.current) return

        try {
          window.speechSynthesis.resume()
          const voices = window.speechSynthesis.getVoices() || []
          const selectedVoice = getBestMaleVoice(voices, isHindi)

          // Check if the selected voice is a female fallback
          const femaleList = [
            'lekha', 'neerja', 'kalpana', 'sangeeta', 'heera', 'zira', 'samantha',
            'karen', 'victoria', 'veena', 'aditi', 'swara', 'priya', 'pooja',
            'female', 'woman', 'girl', 'catherine', 'helena', 'moira', 'tessa', 'fiona'
          ]
          const voiceName = selectedVoice?.name.toLowerCase() || ''
          const isFallbackFemale = femaleList.some(f => voiceName.includes(f))

          // Split into sentences for smooth, stutter-free streaming playback
          const sentences = cleanText.match(/[^।?!.\n]+[।?!.\n]*/g)?.map(s => s.trim()).filter(Boolean) || [cleanText]

          let currentIndex = 0

          const playNextSentence = () => {
            if (isSpeakingCancelledRef.current || currentIndex >= sentences.length) {
              if (!isSpeakingCancelledRef.current) {
                setState('idle')
              }
              return
            }

            const sentence = sentences[currentIndex]
            currentIndex++

            const utter = new SpeechSynthesisUtterance(sentence)

            if (isHindi) {
              utter.lang = 'hi-IN'
              if (selectedVoice) utter.voice = selectedVoice
              // If voice is a female fallback on MacOS/iOS, drop pitch to 0.70 to shift formant to deep male tone
              utter.pitch = isFallbackFemale ? 0.70 : 0.82
              utter.rate = 0.94
            } else {
              utter.lang = 'en-IN'
              if (selectedVoice) utter.voice = selectedVoice
              utter.pitch = isFallbackFemale ? 0.72 : 0.85
              utter.rate = 0.96
            }

            utter.volume = 1.0

            utter.onstart = () => {
              if (isSpeakingCancelledRef.current) {
                try { window.speechSynthesis.cancel() } catch {}
                return
              }
              setState('speaking')
            }
            utter.onend = () => {
              if (!isSpeakingCancelledRef.current) {
                playNextSentence()
              }
            }
            utter.onerror = (e) => {
              if (!isSpeakingCancelledRef.current) {
                console.warn('Utterance error:', e)
                playNextSentence()
              }
            }

            window.speechSynthesis.speak(utter)
          }

          playNextSentence()
        } catch (err) {
          console.warn('SpeechSynthesis playback error:', err)
          setState('idle')
        }
      }, 80)
    } catch (err) {
      console.warn('SpeechSynthesis init failed:', err)
      setState('idle')
    }
  }

  const callGemini = async (question: string) => {
    if (!question.trim()) return

    setState('processing')
    setKeyError('')

    // Auto-detect question language
    const hasDevanagari = /[\u0900-\u097F]/.test(question)
    const hindiKeywords = /\b(kaise|kya|kyu|kitna|yojana|sarkari|loan|paise|batao|karein|chahiye|mera|hai|milega|dukan|shuru)\b/i
    const isHindiQuery = hasDevanagari || hindiKeywords.test(question) || voiceLang === 'hi-IN'
    const targetLang = isHindiQuery ? 'hi-IN' : 'en-IN'

    const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          language: targetLang,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI request failed')
      }

      const answer =
        data.reply ||
        data.response ||
        (targetLang === 'hi-IN'
          ? 'माफ़ कीजिए, उत्तर प्राप्त नहीं हुआ। कृपया दोबारा पूछें।'
          : 'Sorry, could not fetch response. Please try asking again.')

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: answer,
        },
      ])

      scrollToBottom()
      speakText(answer)

      // Persist in Supabase Database / Local sync
      saveVoiceChat(question, answer, targetLang).catch(() => {})

    } catch (error: any) {
      console.error('GramVoice AI Error:', error)

      const fallbackText = targetLang === 'hi-IN'
        ? 'सर्वर कनेक्ट हो रहा है (Render cold start)। कृपया 10-15 सेकंड इंतज़ार करके दोबारा पूछें!'
        : 'Server is connecting (Render cold start). Please wait 10-15 seconds and try again!'

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: fallbackText,
        },
      ])

      setKeyError(
        targetLang === 'hi-IN'
          ? 'सर्वर वेक अप हो रहा है। कृपया दोबारा ट्राई करें।'
          : 'Server is waking up. Please try again in a few seconds.'
      )

      setState('idle')
      scrollToBottom()
    }
  }

  const submitVoiceQuery = (textToSubmit?: string) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    try {
      recognitionRef.current?.stop()
    } catch {}

    const q = (textToSubmit || latestTranscriptRef.current || inputText).trim()
    if (q) {
      latestTranscriptRef.current = ''
      setInputText('')
      setMessages(prev => [...prev, { role: 'user', text: q }])
      scrollToBottom()
      callGemini(q)
    } else {
      setState('idle')
    }
  }

  useEffect(() => {
    const pending = localStorage.getItem('gv_pending_prompt')
    if (pending) {
      localStorage.removeItem('gv_pending_prompt')
      setTimeout(() => {
        submitVoiceQuery(pending)
      }, 400)
    }
  }, [])

  const handleMicClick = async () => {
    if (state === 'speaking') {
      stopSpeaking()
      return
    }

    // If already listening, tapping the mic finishes speaking and sends immediately!
    if (state === 'listening') {
      submitVoiceQuery()
      return
    }

    if (state === 'processing') {
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setKeyError('Voice input is not supported in this browser. Please type your question.')
      return
    }

    // Warm up and prime audio output on touch gesture for mobile browsers
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
        window.speechSynthesis.resume()
        const warmup = new SpeechSynthesisUtterance('')
        warmup.volume = 0
        window.speechSynthesis.speak(warmup)
      } catch {}
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = voiceLang
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    latestTranscriptRef.current = ''

    recognition.onstart = () => {
      setState('listening')
      setKeyError('')
    }

    recognition.onresult = (event: any) => {
      let finalStr = ''
      let interimStr = ''
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalStr += result[0].transcript + ' '
        } else {
          interimStr += result[0].transcript
        }
      }
      const full = (finalStr + interimStr).trim()
      if (full) {
        latestTranscriptRef.current = full
        setInputText(full)
      }

      // Auto-submit after 1.2s of silence when user finishes speaking
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        submitVoiceQuery(latestTranscriptRef.current)
      }, 1200)
    }

    recognition.onerror = (e: any) => {
      console.warn('Recognition error:', e)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

      if (latestTranscriptRef.current.trim()) {
        submitVoiceQuery(latestTranscriptRef.current)
        return
      }

      setState('idle')
      if (e.error === 'not-allowed') {
        setKeyError(voiceLang === 'hi-IN' ? 'माइक परमिशन ब्लॉक है। ब्राउज़र सेटिंग्स में जाकर माइक्रोफोन अलाउ करें।' : 'Microphone permission blocked. Please allow mic in browser settings.')
      } else if (e.error === 'no-speech') {
        setKeyError(voiceLang === 'hi-IN' ? 'आवाज़ डिटेक्ट नहीं हुई। कृपया दोबारा माइक टैप करके बोलें।' : 'No speech detected. Please tap mic and speak again.')
      } else {
        setKeyError(voiceLang === 'hi-IN' ? 'आवाज़ डिटेक्ट करने में दिक्कत आई। कृपया दोबारा बोलें या टाइप करें।' : 'Speech detection issue. Please speak again or type.')
      }
    }

    recognition.onend = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      if (latestTranscriptRef.current.trim()) {
        submitVoiceQuery(latestTranscriptRef.current)
      } else {
        setState('idle')
      }
    }

    try {
      recognition.start()
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setState('idle')
    }
  }

  const handleTextSend = async () => {
    const q = (inputText || latestTranscriptRef.current).trim()
    if (!q || state === 'processing') return

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    try { recognitionRef.current?.stop() } catch {}

    setInputText('')
    latestTranscriptRef.current = ''
    setMessages(prev => [...prev, { role: 'user', text: q }])
    scrollToBottom()
    await callGemini(q)
  }

  const stateLabel = voiceLang === 'hi-IN'
    ? { idle: 'माइक टैप करके बोलें', listening: 'सुन रहा हूँ...', processing: 'सोच रहा हूँ...', speaking: 'बोल रहा हूँ...' }[state]
    : { idle: 'Tap mic to speak', listening: 'Listening...', processing: 'Thinking...', speaking: 'Speaking...' }[state]

  const stateColor = { idle: '#1a6fff', listening: '#10b981', processing: '#f59e0b', speaking: '#8b5cf6' }[state]

  const suggestionsHindi = [
    'PM Mudra Loan के लिए कैसे अप्लाई करें?',
    'गांव में ₹20,000 में कौन सा बिजनेस शुरू करें?',
    'PMEGP लोन पर 35% सब्सिडी कैसे मिलती है?',
    'MSME Udyam सर्टिफिकेट कैसे बनाएं?',
    'WhatsApp से दुकान का सामान कैसे बेचें?',
  ]

  const suggestionsEnglish = [
    'How to apply for PM Mudra Loan up to ₹10 Lakh?',
    'What are the best low-investment village business ideas?',
    'How to get 35% subsidy under PMEGP scheme?',
    'How to register for MSME Udyam certificate?',
    'How to sell agricultural products online via WhatsApp?',
  ]

  const activeSuggestions = voiceLang === 'hi-IN' ? suggestionsHindi : suggestionsEnglish

  return (
    <div className="min-h-screen pt-16" style={{ background: '#f7f9fc' }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            GramVoice AI Assistant
          </h1>
          <p className="text-sm" style={{ color: '#7a8799' }}>
            {voiceLang === 'hi-IN'
              ? 'हिंदी और इंग्लिश में बोलें — तुरंत सटीक बिजनेस गाइडेंस पाएं'
              : 'Speak in English or Hindi — Get instant expert business guidance'}
          </p>
        </div>

        {/* Status Bar */}
        <div
          className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-2.5 rounded-xl"
          style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }}
        >
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#065f46' }}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            GramVoice AI Live — Smart Voice Assistant
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {voiceLang === 'hi-IN' ? '🇮🇳 हिन्दी मोड' : '🇬🇧 English Mode'}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden flex flex-col"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', height: '62vh' }}
          >
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center">
                  <MicIcon size={15} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#0d1117' }}>GramVoice AI</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs" style={{ color: '#7a8799' }}>
                      {voiceLang === 'hi-IN' ? 'लाइव बिज़नेस मेंटर' : 'Live Business Mentor'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking()
                  setMessages([
                    {
                      role: 'ai',
                      text: voiceLang === 'hi-IN'
                        ? 'नमस्ते! मैं ग्रामवॉइस एआई हूँ। नया सवाल पूछें, हिंदी या इंग्लिश में। 🎤'
                        : 'Hello! I am GramVoice AI. Ask your business question in English or Hindi. 🎤'
                    }
                  ])
                }}
                className="text-xs text-gray-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all font-medium cursor-pointer"
                title="Reset conversation"
              >
                🗑️ Clear Chat
              </button>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className="max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                    style={{
                      background: m.role === 'user' ? 'linear-gradient(135deg, #1a6fff, #0ea5e9)' : '#f7f9fc',
                      color: m.role === 'user' ? '#fff' : '#3d4755',
                      borderRadius: m.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                      border: m.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                    }}
                  >
                    {m.text}
                  </div>
                  {m.role === 'ai' && (
                    <div className="mt-1.5 ml-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (state === 'speaking') {
                            stopSpeaking()
                          } else {
                            speakText(m.text)
                          }
                        }}
                        className="text-[11px] font-medium text-blue-700 bg-blue-50/90 hover:bg-blue-100 border border-blue-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <VolumeIcon size={12} className={state === 'speaking' ? 'text-red-500' : 'text-blue-600'} />
                        <span>{state === 'speaking' ? '⏹️ Rokein (Stop)' : '🔊 Sunein'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(m.text)
                          setCopiedIdx(i)
                          setTimeout(() => setCopiedIdx(null), 1500)
                        }}
                        className="text-[11px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                      >
                        <span>{copiedIdx === i ? '✓ Copied' : '📋 Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {state === 'processing' && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-2xl flex gap-1.5 items-center"
                    style={{ background: '#f7f9fc', border: '1px solid #e2e8f0' }}
                  >
                    {[0, 1, 2].map(i => (
                      <div key={i} className="dot-bounce w-2 h-2 rounded-full" style={{ background: '#1a6fff' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4" style={{ borderTop: '1px solid #e2e8f0' }}>
              <div className="flex items-center gap-2">
                <input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTextSend()}
                  placeholder={voiceLang === 'hi-IN' ? 'अपना सवाल टाइप करें या माइक दबाकर बोलें...' : 'Type your question or tap the mic to speak...'}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f7f9fc', border: '1px solid #e2e8f0', color: '#0d1117' }}
                  disabled={state === 'processing'}
                />
                <button
                  onClick={handleTextSend}
                  disabled={state === 'processing' || !inputText.trim()}
                  className="p-2.5 rounded-xl gradient-btn disabled:opacity-40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ArrowRight size={18} className="text-white" />
                </button>
              </div>
              {keyError && <div className="text-xs mt-2 font-medium" style={{ color: '#ef4444' }}>{keyError}</div>}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div
              className="p-6 rounded-2xl flex flex-col items-center gap-5"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              {/* Language Selection Switch */}
              <div className="w-full">
                <div className="text-xs font-semibold text-gray-500 mb-2 text-center uppercase tracking-wider">
                  Select Speaking Language
                </div>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 border border-gray-200 w-full">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('hi-IN')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      voiceLang === 'hi-IN'
                        ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    🇮🇳 हिन्दी (Hindi)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('en-IN')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      voiceLang === 'en-IN'
                        ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>

              <div className="text-sm font-semibold" style={{ color: stateColor }}>{stateLabel}</div>

              <div className="relative flex items-center justify-center">
                {(state === 'listening' || state === 'speaking') && (
                  <>
                    <div className="mic-ring absolute w-24 h-24 rounded-full border-2" style={{ borderColor: stateColor + '40' }} />
                    <div className="mic-ring-2 absolute w-24 h-24 rounded-full border-2" style={{ borderColor: stateColor + '30' }} />
                    <div className="mic-ring-3 absolute w-24 h-24 rounded-full border-2" style={{ borderColor: stateColor + '20' }} />
                  </>
                )}
                <button
                  onClick={handleMicClick}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all cursor-pointer ${state !== 'idle' ? 'mic-pulse' : 'hover:scale-105'}`}
                  style={{
                    background: `linear-gradient(135deg, ${stateColor}, ${stateColor}cc)`,
                    boxShadow: `0 8px 24px ${stateColor}40`,
                  }}
                >
                  {state === 'processing'
                    ? <div className="flex gap-1">{[0, 1, 2].map(i => <div key={i} className="dot-bounce w-1.5 h-1.5 rounded-full bg-white" />)}</div>
                    : <MicIcon size={30} />}
                </button>
              </div>

              {state === 'listening' && (
                <div className="flex items-center gap-1 h-10">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="wave-bar w-1.5 rounded-full" style={{ background: '#10b981', minHeight: 8 }} />
                  ))}
                </div>
              )}

              <div className="text-xs text-center max-w-[240px] leading-relaxed" style={{ color: '#7a8799' }}>
                {state === 'idle' ? (voiceLang === 'hi-IN' ? 'माइक टैप करें और हिंदी में अपना बिज़नेस सवाल पूछें' : 'Tap mic and ask your business query in English') :
                  state === 'listening' ? '🟢 बोलते रहिए... बोलना रुकते ही ऑटो-सबमिट हो जाएगा या नीचे Send टैप करें' :
                  state === 'processing' ? '⚡ ग्रामवॉइस एआई जवाब तैयार कर रहा है...' : (voiceLang === 'hi-IN' ? '🔊 एआई जवाब सुना रहा है...' : '🔊 AI is speaking...')}
              </div>

              {state === 'listening' && (
                <button
                  type="button"
                  onClick={() => submitVoiceQuery()}
                  className="text-xs px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  ✓ बोल लिया? अभी Send करें
                </button>
              )}

              {state === 'speaking' && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="text-xs px-4 py-2 rounded-xl border-2 font-semibold text-red-600 border-red-300 bg-red-50 hover:bg-red-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
                >
                  ⏹️ आवाज़ रोकें (Stop Audio)
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="text-xs font-semibold mb-3 flex items-center justify-between" style={{ color: '#7a8799' }}>
                <span>QUICK QUESTIONS ({voiceLang === 'hi-IN' ? 'हिन्दी' : 'English'})</span>
              </div>
              <div className="flex flex-col gap-2">
                {activeSuggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setMessages(prev => [...prev, { role: 'user', text: s }])
                      scrollToBottom()
                      callGemini(s)
                    }}
                    disabled={state !== 'idle'}
                    className="text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:bg-blue-50 disabled:opacity-40 cursor-pointer"
                    style={{ color: '#3d4755', border: '1px solid #e2e8f0' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Government Schemes Page ──────────────────────────────────────────────────
function GovernmentSchemesPage({ navigate }: { navigate: (p: Page) => void }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [savedSchemes, setSavedSchemes] = useState<string[]>([])
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [copiedPortal, setCopiedPortal] = useState(false)

  const handleOpenPortal = (url: string) => {
    if (!url) return
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer')
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.assign(url)
      }
    } catch {
      window.location.assign(url)
    }
  }

  useEffect(() => {
    getSavedSchemes().then(list => {
      setSavedSchemes(list.map(s => s.scheme_name || s.scheme_id))
    }).catch(() => {})
  }, [])

  const handleToggleBookmark = async (scheme: any) => {
    const isNowSaved = await toggleSaveScheme(scheme.name, scheme.name, scheme.category)
    if (isNowSaved) {
      setSavedSchemes(prev => [...prev, scheme.name])
      setToastMsg(`★ "${scheme.name}" saved to your Dashboard!`)
    } else {
      setSavedSchemes(prev => prev.filter(name => name !== scheme.name))
      setToastMsg(`Removed "${scheme.name}" from saved schemes`)
    }
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleAskAI = (scheme: any) => {
    localStorage.setItem(
      'gv_pending_prompt',
      `Mujhe ${scheme.name} (${scheme.category}) ke baare mein detail me samjhao — eligibility criteria, required documents, aur online application process step-by-step kaise karein?`
    )
    setSelectedScheme(null)
    navigate('voice')
  }

  const categories = ['All', 'Loans', 'Subsidies', 'Training', 'Women', 'Agriculture']

  const schemes = [
    {
      name: 'PM Mudra Yojana',
      category: 'Loans',
      ministry: 'Ministry of Finance',
      benefit: 'Loans up to ₹10 Lakh (Collateral-Free)',
      eligibility: 'Any non-corporate micro business (Manufacturing, Trading, Services, Artisans)',
      deadline: 'Ongoing',
      badge: '🔥 Popular',
      color: '#e8f0ff',
      accent: '#1a6fff',
      portalUrl: 'https://www.udyamimitra.in/',
      docs: ['Aadhaar Card', 'PAN Card', 'Business Address Proof', 'Last 6 Months Bank Statement', 'Passport Size Photos'],
      steps: [
        'Bank ya NBFC branch me jayein ya official Udyamimitra portal (udyamimitra.in) open karein.',
        'Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), ya Tarun (₹5 Lakh to ₹10 Lakh) category select karein.',
        'Application form bharein aur required KYC & quotation documents attach karein.',
        '7-10 working days ke andar loan amount aapke bank account me sanction ho jayegi.'
      ]
    },
    {
      name: 'Stand Up India',
      category: 'Loans',
      ministry: 'SIDBI',
      benefit: 'Loans ₹10 Lakh to ₹1 Crore',
      eligibility: 'SC/ST & Women entrepreneurs setting up greenfield enterprises (Manufacturing, Services, Trading)',
      deadline: 'Ongoing',
      badge: '✨ New',
      color: '#d1fae5',
      accent: '#10b981',
      portalUrl: 'https://www.standupmitra.in/',
      docs: ['Identity & Caste/Gender Certificate', 'Project Report & Business Plan', 'Pollution Control NOC (if applicable)', 'Bank Statement (6 months)'],
      steps: [
        'Stand Up India official portal (standupmitra.in) par register karein.',
        'Handholding agency ya nearest bank branch select karein.',
        'Project report aur quotations submit karein.',
        'Bank verification ke baad loan sanction hoga at lowest concessional interest rates.'
      ]
    },
    {
      name: 'Startup India Seed Fund',
      category: 'Subsidies',
      ministry: 'DPIIT',
      benefit: 'Up to ₹20 Lakh Grant + ₹50 Lakh Debt Support',
      eligibility: 'DPIIT-recognized startups incorporated within 2 years with proof of concept',
      deadline: 'Dec 2025',
      badge: null,
      color: '#fef3c7',
      accent: '#f59e0b',
      portalUrl: 'https://www.startupindia.gov.in/content/sih/en/government-schemes/startup-india-seed-fund-scheme.html',
      docs: ['DPIIT Recognition Certificate', 'Pitch Deck & Proof of Concept', 'Incorporation Certificate', 'Founders KYC & PAN'],
      steps: [
        'Startup India official portal par login / register karein.',
        'Seed Fund Scheme section me online application submit karein.',
        'Approved incubator choose karein jo aapka evaluation karega.',
        'Presentation / pitch evaluation ke baad milestone-based funds direct transfer honge.'
      ]
    },
    {
      name: 'PM Vishwakarma Yojana',
      category: 'Training',
      ministry: 'MSME Ministry',
      benefit: 'Free skill training + ₹15,000 toolkit voucher + ₹3 Lakh collateral-free loan at 5%',
      eligibility: 'Traditional artisans & craftspeople (18 trades including Carpenters, Blacksmiths, Tailors, Cobblers, Potters, Masons)',
      deadline: 'Ongoing',
      badge: '🏆 Top Rated',
      color: '#ede9fe',
      accent: '#8b5cf6',
      portalUrl: 'https://pmvishwakarma.gov.in/',
      docs: ['Aadhaar Card', 'Ration Card', 'Mobile linked to Aadhaar', 'Bank Account details / Passbook'],
      steps: [
        'Nearest CSC (Common Service Center) par jakar biometric e-KYC registration karein.',
        'Gram Panchayat / Urban Local Body verification complete hoga.',
        '5-7 days basic skill training milegi with ₹500/day stipend.',
        '₹15,000 toolkit e-voucher aur ₹1 Lakh (Tranche 1) loan 5% subsidized rate par mil jayega.'
      ]
    },
    {
      name: 'Mahila Udyam Nidhi',
      category: 'Women',
      ministry: 'SIDBI',
      benefit: 'Soft loans up to ₹10 Lakh with 10 years repayment period',
      eligibility: 'Women-led small scale enterprises with min 51% financial holding/ownership',
      deadline: 'Ongoing',
      badge: '👩‍💼 Women Only',
      color: '#fce7f3',
      accent: '#ec4899',
      portalUrl: 'https://www.sidbi.in/',
      docs: ['Women Ownership Proof (51%+)', 'Identity & Address Proof', 'Project Feasibility Report', 'Trade License / MSME Udyam'],
      steps: [
        'State Financial Corporation (SFC) ya partner public sector bank branch visit karein.',
        'Mahila Udyam Nidhi soft loan application form fill karein.',
        'Project cost assessment ke baad 10 years repayment schedule ke sath seed capital release hoga.'
      ]
    },
    {
      name: 'PMEGP Scheme',
      category: 'Subsidies',
      ministry: 'KVIC / MSME',
      benefit: '15% to 35% capital subsidy on project cost up to ₹50 Lakh',
      eligibility: '18+ years, minimum 8th pass for projects over ₹10L in manufacturing / ₹5L in services',
      deadline: 'Ongoing',
      badge: null,
      color: '#e0f2fe',
      accent: '#0ea5e9',
      portalUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
      docs: ['Educational Qualification Certificate', 'Project Report (DPR)', 'Rural Area Certificate', 'Special Category Certificate (if applicable)'],
      steps: [
        'KVIC online portal (kviconline.gov.in) par PMEGP e-Portal form bharein.',
        'Detailed Project Report (DPR) aur KYC documents upload karein.',
        'District Task Force Committee (DLTFC) application review aur sanction karegi.',
        'Sanction ke baad EDP online training complete karke margin money subsidy bank me transfer hogi.'
      ]
    },
    {
      name: 'Agri Infrastructure Fund',
      category: 'Agriculture',
      ministry: 'Agriculture Ministry',
      benefit: 'Loans up to ₹2 Crore with 3% annual interest subvention',
      eligibility: 'Farmers, Agri-entrepreneurs, FPOs, Startups & Self Help Groups for post-harvest management',
      deadline: 'Ongoing',
      badge: '🌾 New',
      color: '#d1fae5',
      accent: '#10b981',
      portalUrl: 'https://agriinfra.dac.gov.in/',
      docs: ['Land records / Lease agreement', 'DPR for post-harvest / cold chain infra', 'Aadhaar & PAN', 'Bank Statement'],
      steps: [
        'Agri Infra portal (agriinfra.dac.gov.in) par beneficiary registration karein.',
        'Detailed project report (cold store, warehouse, primary processing) upload karein.',
        'Participating bank loan approve karega with CGTMSE credit guarantee aur 3% interest discount milega.'
      ]
    },
    {
      name: 'ASPIRE Scheme',
      category: 'Training',
      ministry: 'MSME Ministry',
      benefit: 'Technology incubation & up to ₹1 Crore for Livelihood Business Incubators (LBI)',
      eligibility: 'Rural entrepreneurs, agro-based startups & technical innovators',
      deadline: 'Ongoing',
      badge: null,
      color: '#e8f0ff',
      accent: '#1a6fff',
      portalUrl: 'https://aspire.msme.gov.in/',
      docs: ['Incubation proposal', 'Institutional affiliation / NGO registration', 'PAN & GST'],
      steps: [
        'MSME ASPIRE portal par LBI/TBI proposal submit karein.',
        'Ministry screening committee proposal approve karegi.',
        'Incubation centre me free technology training, modern machinery access aur funding provide ki jayegi.'
      ]
    },
  ]

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser. Please type to search.')
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = 'hi-IN'
    rec.onstart = () => setIsListening(true)
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setSearch(text)
      setIsListening(false)
    }
    rec.onerror = () => setIsListening(false)
    rec.onend = () => setIsListening(false)
    rec.start()
  }

  const filtered = schemes.filter(s =>
    (activeCategory === 'All' || s.category === activeCategory) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.benefit.toLowerCase().includes(search.toLowerCase()) ||
      s.eligibility.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen pt-16 relative" style={{ background: '#f7f9fc' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Government Schemes & Subsidies
          </h1>
          <p className="text-sm" style={{ color: '#7a8799' }}>
            Discover verified government schemes, loans, and capital subsidies with official application portals for Indian entrepreneurs
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#7a8799' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search schemes (e.g., Mudra Loan, PMEGP, Vishwakarma, Subsidy, Women)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none shadow-xs"
              style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#0d1117' }}
            />
          </div>
          <button
            onClick={handleVoiceSearch}
            className={`px-5 py-3 rounded-xl text-sm font-semibold text-white gradient-btn whitespace-nowrap cursor-pointer transition-all flex items-center justify-center gap-2 ${isListening ? 'animate-pulse ring-2 ring-emerald-400' : 'hover:scale-105'}`}
          >
            <MicIcon size={16} />
            {isListening ? 'Listening...' : 'Voice Search'}
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{
                background: activeCategory === c ? '#1a6fff' : '#fff',
                color: activeCategory === c ? '#fff' : '#3d4755',
                border: `1px solid ${activeCategory === c ? '#1a6fff' : '#e2e8f0'}`,
                boxShadow: activeCategory === c ? '0 4px 12px rgba(26,111,255,0.2)' : 'none',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Schemes grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => {
            const isBookmarked = savedSchemes.includes(s.name)
            return (
              <div
                key={s.name}
                className="card-hover p-6 rounded-2xl flex flex-col justify-between"
                style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: s.color }}>
                      🏛️
                    </div>
                    <div className="flex items-center gap-1.5">
                      {s.badge && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: s.color, color: s.accent }}>
                          {s.badge}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleBookmark(s) }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isBookmarked ? 'bg-amber-50 border-amber-300 text-amber-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-amber-500'}`}
                        title={isBookmarked ? 'Saved in Dashboard' : 'Bookmark Scheme'}
                      >
                        <span className="text-sm leading-none">{isBookmarked ? '★' : '☆'}</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-[16px] mb-1" style={{ color: '#0d1117' }}>{s.name}</h3>
                  <p className="text-xs mb-4" style={{ color: '#7a8799' }}>{s.ministry}</p>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold w-20 shrink-0" style={{ color: '#7a8799' }}>Benefit</span>
                      <span className="text-xs font-bold" style={{ color: s.accent }}>{s.benefit}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold w-20 shrink-0" style={{ color: '#7a8799' }}>Eligible</span>
                      <span className="text-xs leading-relaxed" style={{ color: '#3d4755' }}>{s.eligibility}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold w-20 shrink-0" style={{ color: '#7a8799' }}>Deadline</span>
                      <span className="text-xs font-medium" style={{ color: '#10b981' }}>{s.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setSelectedScheme(s)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn cursor-pointer transition-all hover:scale-102"
                  >
                    View Details & Apply
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenPortal(s.portalUrl)
                    }}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer hover:bg-emerald-50 text-emerald-700 border-emerald-300 bg-emerald-50/50 transition-all flex items-center gap-1.5 shadow-xs"
                    title={`Open ${s.name} official portal`}
                  >
                    <span>🌐</span> Portal ↗
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scheme Details & Application Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md mb-2 inline-block" style={{ background: selectedScheme.color, color: selectedScheme.accent }}>
                  {selectedScheme.category}
                </span>
                <h2 className="text-2xl font-bold" style={{ color: '#0d1117' }}>{selectedScheme.name}</h2>
                <p className="text-xs text-gray-500">{selectedScheme.ministry}</p>
              </div>
              <button onClick={() => setSelectedScheme(null)} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-blue-900 mb-0.5">Financial Benefit / Grant</div>
                <div className="text-base font-bold text-blue-600">{selectedScheme.benefit}</div>
              </div>
              <button
                onClick={() => handleToggleBookmark(selectedScheme)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${savedSchemes.includes(selectedScheme.name) ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-100'}`}
              >
                {savedSchemes.includes(selectedScheme.name) ? '★ Saved' : '☆ Bookmark'}
              </button>
            </div>

            <div className="space-y-4 mb-6 text-xs text-gray-700">
              <div>
                <div className="font-bold text-gray-900 mb-1">📋 Eligibility Criteria:</div>
                <p className="leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedScheme.eligibility}</p>
              </div>

              <div>
                <div className="font-bold text-gray-900 mb-1">📄 Required Documents:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedScheme.docs?.map((d: string) => (
                    <span key={d} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 font-medium">
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-900 mb-1">🚀 Step-by-Step Application Process:</div>
                <div className="space-y-2">
                  {selectedScheme.steps?.map((st: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">{i + 1}</span>
                      <span className="leading-relaxed">{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleOpenPortal(selectedScheme.portalUrl)}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span className="text-base">🌐</span> Open Official Government Portal to Apply ↗
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedScheme.portalUrl)
                  setCopiedPortal(true)
                  setTimeout(() => setCopiedPortal(false), 2000)
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{copiedPortal ? '✓ Portal Link Copied to Clipboard!' : `📋 Copy Official Portal Link (${selectedScheme.portalUrl})`}</span>
              </button>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleAskAI(selectedScheme)}
                  className="flex-1 py-3 rounded-xl text-xs font-semibold text-white gradient-btn cursor-pointer flex items-center justify-center gap-2"
                >
                  <MicIcon size={15} />
                  Ask AI to Guide Application
                </button>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="px-5 py-3 rounded-xl text-xs font-medium border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Business Ideas Page ──────────────────────────────────────────────────────
function BusinessIdeasPage({ navigate }: { navigate: (p: Page) => void }) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedIdea, setSelectedIdea] = useState<any | null>(null)

  const filters = ['All', 'Low Investment', 'Agriculture', 'Services', 'Manufacturing', 'Digital']

  const ideas = [
    {
      title: 'Organic Fertilizer & Vermicompost',
      category: 'Agriculture',
      investment: '₹20,000–50,000',
      profit: '₹25,000/month',
      difficulty: 'Easy',
      time: '1–2 months',
      icon: '🌱',
      tag: 'Low Investment',
      desc: 'Convert agricultural waste and cow dung into high-grade vermicompost. High demand from local farmers, fruit orchards, and urban plant nurseries.',
      equipment: ['HDPE Vermibeds (3-4 units)', 'Eisenia Fetida earthworms culture', 'Sieving machine & 25kg/50kg packaging bags', 'Moisture meter & water sprinkler'],
      subsidy: 'PM Krishi Sinchayee Yojana & State Agriculture Department Subsidy (up to 40% capital grant under PKVY).'
    },
    {
      title: 'Smartphone Repair & Digital Accessories',
      category: 'Services',
      investment: '₹15,000–35,000',
      profit: '₹30,000/month',
      difficulty: 'Medium',
      time: '1 month',
      icon: '📱',
      tag: 'Quick Start',
      desc: 'Repair smartphones, display replacement, software updates, and retail daily accessories. Excellent profit margins on tempered glass, chargers, and earbuds.',
      equipment: ['SMD rework station & digital soldering kit', 'Digital multimeter & LCD screen separator', 'Universal phone repair toolkit', 'Fast-moving accessories stock'],
      subsidy: 'PM Vishwakarma / Skill India free training + ₹15,000 toolkit e-voucher & PM Mudra Shishu loan.'
    },
    {
      title: 'Agri-Tourism & Rural Homestay',
      category: 'Agriculture',
      investment: '₹50,000–2L',
      profit: '₹45,000/month',
      difficulty: 'Medium',
      time: '2 months',
      icon: '🏡',
      tag: 'High Profit',
      desc: 'Convert farm space or village home into a weekend tourism destination. Offer traditional organic meals, pottery, nature walks, and fresh farm harvests.',
      equipment: ['Clean guest rooms / tent setups', 'Village organic dining area & earthen cookware', 'Farm activity equipment & solar lights'],
      subsidy: 'State Tourism Board Rural Homestay Scheme (up to ₹2 Lakh subsidy + GST exemptions).'
    },
    {
      title: 'Digital Seva & CSC Kendra',
      category: 'Digital',
      investment: '₹30,000–75,000',
      profit: '₹22,000/month',
      difficulty: 'Easy',
      time: '15 days',
      icon: '💻',
      tag: 'Trending',
      desc: 'Provide government services (Aadhaar, PAN, Ayushman, PM Kisan, Ration Card), AePS cash withdrawal, bill payments, and student form filling.',
      equipment: ['Desktop Computer or Laptop (i3 / 8GB)', 'All-in-one printer, scanner & copier', 'Biometric fingerprint scanner (Morpho/Mantra)', 'Reliable 4G/5G Wi-Fi router'],
      subsidy: 'CSC (Common Service Center) VLE license with zero royalty fees & bank CSP commissions.'
    },
    {
      title: 'Artisanal Pickles & Food Processing',
      category: 'Manufacturing',
      investment: '₹10,000–25,000',
      profit: '₹18,000/month',
      difficulty: 'Easy',
      time: '1 month',
      icon: '🫙',
      tag: 'Low Investment',
      desc: 'Traditional homemade pickles (mango, lemon, chili), papad, and roasted snacks. High retail demand across weekly haats, kirana shops, and WhatsApp orders.',
      equipment: ['Food-grade stainless steel vessels & slicers', 'Heat band sealing machine', 'FSSAI compliant packaging jars & label pouches', 'FSSAI basic registration'],
      subsidy: 'PM Formalisation of Micro Food Processing Enterprises (PMFME) - 35% capital subsidy + seed capital.'
    },
    {
      title: 'Custom Boutique & Garment Stitching',
      category: 'Services',
      investment: '₹15,000–45,000',
      profit: '₹20,000/month',
      difficulty: 'Easy',
      time: '1 month',
      icon: '🧵',
      tag: 'Women Friendly',
      desc: 'Custom stitching of blouses, suits, school uniforms, and designer festive clothing. Strong recurring income with embroidery and tailoring alterations.',
      equipment: ['Heavy-duty motorized sewing machine', '3-thread interlock machine', 'Steam iron & cutting table', 'Measuring tools, scissors & thread inventory'],
      subsidy: 'Mahila Udyam Nidhi & PM Mudra Shishu loan (up to ₹50,000 collateral-free at low interest rates).'
    },
  ]

  const handleLaunchWithAI = (idea: any) => {
    localStorage.setItem(
      'gv_pending_prompt',
      `Mujhe "${idea.title}" (${idea.category}) business shuru karna hai. Mera budget ${idea.investment} hai. Kripya mujhe step-by-step launch roadmap, equipment purchase guide, local marketing strategy, aur relevant government subsidy ke baare me complete guidance de!`
    )
    setSelectedIdea(null)
    navigate('voice')
  }

  const filtered = ideas.filter(i => {
    const matchesFilter = activeFilter === 'All' || i.tag.includes(activeFilter) || i.category === activeFilter
    const matchesSearch = !search ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.desc.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.equipment.some((eq: string) => eq.toLowerCase().includes(search.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const difficultyColor = (d: string) => d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : '#ef4444'

  return (
    <div className="min-h-screen pt-16" style={{ background: '#f7f9fc' }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Rural Business Opportunities
          </h1>
          <p className="text-sm" style={{ color: '#7a8799' }}>Curated business ideas matched to your investment capacity, location, and skills</p>
        </div>

        {/* AI matcher banner */}
        <div
          className="p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #1a6fff, #0ea5e9)', boxShadow: '0 8px 30px rgba(26,111,255,0.25)' }}
        >
          <div>
            <div className="text-white font-semibold text-lg mb-1">Get AI-Matched Business Ideas</div>
            <div className="text-white/80 text-sm">Tell us your budget, location & skills — GramVoice AI will create your custom roadmap!</div>
          </div>
          <button
            onClick={() => {
              localStorage.setItem('gv_pending_prompt', 'Mujhe mere budget aur gaon ke hisab se top 3 best business ideas suggest karo jo turant shuru ho sakein.')
              navigate('voice')
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all hover:scale-105 cursor-pointer shadow-lg"
            style={{ background: '#fff', color: '#1a6fff' }}
          >
            <MicIcon size={16} /> Ask GramVoice AI
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#7a8799' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search business ideas by keyword (e.g. fertilizer, mobile, stitching, homestay, food)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none shadow-xs"
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#0d1117' }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{
                background: activeFilter === f ? '#0d1117' : '#fff',
                color: activeFilter === f ? '#fff' : '#3d4755',
                border: `1px solid ${activeFilter === f ? '#0d1117' : '#e2e8f0'}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Ideas Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(idea => (
            <div
              key={idea.title}
              className="card-hover rounded-2xl overflow-hidden flex flex-col justify-between"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{idea.icon}</div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: '#e8f0ff', color: '#1a6fff' }}>
                    {idea.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-[16px] mb-2" style={{ color: '#0d1117' }}>{idea.title}</h3>
                <p className="text-xs leading-relaxed mb-5" style={{ color: '#7a8799' }}>{idea.desc}</p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 rounded-xl" style={{ background: '#f7f9fc' }}>
                    <div className="text-[11px] mb-0.5 font-medium" style={{ color: '#7a8799' }}>Investment</div>
                    <div className="text-xs font-bold" style={{ color: '#0d1117' }}>{idea.investment}</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: '#d1fae5' }}>
                    <div className="text-[11px] mb-0.5 font-medium" style={{ color: '#059669' }}>Avg. Profit</div>
                    <div className="text-xs font-bold" style={{ color: '#059669' }}>{idea.profit}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: difficultyColor(idea.difficulty) }} />
                    <span className="text-xs font-semibold" style={{ color: difficultyColor(idea.difficulty) }}>{idea.difficulty}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#7a8799' }}>⏱ {idea.time} to start</span>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={() => setSelectedIdea(idea)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn cursor-pointer transition-all hover:scale-102"
                >
                  Explore Complete Business Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Idea Plan Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedIdea.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#0d1117' }}>{selectedIdea.title}</h2>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{selectedIdea.category}</span>
                </div>
              </div>
              <button onClick={() => setSelectedIdea(null)} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-5 leading-relaxed bg-gray-50 p-3.5 rounded-xl">{selectedIdea.desc}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="text-[11px] font-semibold text-blue-700 mb-0.5">Required Capital</div>
                <div className="text-sm font-bold text-blue-900">{selectedIdea.investment}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="text-[11px] font-semibold text-emerald-700 mb-0.5">Expected Income</div>
                <div className="text-sm font-bold text-emerald-900">{selectedIdea.profit}</div>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-xs text-gray-700">
              <div>
                <div className="font-bold text-gray-900 mb-1">🛠️ Necessary Equipment & Tools:</div>
                <div className="space-y-1.5">
                  {selectedIdea.equipment?.map((eq: string) => (
                    <div key={eq} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span>{eq}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-900 mb-1">🏛️ Applicable Government Schemes & Subsidies:</div>
                <p className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/70 leading-relaxed font-medium">
                  {selectedIdea.subsidy}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => handleLaunchWithAI(selectedIdea)}
                className="flex-1 py-3 rounded-xl text-xs font-semibold text-white gradient-btn cursor-pointer flex items-center justify-center gap-2"
              >
                <MicIcon size={15} />
                Generate Launch Roadmap with AI
              </button>
              <button
                onClick={() => setSelectedIdea(null)}
                className="px-5 py-3 rounded-xl text-xs font-medium border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Mentor Page ───────────────────────────────────────────────────────────────
function MentorPage({ navigate }: { navigate: (p: Page) => void }) {
  const [activeType, setActiveType] = useState('All')
  const [bookingMentor, setBookingMentor] = useState<any | null>(null)
  const [bookedSuccess, setBookedSuccess] = useState<any | null>(null)
  const [selectedDate, setSelectedDate] = useState('Kal (Tomorrow) — 11:00 AM to 11:30 AM')
  const [userName, setUserName] = useState('Ramesh Patel')
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210')
  const [topic, setTopic] = useState('Mudra loan application & business registration advice')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const types = ['All', 'Business', 'Finance', 'Marketing', 'Agriculture', 'Technology']

  const mentors = [
    { name: 'Priya Sharma', title: 'Business Strategy Mentor', type: 'Business', location: 'Jaipur, Rajasthan', exp: '12 years', sessions: '340+', rating: 4.9, languages: ['Hindi', 'English'], tags: ['MSMEs', 'Rural Business', 'Retail'], img: 'photo-1494790108377-be9c29b29330', color: '#e8f0ff', accent: '#1a6fff' },
    { name: 'Ramesh Nair', title: 'Finance & Loan Expert', type: 'Finance', location: 'Pune, Maharashtra', exp: '15 years', sessions: '520+', rating: 4.8, languages: ['Marathi', 'Hindi', 'English'], tags: ['Mudra Loans', 'NBFC', 'Investment'], img: 'photo-1507003211169-0a1dd7228f2d', color: '#d1fae5', accent: '#10b981' },
    { name: 'Anita Verma', title: 'Digital Marketing Strategist', type: 'Marketing', location: 'Lucknow, UP', exp: '8 years', sessions: '280+', rating: 4.9, languages: ['Hindi', 'English'], tags: ['WhatsApp', 'Social Media', 'Local SEO'], img: 'photo-1438761681033-6461ffad8d80', color: '#fce7f3', accent: '#ec4899' },
    { name: 'Suresh Kumar', title: 'Agri-Business Consultant', type: 'Agriculture', location: 'Nashik, Maharashtra', exp: '20 years', sessions: '650+', rating: 5.0, languages: ['Marathi', 'Hindi'], tags: ['FPO', 'Organic Farming', 'Export'], img: 'photo-1506794778202-cad84cf45f1d', color: '#fef3c7', accent: '#f59e0b' },
    { name: 'Kavitha Reddy', title: 'Tech & App Startup Advisor', type: 'Technology', location: 'Hyderabad, Telangana', exp: '10 years', sessions: '190+', rating: 4.7, languages: ['Telugu', 'Hindi', 'English'], tags: ['Mobile Apps', 'E-commerce', 'Digitization'], img: 'photo-1534528741775-53994a69daeb', color: '#ede9fe', accent: '#8b5cf6' },
    { name: 'Mohan Das', title: 'Rural Business Mentor', type: 'Business', location: 'Bhopal, MP', exp: '18 years', sessions: '410+', rating: 4.8, languages: ['Hindi', 'English'], tags: ['Self Help Groups', 'Handicrafts', 'Export'], img: 'photo-1472099645785-5658abf4ff4e', color: '#e0f2fe', accent: '#0ea5e9' },
  ]

  const filtered = activeType === 'All' ? mentors : mentors.filter(m => m.type === activeType)

  const handleConfirmBooking = async () => {
    if (!userName.trim() || !phoneNumber.trim()) {
      alert('Kripya apna Naam aur Mobile Number darj karein.')
      return
    }
    setIsSubmitting(true)
    if (bookingMentor) {
      await createMentorBooking({
        mentor_name: bookingMentor.name,
        user_name: userName.trim(),
        phone_number: phoneNumber.trim(),
        business_type: topic.trim() || bookingMentor.title,
        booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time_slot: selectedDate,
        status: 'Confirmed'
      }).catch(() => {})
    }
    setIsSubmitting(false)
    setBookedSuccess({
      mentor: bookingMentor?.name,
      user: userName,
      phone: phoneNumber,
      slot: selectedDate,
      topic: topic
    })
    setTimeout(() => {
      setBookedSuccess(null)
      setBookingMentor(null)
    }, 4500)
  }

  const handleAIChatWithMentor = (m: any) => {
    localStorage.setItem(
      'gv_pending_prompt',
      `Mujhe mentor ${m.name} (${m.title}, ${m.location}) ke domain: ${m.tags.join(', ')} me business advice chahiye. Kripya meri problem solve karein.`
    )
    navigate('voice')
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: '#f7f9fc' }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Verified Business Mentors
          </h1>
          <p className="text-sm" style={{ color: '#7a8799' }}>
            Connect 1-on-1 with experienced mentors who understand rural business growth, government grants, and compliance
          </p>
        </div>

        {/* Types */}
        <div className="flex flex-wrap gap-2 mb-8">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{
                background: activeType === t ? '#1a6fff' : '#fff',
                color: activeType === t ? '#fff' : '#3d4755',
                border: `1px solid ${activeType === t ? '#1a6fff' : '#e2e8f0'}`,
                boxShadow: activeType === t ? '0 4px 12px rgba(26,111,255,0.2)' : 'none',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(m => (
            <div
              key={m.name}
              className="card-hover rounded-2xl overflow-hidden flex flex-col justify-between"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div>
                <div className="h-2 w-full" style={{ background: `linear-gradient(to right, ${m.accent}, ${m.accent}88)` }} />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={`https://images.unsplash.com/${m.img}?w=80&h=80&fit=crop&auto=format`}
                      alt={m.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0"
                      style={{ border: `2px solid ${m.color}` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[15px] truncate" style={{ color: '#0d1117' }}>{m.name}</div>
                      <div className="text-xs mb-1.5 leading-tight" style={{ color: '#7a8799' }}>{m.title}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs font-bold" style={{ color: '#0d1117' }}>{m.rating}</span>
                        <span className="text-xs" style={{ color: '#7a8799' }}>· {m.sessions} sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2.5 rounded-xl text-center" style={{ background: '#f7f9fc' }}>
                      <div className="text-xs font-bold" style={{ color: '#0d1117' }}>{m.exp}</div>
                      <div className="text-[10px] text-gray-500">Experience</div>
                    </div>
                    <div className="p-2.5 rounded-xl text-center" style={{ background: '#f7f9fc' }}>
                      <div className="text-xs font-bold truncate" style={{ color: '#0d1117' }}>{m.location.split(',')[1]?.trim() || m.location}</div>
                      <div className="text-[10px] text-gray-500">Location</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.tags.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                        style={{ background: m.color, color: m.accent }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs mb-4" style={{ color: '#7a8799' }}>
                    Speaks: <span style={{ color: '#3d4755', fontWeight: 600 }}>{m.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-2">
                <button
                  onClick={() => setBookingMentor(m)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn cursor-pointer transition-all hover:scale-102"
                >
                  Book 1-on-1 Session
                </button>
                <button
                  onClick={() => handleAIChatWithMentor(m)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer hover:bg-gray-50 transition-all"
                  style={{ color: '#3d4755', borderColor: '#e2e8f0' }}
                >
                  AI Advice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Session Modal */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            {bookedSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Session Booked Successfully!</h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Aapka 1-on-1 consultation session with <strong>{bookedSuccess.mentor}</strong> confirm ho gaya hai aur database me save ho chuka hai.
                </p>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl text-xs space-y-1 text-left border border-emerald-100 mb-4">
                  <div><strong>👤 Entrepreneur:</strong> {bookedSuccess.user} ({bookedSuccess.phone})</div>
                  <div><strong>📅 Time Slot:</strong> {bookedSuccess.slot}</div>
                  <div><strong>💡 Topic:</strong> {bookedSuccess.topic}</div>
                </div>
                <button
                  onClick={() => { setBookedSuccess(null); setBookingMentor(null); navigate('dashboard') }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn cursor-pointer"
                >
                  View in Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://images.unsplash.com/${bookingMentor.img}?w=50&h=50&fit=crop&auto=format`}
                      alt={bookingMentor.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-base text-gray-900">{bookingMentor.name}</h3>
                      <p className="text-xs text-gray-500">{bookingMentor.title}</p>
                    </div>
                  </div>
                  <button onClick={() => setBookingMentor(null)} className="p-2 text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
                </div>

                <div className="space-y-3.5 mb-6 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Full Name:</label>
                    <input
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none text-xs bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mobile / WhatsApp Number:</label>
                    <input
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none text-xs bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Select Preferred Date & Time:</label>
                    <select
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none text-xs bg-gray-50 font-medium"
                    >
                      <option>Kal (Tomorrow) — 11:00 AM to 11:30 AM</option>
                      <option>Kal (Tomorrow) — 04:00 PM to 04:30 PM</option>
                      <option>Parso (Day after tomorrow) — 10:00 AM to 10:30 AM</option>
                      <option>Is Shanivar (Saturday) — 02:00 PM to 02:30 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Apna Sawaal ya Business Topic:</label>
                    <input
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. Mudra Loan eligibility, GST registration, WhatsApp sales..."
                      className="w-full p-2.5 rounded-xl border border-gray-200 outline-none text-xs bg-gray-50"
                    />
                  </div>

                  <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 flex items-center justify-between">
                    <span>Consultation Fee:</span>
                    <span className="font-bold text-emerald-600">FREE (GramVoice Initiative)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl text-xs font-semibold text-white gradient-btn cursor-pointer hover:scale-102 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                  <button
                    onClick={() => setBookingMentor(null)}
                    className="px-4 py-3 rounded-xl text-xs font-medium border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardPage({ navigate }: { navigate: (p: Page) => void }) {
  const [dbHistory, setDbHistory] = useState<VoiceChatRecord[]>([])
  const [dbBookings, setDbBookings] = useState<MentorBookingRecord[]>([])
  const [dbSaved, setDbSaved] = useState<SavedSchemeRecord[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    Promise.all([
      getVoiceHistory(8),
      getMentorBookings(),
      getSavedSchemes(),
    ]).then(([history, bookings, saved]) => {
      setDbHistory(history)
      setDbBookings(bookings)
      setDbSaved(saved)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRemoveScheme = async (schemeId: string, schemeName: string) => {
    await toggleSaveScheme(schemeId, schemeName, '')
    loadData()
  }

  const handleOpenSchemeVoice = (schemeName: string) => {
    localStorage.setItem('gv_pending_prompt', `Mujhe ${schemeName} scheme ke baare mein complete details aur application process samjhao.`)
    navigate('voice')
  }

  const handleOpenQueryVoice = (q: string) => {
    localStorage.setItem('gv_pending_prompt', q)
    navigate('voice')
  }

  const defaultQuestions = [
    { q: 'How to open a business current bank account?', time: '2 mins ago' },
    { q: 'PM Mudra Loan ke liye kaise apply karein?', time: '1 hour ago' },
    { q: 'GST registration process for small shop?', time: '3 hours ago' },
    { q: 'How to sell products on WhatsApp & Amazon from village?', time: 'Yesterday' },
  ]

  const displayQuestions = dbHistory.length > 0
    ? dbHistory.map(h => ({
        q: h.user_message,
        time: h.created_at ? new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
      }))
    : defaultQuestions

  const trendingSchemes = [
    { name: 'PM Vishwakarma Yojana', searches: '12.4K', rising: true },
    { name: 'PM Mudra Yojana', searches: '18.9K', rising: true },
    { name: 'Startup India Seed Fund', searches: '9.1K', rising: true },
    { name: 'PMEGP Subsidy Scheme', searches: '8.4K', rising: true },
  ]

  const categories = [
    { label: 'Registration & GST', icon: '📋', count: 24, color: '#e8f0ff', accent: '#1a6fff', page: 'voice' as Page },
    { label: 'Loans & Grants', icon: '💰', count: 38, color: '#d1fae5', accent: '#10b981', page: 'schemes' as Page },
    { label: 'Marketing & Sales', icon: '📣', count: 19, color: '#fce7f3', accent: '#ec4899', page: 'voice' as Page },
    { label: 'Govt. Subsidies', icon: '🏛️', count: 52, color: '#fef3c7', accent: '#f59e0b', page: 'schemes' as Page },
  ]

  const totalQuestionsCount = Math.max(displayQuestions.length, dbHistory.length) + 12
  const schemesBookmarkedCount = Math.max(dbSaved.length, 1)
  const mentorsConnectedCount = Math.max(dbBookings.length, 1)

  const stats = [
    { label: 'Voice Queries Asked', value: String(totalQuestionsCount), change: '+5 today', up: true },
    { label: 'Saved Schemes', value: String(dbSaved.length), change: `${dbSaved.length} bookmarked`, up: true },
    { label: 'Mentor Sessions', value: String(dbBookings.length), change: dbBookings.length > 0 ? 'Confirmed' : 'Available', up: true },
    { label: 'Business Score', value: `${Math.min(96, 68 + totalQuestionsCount * 2)}%`, change: '+8% this month', up: true },
  ]

  return (
    <div className="min-h-screen pt-16" style={{ background: '#f7f9fc' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold mb-1 gradient-text uppercase tracking-widest">Entrepreneur Dashboard</div>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
              Welcome back, Entrepreneur! 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: '#7a8799' }}>
              Your business analytics, saved government schemes, voice query history, and mentorship tracker
            </p>
          </div>
          <button
            onClick={() => navigate('voice')}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold text-white gradient-btn cursor-pointer transition-all hover:scale-105 shadow-md"
          >
            <MicIcon size={16} /> Ask GramVoice AI
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: '#0d1117' }}>{s.value}</div>
              <div className="text-xs font-medium mb-1.5" style={{ color: '#7a8799' }}>{s.label}</div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold" style={{ color: s.up ? '#10b981' : '#f59e0b' }}>
                  {s.up ? '↑' : '→'} {s.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Saved Government Schemes Section */}
            <div className="p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <h2 className="font-semibold text-base" style={{ color: '#0d1117' }}>
                    Saved Government Schemes ({dbSaved.length})
                  </h2>
                </div>
                <button onClick={() => navigate('schemes')} className="text-xs font-semibold cursor-pointer" style={{ color: '#1a6fff' }}>
                  + Browse All Schemes
                </button>
              </div>

              {dbSaved.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {dbSaved.map(s => (
                    <div key={s.scheme_id || s.id} className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-bold text-sm text-gray-900">{s.scheme_name || s.scheme_id}</span>
                          {s.category && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">{s.category}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mb-3">Saved on {s.created_at ? new Date(s.created_at).toLocaleDateString() : 'Recently'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenSchemeVoice(s.scheme_name || s.scheme_id)}
                          className="flex-1 py-2 rounded-lg text-xs font-semibold text-white gradient-btn cursor-pointer"
                        >
                          Ask AI Guide
                        </button>
                        <button
                          onClick={() => handleRemoveScheme(s.scheme_id, s.scheme_name)}
                          className="px-3 py-2 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer transition-all"
                          title="Remove Bookmark"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">Aapne abhi tak koi scheme save nahi ki hai.</p>
                  <button
                    onClick={() => navigate('schemes')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-btn cursor-pointer"
                  >
                    Explore Government Schemes & Bookmark
                  </button>
                </div>
              )}
            </div>

            {/* Booked Mentor Sessions */}
            {dbBookings.length > 0 && (
              <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-emerald-900">Confirmed Mentorship Sessions ({dbBookings.length})</h2>
                  <button onClick={() => navigate('mentor')} className="text-xs font-semibold text-emerald-700 cursor-pointer">+ Book More</button>
                </div>
                <div className="space-y-2.5">
                  {dbBookings.map((b, idx) => (
                    <div key={idx} className="p-3.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-gray-900">{b.mentor_name}</div>
                        <div className="text-[11px] text-gray-600 font-medium">{b.time_slot}</div>
                        <div className="text-[11px] text-gray-500">Topic: {b.business_type} · User: {b.user_name}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {b.status || 'Confirmed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Questions */}
            <div className="p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-semibold" style={{ color: '#0d1117' }}>Recent Voice & Chat History</h2>
                </div>
                <button onClick={() => navigate('voice')} className="text-xs font-semibold cursor-pointer" style={{ color: '#1a6fff' }}>
                  Open Voice Assistant
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {displayQuestions.map((q, i) => (
                  <div
                    key={i}
                    onClick={() => handleOpenQueryVoice(q.q)}
                    className="flex items-start gap-3 p-3.5 rounded-xl transition-all hover:bg-blue-50/50 cursor-pointer"
                    style={{ border: '1px solid #e2e8f0' }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: '#d1fae5' }}
                    >
                      <CheckIcon size={13} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug font-medium" style={{ color: '#0d1117' }}>{q.q}</p>
                      <p className="text-xs mt-1" style={{ color: '#7a8799' }}>{q.time}</p>
                    </div>
                    <ChevronRight size={14} className="shrink-0 mt-1" style={{ color: '#7a8799' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Business Categories */}
            <div className="p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <h2 className="font-semibold mb-5" style={{ color: '#0d1117' }}>Explore by Category</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(c => (
                  <div
                    key={c.label}
                    onClick={() => navigate(c.page)}
                    className="card-hover p-4 rounded-xl cursor-pointer flex items-center gap-3 transition-all hover:scale-[1.02]"
                    style={{ background: c.color, border: `1px solid ${c.accent}22` }}
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: c.accent }}>{c.label}</div>
                      <div className="text-xs" style={{ color: c.accent + 'aa' }}>{c.count} resources</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Trending schemes */}
            <div className="p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold" style={{ color: '#0d1117' }}>Trending Schemes</h2>
                <button onClick={() => navigate('schemes')} className="text-xs font-semibold cursor-pointer" style={{ color: '#1a6fff' }}>View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {trendingSchemes.map((s, i) => (
                  <div key={s.name} onClick={() => navigate('schemes')} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <span className="text-xs font-bold w-4" style={{ color: '#7a8799' }}>{i + 1}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: '#0d1117' }}>{s.name}</div>
                      <div className="text-xs" style={{ color: '#7a8799' }}>{s.searches} searches</div>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: s.rising ? '#10b981' : '#f59e0b' }}>
                      {s.rising ? '↑' : '→'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Mentors */}
            <div className="p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold" style={{ color: '#0d1117' }}>Recommended Mentors</h2>
                <button onClick={() => navigate('mentor')} className="text-xs font-semibold cursor-pointer" style={{ color: '#1a6fff' }}>See All</button>
              </div>
              {[
                { name: 'Priya Sharma', role: 'Business Strategy', img: 'photo-1494790108377-be9c29b29330', rating: 4.9 },
                { name: 'Ramesh Nair', role: 'Finance Expert', img: 'photo-1507003211169-0a1dd7228f2d', rating: 4.8 },
              ].map(m => (
                <div key={m.name} onClick={() => navigate('mentor')} className="flex items-center gap-3 mb-4 last:mb-0 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <img
                    src={`https://images.unsplash.com/${m.img}?w=48&h=48&fit=crop&auto=format`}
                    alt={m.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: '#0d1117' }}>{m.name}</div>
                    <div className="text-xs" style={{ color: '#7a8799' }}>{m.role}</div>
                  </div>
                  <div className="text-xs font-semibold text-yellow-500">★ {m.rating}</div>
                </div>
              ))}
              <button
                className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold border transition-all hover:bg-gray-50 cursor-pointer"
                style={{ color: '#1a6fff', borderColor: '#bfdbfe' }}
                onClick={() => navigate('mentor')}
              >
                Find More Mentors
              </button>
            </div>

            {/* Quick voice access */}
            <div
              className="p-6 rounded-2xl text-center"
              style={{ background: 'linear-gradient(135deg, #1a6fff, #0ea5e9)' }}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <MicIcon size={22} className="text-white" />
              </div>
              <div className="text-white font-semibold mb-1">Ask Anything</div>
              <div className="text-white/80 text-xs mb-4">Voice-enabled · Hindi & English</div>
              <button
                onClick={() => navigate('voice')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{ background: '#fff', color: '#1a6fff' }}
              >
                Start Speaking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── About Page ────────────────────────────────────────────────────────────────
function AboutPage({ navigate }: { navigate: (p: Page) => void }) {
  const team = [
    { name: 'Arjun Mehra', role: 'Founder & CEO', bio: 'Former IIT Bombay grad with 8 years in rural fintech. Passionate about bridging India\'s digital divide.', img: 'photo-1500648767791-00dcc994a43e' },
    { name: 'Sneha Patel', role: 'CTO & AI Lead', bio: 'AI researcher and NLP engineer for Indian regional languages. Expert in voice-AI for rural business scalability.', img: 'photo-1544005313-94ddf0286df2' },
    { name: 'Vikram Singh', role: 'Head of Partnerships', bio: 'Ex-NABARD, built partnerships with 200+ NGOs and government bodies across 18 states.', img: 'photo-1472099645785-5658abf4ff4e' },
  ]

  const milestones = [
    { year: 'Jan 2023', event: 'Founded with a mission to empower rural Indian grassroots entrepreneurs', icon: '🌱' },
    { year: 'Jun 2023', event: 'Launched pilot across rural districts with over 5,000 active rural users', icon: '🚀' },
    { year: 'Dec 2023', event: 'Expanded voice AI dialect dataset to 18 regional Indian languages', icon: '🗣️' },
    { year: 'Apr 2024', event: 'Crossed 1 Lakh active entrepreneurs with daily voice assistance', icon: '🎯' },
    { year: 'Jan 2025', event: 'Partnered with rural business incubators & verified MSME experts', icon: '🏛️' },
  ]

  return (
    <div className="min-h-screen pt-16" style={{ background: '#fff' }}>
      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #f7f9fc 0%, #e8f0ff 50%, #d1fae5 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-sm font-semibold mb-4 gradient-text uppercase tracking-widest">Our Mission</div>
          <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Empowering Rural India,
            <br />
            <span className="gradient-text italic">One Voice at a Time</span>
          </h1>
          <p className="text-lg leading-relaxed mx-auto" style={{ color: '#3d4755', maxWidth: 560 }}>
            GramVoice AI believes that language and literacy should never be barriers to building a business. We're democratizing access to business knowledge, government schemes, and financial guidance for rural entrepreneurs across India.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4" style={{ background: '#fff' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '2.4L+', label: 'Entrepreneurs Served' },
            { value: '18', label: 'Languages & Dialects' },
            { value: '22', label: 'States Covered' },
            { value: '100%', label: 'Free Voice Access' },
          ].map(s => (
            <div key={s.label} className="p-6 rounded-2xl text-center card-hover"
              style={{ background: '#f7f9fc', border: '1px solid #e2e8f0' }}>
              <div className="text-3xl font-bold mb-1 gradient-text">{s.value}</div>
              <div className="text-sm" style={{ color: '#7a8799' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4" style={{ background: '#f7f9fc' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Meet the Team
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {team.map(t => (
              <div key={t.name} className="p-6 rounded-2xl text-center card-hover"
                style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
                <img src={`https://images.unsplash.com/${t.img}?w=120&h=120&fit=crop&auto=format`}
                  alt={t.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4" />
                <div className="font-semibold mb-0.5" style={{ color: '#0d1117' }}>{t.name}</div>
                <div className="text-xs font-semibold mb-3 gradient-text">{t.role}</div>
                <p className="text-xs leading-relaxed" style={{ color: '#7a8799' }}>{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4" style={{ background: '#fff' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: '#e2e8f0' }} />
            <div className="flex flex-col gap-6">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-5 pl-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 z-10"
                    style={{ background: '#e8f0ff', border: '2px solid #bfdbfe' }}>
                    {m.icon}
                  </div>
                  <div className="pb-2">
                    <div className="text-xs font-bold mb-1 gradient-text">{m.year}</div>
                    <div className="text-sm" style={{ color: '#3d4755' }}>{m.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Join the Movement
          </h2>
          <p className="mb-8" style={{ color: '#7a8799' }}>Ready to start or grow your business? GramVoice AI is free for all rural entrepreneurs.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('voice')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white text-sm font-semibold gradient-btn cursor-pointer">
              <MicIcon size={16} /> Try Voice Assistant
            </button>
            <button onClick={() => navigate('schemes')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold border-2 hover:bg-gray-50 transition-all cursor-pointer"
              style={{ color: '#3d4755', borderColor: '#e2e8f0' }}>
              Browse Schemes <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer className="py-12 px-4" style={{ background: '#0d1117', borderTop: '1px solid #1e2a3a' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4 cursor-pointer" onClick={() => navigate('landing')}>
              <div className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center">
                <MicIcon size={16} className="text-white" />
              </div>
              <span className="font-semibold text-white">GramVoice AI</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#6b7a8d' }}>
              Voice-first AI platform empowering rural entrepreneurs across India in their local language.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold mb-4 uppercase tracking-widest" style={{ color: '#4a5568' }}>Features</div>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => navigate('voice')} className="text-sm text-left transition-colors hover:text-white cursor-pointer" style={{ color: '#6b7a8d' }}>Voice Assistant</button>
              <button onClick={() => navigate('schemes')} className="text-sm text-left transition-colors hover:text-white cursor-pointer" style={{ color: '#6b7a8d' }}>Government Schemes</button>
              <button onClick={() => navigate('ideas')} className="text-sm text-left transition-colors hover:text-white cursor-pointer" style={{ color: '#6b7a8d' }}>Business Ideas</button>
              <button onClick={() => navigate('mentor')} className="text-sm text-left transition-colors hover:text-white cursor-pointer" style={{ color: '#6b7a8d' }}>Expert Mentors</button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-4 uppercase tracking-widest" style={{ color: '#4a5568' }}>Platform</div>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => navigate('dashboard')} className="text-sm text-left transition-colors hover:text-white cursor-pointer" style={{ color: '#6b7a8d' }}>User Dashboard</button>
              <button onClick={() => navigate('about')} className="text-sm text-left transition-colors hover:text-white cursor-pointer" style={{ color: '#6b7a8d' }}>About GramVoice</button>
              <a href="#features" onClick={() => navigate('landing')} className="text-sm transition-colors hover:text-white cursor-pointer" style={{ color: '#6b7a8d' }}>Technology & Privacy</a>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-4 uppercase tracking-widest" style={{ color: '#4a5568' }}>Direct Voice Help</div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b7a8d' }}>
              Got business questions or scheme inquiries? Just speak in Hindi or English.
            </p>
            <button onClick={() => navigate('voice')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn cursor-pointer transition-all hover:scale-105">
              <MicIcon size={14} /> Start Voice Chat
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid #1e2a3a' }}>
          <p className="text-xs" style={{ color: '#4a5568' }}>© 2025 GramVoice AI. Built for Rural Entrepreneurship.</p>
          <div className="flex gap-4">
            <span className="text-xs" style={{ color: '#4a5568' }}>100% Free & Open Access</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('landing')

  const navigate = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    switch (page) {
      case 'landing': return <LandingPage navigate={navigate} />
      case 'voice': return <VoiceAssistantPage />
      case 'schemes': return <GovernmentSchemesPage navigate={navigate} />
      case 'ideas': return <BusinessIdeasPage navigate={navigate} />
      case 'mentor': return <MentorPage navigate={navigate} />
      case 'dashboard': return <DashboardPage navigate={navigate} />
      case 'about': return <AboutPage navigate={navigate} />
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh', background: '#fff' }}>
      <Nav current={page} navigate={navigate} />
      <main>{renderPage()}</main>
    </div>
  )
}