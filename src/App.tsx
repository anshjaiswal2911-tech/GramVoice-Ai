import { useState, useRef, type CSSProperties } from 'react'

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
              className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150"
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
          <button className="hidden md:block px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-btn">
            Get Started
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg" style={{ color: '#3d4755' }}>
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
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium"
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
    { icon: '🧭', title: 'Business Guide', desc: 'Step-by-step guidance to register and launch your business in your language.', color: '#e8f0ff', accent: '#1a6fff' },
    { icon: '🏛️', title: 'Government Schemes', desc: 'Discover subsidies, grants, and schemes tailored for rural entrepreneurs.', color: '#d1fae5', accent: '#10b981' },
    { icon: '🤝', title: 'Business Mentor', desc: 'Connect with experienced mentors across industries for real guidance.', color: '#fef3c7', accent: '#f59e0b' },
    { icon: '📣', title: 'Marketing Tips', desc: 'Learn how to reach more customers with simple digital and offline tactics.', color: '#fce7f3', accent: '#ec4899' },
    { icon: '💳', title: 'Loan Assistance', desc: 'Find the right microfinance or bank loan options for your business stage.', color: '#ede9fe', accent: '#8b5cf6' },
    { icon: '🌐', title: 'Multilingual Support', desc: 'Speak in Hindi, Tamil, Marathi, Telugu or English — we understand all.', color: '#e0f2fe', accent: '#0ea5e9' },
  ]

  const steps = [
    { icon: '🎙️', label: 'Voice Input', desc: 'Ask your question in any language' },
    { icon: '📚', label: 'Knowledge Base', desc: 'Searched across 10,000+ verified sources' },
    { icon: '🤖', label: 'Gemini AI', desc: 'Processed and simplified by AI' },
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
                <SparklesIcon size={13} /> Powered by Google Gemini AI
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
              <div key={f.title} className="card-hover p-6 rounded-2xl cursor-pointer"
                style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-[16px] mb-2" style={{ color: '#0d1117' }}>{f.title}</h3>
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
function VoiceAssistantPage() {
type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking'

const [state, setState] = useState<VoiceState>('idle')
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'ai', text: 'Namaste! Main GramVoice AI hoon. Business registration, government schemes, loans, marketing — kuch bhi pucho, Hindi ya English mein. Mic tap karo ya type karo! 🎤' },
  ])
  const [inputText, setInputText] = useState('')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gv_gemini_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const [keyError, setKeyError] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
    }, 100)
  }

  const saveKey = () => {
    const k = keyDraft.trim()
    if (k.length < 20) { setKeyError('Key bahut chhoti hai — poori key paste karo'); return }
    localStorage.setItem('gv_gemini_key', k)
    setApiKey(k)
    setShowKeyInput(false)
    setKeyDraft('')
    setKeyError('')
  }

  const callGemini = async (question: string) => {
  if (!question.trim()) return

  setState('processing')
  setKeyError('')

  try {
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: question,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'AI request failed')
    }

    const answer =
      data.reply ||
      data.response ||
      'Sorry, response nahi mili. Please try again.'

    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        text: answer,
      },
    ])

    scrollToBottom()

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()

      const utter = new SpeechSynthesisUtterance(
        answer.replace(/[*#_]/g, '')
      )

      utter.lang = /[\u0900-\u097F]/.test(answer)
        ? 'hi-IN'
        : 'en-IN'

      utter.rate = 0.92
      utter.pitch = 1

      utter.onstart = () => {
        setState('speaking')
      }

      utter.onend = () => {
        setState('idle')
      }

      window.speechSynthesis.speak(utter)
    } else {
      setState('idle')
    }

  } catch (error: any) {
    console.error('GramVoice AI Error:', error)

    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        text: 'AI se connect nahi ho pa raha. Please check karo ki backend localhost:5000 par running hai.',
      },
    ])

    setKeyError(
      'Backend connection failed. Make sure server localhost:5000 par running hai.'
    )

    setState('idle')
    scrollToBottom()
  }
}
  const handleMicClick = () => {
    if (state !== 'idle') {
      window.speechSynthesis?.cancel()
      recognitionRef.current?.stop()
      setState('idle')
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setKeyError('Voice input not supported in this browser. Please type your question.')
      return
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = 'hi-IN'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onstart = () => setState('listening')
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setMessages(prev => [...prev, { role: 'user', text: transcript }])
      scrollToBottom()
      callGemini(transcript)
    }
    recognition.onerror = () => {
      setState('idle')
      setKeyError('Voice detect nahi hua. Please try again or type below.')
    }
    recognition.onend = () => {
      setState(prev => (prev === 'listening' ? 'idle' : prev))
    }
    recognition.start()
  }

  const handleTextSend = async () => {
    const q = inputText.trim()
    if (!q || state !== 'idle') return
    setInputText('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    scrollToBottom()
    await callGemini(q)
  }

  const stateLabel = { idle: 'Tap to speak', listening: 'Sun raha hoon...', processing: 'Soch raha hoon...', speaking: 'Bol raha hoon...' }[state]
  const stateColor = { idle: '#1a6fff', listening: '#10b981', processing: '#f59e0b', speaking: '#8b5cf6' }[state]

  const suggestions = [
    'Business register kaise karein?',
    'PM Mudra Loan ke liye kaise apply karein?',
    'WhatsApp pe marketing kaise karein?',
    'Kirana store ke liye loan kaise milega?',
    'GST registration process kya hai?',
  ]

  return (
    <div className="min-h-screen pt-16" style={{ background: '#f7f9fc' }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Voice Assistant
          </h1>
          <p className="text-sm" style={{ color: '#7a8799' }}>Hindi, English, Tamil, Marathi, Telugu — koi bhi bhasha mein bolo</p>
        </div>

        {!apiKey && !showKeyInput && (
          <div className="mb-5 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
            <div>
              <div className="text-sm font-semibold" style={{ color: '#92400e' }}>Gemini API Key Required</div>
              <div className="text-xs mt-0.5" style={{ color: '#b45309' }}>Real AI answers ke liye apni FREE Gemini key add karo</div>
            </div>
            <button onClick={() => setShowKeyInput(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap text-white"
              style={{ background: '#f59e0b' }}>
              Add API Key
            </button>
          </div>
        )}

        {showKeyInput && (
          <div className="mb-5 p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#0d1117' }}>Gemini API Key Enter Karo</div>
            <div className="text-xs mb-1" style={{ color: '#7a8799' }}>
              Key: <strong>aistudio.google.com</strong> pe jao → API Keys → Create API Key
            </div>
            <div className="text-xs mb-4" style={{ color: '#10b981' }}>
              Key aisi dikhegi: AIzaSy... — poori key copy karo
            </div>
            <div className="flex gap-2">
              <input
                value={keyDraft}
                onChange={e => { setKeyDraft(e.target.value); setKeyError('') }}
                placeholder="Yahan paste karo apni Gemini API key (AIza...)..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none font-mono"
                style={{ background: '#f7f9fc', border: `1px solid ${keyError ? '#ef4444' : '#e2e8f0'}`, color: '#0d1117' }}
                onKeyDown={e => e.key === 'Enter' && saveKey()}
              />
              <button onClick={saveKey} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-btn whitespace-nowrap">
                Save & Connect
              </button>
              <button onClick={() => { setShowKeyInput(false); setKeyError('') }}
                className="px-3 py-2.5 rounded-xl text-sm border"
                style={{ color: '#7a8799', borderColor: '#e2e8f0' }}>
                X
              </button>
            </div>
            {keyError && <div className="text-xs mt-2" style={{ color: '#ef4444' }}>{keyError}</div>}
          </div>
        )}

        {apiKey && !showKeyInput && (
          <div className="mb-5 flex items-center justify-between px-4 py-2.5 rounded-xl"
            style={{ background: '#d1fae5', border: '1px solid #a7f3d0' }}>
            <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#065f46' }}>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Gemini AI Connected — Real answers enabled ✓
            </div>
            <button onClick={() => { setShowKeyInput(true); setKeyDraft(apiKey) }}
              className="text-xs" style={{ color: '#059669' }}>
              Change Key
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden flex flex-col"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', height: '60vh' }}>
            <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center">
                <MicIcon size={15} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: '#0d1117' }}>GramVoice AI</div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-xs" style={{ color: '#7a8799' }}>{apiKey ? 'Live · Gemini 1.5 Flash (FREE)' : 'Demo Mode · Add key for real answers'}</span>
                </div>
              </div>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                    style={{
                      background: m.role === 'user' ? 'linear-gradient(135deg, #1a6fff, #0ea5e9)' : '#f7f9fc',
                      color: m.role === 'user' ? '#fff' : '#3d4755',
                      borderRadius: m.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                      border: m.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                    }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {state === 'processing' && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl flex gap-1.5 items-center"
                    style={{ background: '#f7f9fc', border: '1px solid #e2e8f0' }}>
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
                  placeholder="Apna sawaal type karo ya mic tap karo..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#f7f9fc', border: '1px solid #e2e8f0', color: '#0d1117' }}
                  disabled={state !== 'idle'}
                />
                <button onClick={handleTextSend} disabled={state !== 'idle' || !inputText.trim()}
                  className="p-2.5 rounded-xl gradient-btn disabled:opacity-40">
                  <ArrowRight size={18} className="text-white" />
                </button>
              </div>
              {keyError && <div className="text-xs mt-2" style={{ color: '#ef4444' }}>{keyError}</div>}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="p-6 rounded-2xl flex flex-col items-center gap-6"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div className="text-sm font-medium" style={{ color: stateColor }}>{stateLabel}</div>

              <div className="relative flex items-center justify-center">
                {(state === 'listening' || state === 'speaking') && (
                  <>
                    <div className="mic-ring absolute w-24 h-24 rounded-full border-2" style={{ borderColor: stateColor + '40' }} />
                    <div className="mic-ring-2 absolute w-24 h-24 rounded-full border-2" style={{ borderColor: stateColor + '30' }} />
                    <div className="mic-ring-3 absolute w-24 h-24 rounded-full border-2" style={{ borderColor: stateColor + '20' }} />
                  </>
                )}
                <button onClick={handleMicClick}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all ${state !== 'idle' ? 'mic-pulse' : 'hover:scale-105'}`}
                  style={{
                    background: `linear-gradient(135deg, ${stateColor}, ${stateColor}cc)`,
                    boxShadow: `0 8px 24px ${stateColor}40`,
                  }}>
                  {state === 'processing'
                    ? <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="dot-bounce w-1.5 h-1.5 rounded-full bg-white" />)}</div>
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

              <div className="text-xs text-center" style={{ color: '#7a8799' }}>
                {state === 'idle' ? 'Hindi, English, 18 languages' :
                  state === 'listening' ? 'Bol rahe ho... bolo!' :
                  state === 'processing' ? 'Gemini AI soch raha hai...' : 'AI bol raha hai...'}
              </div>

              {state !== 'idle' && (
                <button onClick={() => { window.speechSynthesis?.cancel(); recognitionRef.current?.stop(); setState('idle') }}
                  className="text-xs px-3 py-1.5 rounded-lg border"
                  style={{ color: '#ef4444', borderColor: '#fecaca' }}>
                  Rokna hai? Tap karo
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="text-xs font-semibold mb-3" style={{ color: '#7a8799' }}>QUICK QUESTIONS</div>
              <div className="flex flex-col gap-2">
                {suggestions.map(s => (
                  <button key={s}
                    onClick={() => { setMessages(prev => [...prev, { role: 'user', text: s }]); scrollToBottom(); callGemini(s) }}
                    disabled={state !== 'idle'}
                    className="text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:bg-blue-50 disabled:opacity-40"
                    style={{ color: '#3d4755', border: '1px solid #e2e8f0' }}>
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
function GovernmentSchemesPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Loans', 'Subsidies', 'Training', 'Women', 'Agriculture']

  const schemes = [
    { name: 'PM Mudra Yojana', category: 'Loans', ministry: 'Ministry of Finance', benefit: 'Loans up to ₹10 Lakh', eligibility: 'Any non-corporate micro business', deadline: 'Ongoing', badge: '🔥 Popular', color: '#e8f0ff', accent: '#1a6fff' },
    { name: 'Stand Up India', category: 'Loans', ministry: 'SIDBI', benefit: 'Loans ₹10L–₹1Cr', eligibility: 'SC/ST & Women entrepreneurs', deadline: 'Ongoing', badge: '✨ New', color: '#d1fae5', accent: '#10b981' },
    { name: 'Startup India Seed Fund', category: 'Subsidies', ministry: 'DPIIT', benefit: 'Up to ₹20 Lakh grant', eligibility: 'DPIIT-recognized startups', deadline: 'Dec 2025', badge: null, color: '#fef3c7', accent: '#f59e0b' },
    { name: 'PM Vishwakarma Yojana', category: 'Training', ministry: 'MSME Ministry', benefit: 'Free skill training + ₹15,000', eligibility: 'Artisans & craftspeople', deadline: 'Ongoing', badge: '🏆 Top Rated', color: '#ede9fe', accent: '#8b5cf6' },
    { name: 'Mahila Udyam Nidhi', category: 'Women', ministry: 'SIDBI', benefit: 'Soft loans up to ₹10 Lakh', eligibility: 'Women-led enterprises', deadline: 'Ongoing', badge: '👩‍💼 Women Only', color: '#fce7f3', accent: '#ec4899' },
    { name: 'PMEGP Scheme', category: 'Subsidies', ministry: 'KVIC', benefit: '15–35% capital subsidy', eligibility: '18+ years, village/town areas', deadline: 'Mar 2025', badge: null, color: '#e0f2fe', accent: '#0ea5e9' },
    { name: 'Agri Infrastructure Fund', category: 'Agriculture', ministry: 'Agriculture Ministry', benefit: 'Loans up to ₹2 Crore', eligibility: 'Farmers & FPOs', deadline: 'Ongoing', badge: '🌾 New', color: '#d1fae5', accent: '#10b981' },
    { name: 'ASPIRE Scheme', category: 'Training', ministry: 'MSME Ministry', benefit: 'Technology incubation', eligibility: 'Rural entrepreneurs & innovators', deadline: 'Ongoing', badge: null, color: '#e8f0ff', accent: '#1a6fff' },
  ]

  const filtered = schemes.filter(s =>
    (activeCategory === 'All' || s.category === activeCategory) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.benefit.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen pt-16" style={{ background: '#f7f9fc' }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Government Schemes
          </h1>
          <p className="text-sm" style={{ color: '#7a8799' }}>Discover 500+ government schemes, subsidies, and programs for entrepreneurs</p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#7a8799' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search schemes by name or benefit..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#0d1117' }}
            />
          </div>
          <button className="px-5 py-3 rounded-xl text-sm font-semibold text-white gradient-btn whitespace-nowrap">
            🎤 Voice Search
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeCategory === c ? '#1a6fff' : '#fff',
                color: activeCategory === c ? '#fff' : '#3d4755',
                border: `1px solid ${activeCategory === c ? '#1a6fff' : '#e2e8f0'}`,
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* Schemes grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => (
            <div key={s.name} className="card-hover p-6 rounded-2xl"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: s.color }}>
                  🏛️
                </div>
                {s.badge && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: s.color, color: s.accent }}>
                    {s.badge}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-[15px] mb-1" style={{ color: '#0d1117' }}>{s.name}</h3>
              <p className="text-xs mb-4" style={{ color: '#7a8799' }}>{s.ministry}</p>

              <div className="space-y-2 mb-5">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold w-20 shrink-0" style={{ color: '#7a8799' }}>Benefit</span>
                  <span className="text-xs font-medium" style={{ color: s.accent }}>{s.benefit}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold w-20 shrink-0" style={{ color: '#7a8799' }}>Eligible</span>
                  <span className="text-xs" style={{ color: '#3d4755' }}>{s.eligibility}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold w-20 shrink-0" style={{ color: '#7a8799' }}>Deadline</span>
                  <span className="text-xs" style={{ color: '#3d4755' }}>{s.deadline}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn">
                  Apply Now
                </button>
                <button className="px-4 py-2.5 rounded-xl text-xs font-medium border"
                  style={{ color: '#3d4755', borderColor: '#e2e8f0' }}>
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Business Ideas Page ──────────────────────────────────────────────────────
function BusinessIdeasPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = ['All', 'Low Investment', 'Agriculture', 'Services', 'Manufacturing', 'Digital']

  const ideas = [
    { title: 'Organic Fertilizer Production', category: 'Agriculture', investment: '₹20,000–50,000', profit: '₹15,000/month', difficulty: 'Easy', time: '3 months', icon: '🌱', tag: 'Low Investment', desc: 'Convert agricultural waste into organic fertilizer. High demand from local farmers.' },
    { title: 'Mobile Repair Shop', category: 'Services', investment: '₹15,000–30,000', profit: '₹25,000/month', difficulty: 'Medium', time: '1 month', icon: '📱', tag: 'Quick Start', desc: 'Repair smartphones and accessories. Free PM Vishwakarma training available.' },
    { title: 'Agri-Tourism Homestay', category: 'Agriculture', investment: '₹50,000–2L', profit: '₹40,000/month', difficulty: 'Medium', time: '2 months', icon: '🏡', tag: 'High Profit', desc: 'Convert your farm into a weekend tourism destination. Government subsidies available.' },
    { title: 'Digital Literacy Center', category: 'Digital', investment: '₹30,000–80,000', profit: '₹20,000/month', difficulty: 'Easy', time: '2 months', icon: '💻', tag: 'Trending', desc: 'Teach computer and mobile skills to rural youth. CSC center funding available.' },
    { title: 'Pickles & Papad Making', category: 'Manufacturing', investment: '₹10,000–25,000', profit: '₹12,000/month', difficulty: 'Easy', time: '1 month', icon: '🫙', tag: 'Low Investment', desc: 'Traditional food products with high demand. Sell locally and through online platforms.' },
    { title: 'Tailoring & Embroidery', category: 'Services', investment: '₹15,000–40,000', profit: '₹18,000/month', difficulty: 'Easy', time: '2 months', icon: '🧵', tag: 'Women Friendly', desc: 'Offer custom stitching and embroidery. Skill India training programs available.' },
  ]

  const filtered = activeFilter === 'All' ? ideas : ideas.filter(i => i.tag.includes(activeFilter) || i.category === activeFilter)

  const difficultyColor = (d: string) => d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : '#ef4444'

  return (
    <div className="min-h-screen pt-16" style={{ background: '#f7f9fc' }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Business Ideas
          </h1>
          <p className="text-sm" style={{ color: '#7a8799' }}>Curated business opportunities matched to your location, skills, and investment capacity</p>
        </div>

        {/* AI matcher card */}
        <div className="p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #1a6fff, #0ea5e9)', boxShadow: '0 8px 30px rgba(26,111,255,0.25)' }}>
          <div>
            <div className="text-white font-semibold text-lg mb-1">Get AI-Matched Business Ideas</div>
            <div className="text-white/75 text-sm">Tell us your budget, location & skills — get personalized ideas in 30 seconds</div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all hover:scale-105"
            style={{ background: '#fff', color: '#1a6fff' }}>
            <MicIcon size={16} /> Ask AI
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeFilter === f ? '#0d1117' : '#fff',
                color: activeFilter === f ? '#fff' : '#3d4755',
                border: `1px solid ${activeFilter === f ? '#0d1117' : '#e2e8f0'}`,
              }}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(idea => (
            <div key={idea.title} className="card-hover rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{idea.icon}</div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: '#e8f0ff', color: '#1a6fff' }}>
                    {idea.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-[15px] mb-2" style={{ color: '#0d1117' }}>{idea.title}</h3>
                <p className="text-xs leading-relaxed mb-5" style={{ color: '#7a8799' }}>{idea.desc}</p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 rounded-xl" style={{ background: '#f7f9fc' }}>
                    <div className="text-xs mb-0.5" style={{ color: '#7a8799' }}>Investment</div>
                    <div className="text-xs font-semibold" style={{ color: '#0d1117' }}>{idea.investment}</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: '#d1fae5' }}>
                    <div className="text-xs mb-0.5" style={{ color: '#059669' }}>Avg. Profit</div>
                    <div className="text-xs font-semibold" style={{ color: '#059669' }}>{idea.profit}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: difficultyColor(idea.difficulty) }} />
                    <span className="text-xs font-medium" style={{ color: difficultyColor(idea.difficulty) }}>{idea.difficulty}</span>
                  </div>
                  <span className="text-xs" style={{ color: '#7a8799' }}>⏱ {idea.time} to start</span>
                </div>

                <button className="w-full py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn">
                  Explore This Idea
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Mentor Page ───────────────────────────────────────────────────────────────
function MentorPage() {
  const [activeType, setActiveType] = useState('All')

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

  return (
    <div className="min-h-screen pt-16" style={{ background: '#f7f9fc' }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
            Find a Mentor
          </h1>
          <p className="text-sm" style={{ color: '#7a8799' }}>Connect with verified expert mentors who understand rural and semi-urban business challenges</p>
        </div>

        {/* Types */}
        <div className="flex flex-wrap gap-2 mb-8">
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeType === t ? '#1a6fff' : '#fff',
                color: activeType === t ? '#fff' : '#3d4755',
                border: `1px solid ${activeType === t ? '#1a6fff' : '#e2e8f0'}`,
              }}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(m => (
            <div key={m.name} className="card-hover rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
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
                      <span className="text-xs font-semibold" style={{ color: '#0d1117' }}>{m.rating}</span>
                      <span className="text-xs" style={{ color: '#7a8799' }}>· {m.sessions} sessions</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2.5 rounded-lg text-center" style={{ background: '#f7f9fc' }}>
                    <div className="text-xs font-semibold" style={{ color: '#0d1117' }}>{m.exp}</div>
                    <div className="text-[10px]" style={{ color: '#7a8799' }}>Experience</div>
                  </div>
                  <div className="p-2.5 rounded-lg text-center" style={{ background: '#f7f9fc' }}>
                    <div className="text-xs font-semibold truncate" style={{ color: '#0d1117' }}>{m.location.split(',')[1].trim()}</div>
                    <div className="text-[10px]" style={{ color: '#7a8799' }}>Location</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                      style={{ background: m.color, color: m.accent }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="text-xs mb-4" style={{ color: '#7a8799' }}>
                  Speaks: <span style={{ color: '#3d4755', fontWeight: 500 }}>{m.languages.join(', ')}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white gradient-btn">
                    Book Session
                  </button>
                  <button className="px-4 py-2.5 rounded-xl text-xs font-medium border"
                    style={{ color: '#3d4755', borderColor: '#e2e8f0' }}>
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardPage({ navigate }: { navigate: (p: Page) => void }) {
  const recentQuestions = [
    { q: 'How to open a bank account for my business?', time: '2 mins ago', answered: true },
    { q: 'PM Mudra Loan ke liye kaise apply karein?', time: '1 hour ago', answered: true },
    { q: 'GST registration process for small shop?', time: '3 hours ago', answered: true },
    { q: 'How to sell products on Amazon from village?', time: 'Yesterday', answered: true },
  ]

  const trendingSchemes = [
    { name: 'PM Vishwakarma Yojana', searches: '12.4K', rising: true },
    { name: 'Startup India Seed Fund', searches: '9.1K', rising: true },
    { name: 'Stand Up India', searches: '7.8K', rising: false },
    { name: 'Mahila Udyam Nidhi', searches: '6.3K', rising: true },
  ]

  const categories = [
    { label: 'Registration', icon: '📋', count: 24, color: '#e8f0ff', accent: '#1a6fff' },
    { label: 'Loans & Finance', icon: '💰', count: 38, color: '#d1fae5', accent: '#10b981' },
    { label: 'Marketing', icon: '📣', count: 19, color: '#fce7f3', accent: '#ec4899' },
    { label: 'Government', icon: '🏛️', count: 52, color: '#fef3c7', accent: '#f59e0b' },
  ]

  const stats = [
    { label: 'Questions Asked', value: '42', change: '+8 this week', up: true },
    { label: 'Schemes Bookmarked', value: '7', change: '+2 new', up: true },
    { label: 'Mentors Connected', value: '3', change: '1 session due', up: false },
    { label: 'Business Score', value: '78%', change: '+5% this month', up: true },
  ]

  return (
    <div className="min-h-screen pt-16" style={{ background: '#f7f9fc' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold mb-1 gradient-text uppercase tracking-widest">Dashboard</div>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Instrument Serif', serif", color: '#0d1117' }}>
              Welcome back, Ramesh! 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: '#7a8799' }}>Your kirana business is growing — here's what's new today.</p>
          </div>
          <button onClick={() => navigate('voice')}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold text-white gradient-btn">
            <MicIcon size={16} /> Ask a Question
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: '#0d1117' }}>{s.value}</div>
              <div className="text-xs font-medium mb-1.5" style={{ color: '#7a8799' }}>{s.label}</div>
              <div className="flex items-center gap-1">
                <span className="text-xs" style={{ color: s.up ? '#10b981' : '#f59e0b' }}>
                  {s.up ? '↑' : '→'} {s.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Recent Questions */}
            <div className="p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold" style={{ color: '#0d1117' }}>Recent Questions</h2>
                <button className="text-xs font-medium" style={{ color: '#1a6fff' }}>View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {recentQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl transition-all hover:bg-gray-50"
                    style={{ border: '1px solid #e2e8f0' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: '#d1fae5' }}>
                      <CheckIcon size={13} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug" style={{ color: '#0d1117' }}>{q.q}</p>
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
                  <div key={c.label} className="card-hover p-4 rounded-xl cursor-pointer flex items-center gap-3"
                    style={{ background: c.color, border: `1px solid ${c.accent}22` }}>
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: c.accent }}>{c.label}</div>
                      <div className="text-xs" style={{ color: c.accent + 'aa' }}>{c.count} articles</div>
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
                <button onClick={() => navigate('schemes')} className="text-xs font-medium" style={{ color: '#1a6fff' }}>View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {trendingSchemes.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-3">
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
                <button onClick={() => navigate('mentor')} className="text-xs font-medium" style={{ color: '#1a6fff' }}>See All</button>
              </div>
              {[
                { name: 'Priya Sharma', role: 'Business Strategy', img: 'photo-1494790108377-be9c29b29330', rating: 4.9 },
                { name: 'Ramesh Nair', role: 'Finance Expert', img: 'photo-1507003211169-0a1dd7228f2d', rating: 4.8 },
              ].map(m => (
                <div key={m.name} className="flex items-center gap-3 mb-4 last:mb-0">
                  <img src={`https://images.unsplash.com/${m.img}?w=48&h=48&fit=crop&auto=format`}
                    alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: '#0d1117' }}>{m.name}</div>
                    <div className="text-xs" style={{ color: '#7a8799' }}>{m.role}</div>
                  </div>
                  <div className="text-xs font-semibold text-yellow-500">★ {m.rating}</div>
                </div>
              ))}
              <button className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold border transition-all hover:bg-gray-50"
                style={{ color: '#1a6fff', borderColor: '#bfdbfe' }} onClick={() => navigate('mentor')}>
                Find More Mentors
              </button>
            </div>

            {/* Quick voice access */}
            <div className="p-6 rounded-2xl text-center"
              style={{ background: 'linear-gradient(135deg, #1a6fff, #0ea5e9)' }}>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <MicIcon size={22} className="text-white" />
              </div>
              <div className="text-white font-semibold mb-1">Ask Anything</div>
              <div className="text-white/70 text-xs mb-4">Voice-enabled · 18 languages</div>
              <button onClick={() => navigate('voice')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: '#fff', color: '#1a6fff' }}>
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
    { name: 'Sneha Patel', role: 'CTO & AI Lead', bio: 'Google AI alumni, led NLP projects for 10+ Indian languages. Expert in voice-AI for low-bandwidth environments.', img: 'photo-1544005313-94ddf0286df2' },
    { name: 'Vikram Singh', role: 'Head of Partnerships', bio: 'Ex-NABARD, built partnerships with 200+ NGOs and government bodies across 18 states.', img: 'photo-1472099645785-5658abf4ff4e' },
  ]

  const milestones = [
    { year: 'Jan 2023', event: 'Founded in Jaipur with seed funding of ₹2.5 Crore', icon: '🌱' },
    { year: 'Jun 2023', event: 'Launched pilot in 3 districts of Rajasthan with 5,000 users', icon: '🚀' },
    { year: 'Dec 2023', event: 'Series A: ₹18 Crore raised. Expanded to 6 states', icon: '💰' },
    { year: 'Apr 2024', event: 'Crossed 1 Lakh active users. Added 12 regional languages', icon: '🎯' },
    { year: 'Jan 2025', event: '2.4 Lakh entrepreneurs. MoU with Ministry of MSME', icon: '🏛️' },
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
            GramVoice AI believes that language and literacy should never be barriers to building a business. We're democratizing access to business knowledge for 300 million rural entrepreneurs across India.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4" style={{ background: '#fff' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: '2.4L+', label: 'Entrepreneurs Served' },
            { value: '18', label: 'Languages Supported' },
            { value: '22', label: 'States Covered' },
            { value: '₹18Cr', label: 'Series A Raised' },
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
          <p className="mb-8" style={{ color: '#7a8799' }}>Ready to start or grow your business? GramVoice AI is free for rural entrepreneurs.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('voice')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white text-sm font-semibold gradient-btn">
              <MicIcon size={16} /> Try Voice Assistant
            </button>
            <button onClick={() => navigate('schemes')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold border-2 hover:bg-gray-50 transition-all"
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
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center">
                <MicIcon size={16} className="text-white" />
              </div>
              <span className="font-semibold text-white">GramVoice AI</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#6b7a8d' }}>
              AI-powered voice assistant helping rural India build better businesses.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {['GitHub', 'LinkedIn', 'Twitter'].map(s => (
                <a key={s} href="#" className="text-xs px-3 py-1.5 rounded-lg transition-all hover:bg-white/10"
                  style={{ color: '#6b7a8d', border: '1px solid #1e2a3a' }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Product', links: ['Voice Assistant', 'Government Schemes', 'Business Ideas', 'Find Mentor'] },
            { title: 'Resources', links: ['Documentation', 'API Access', 'Blog', 'Case Studies'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-xs font-semibold mb-4 uppercase tracking-widest" style={{ color: '#4a5568' }}>{col.title}</div>
              <div className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <a key={link} href="#" className="text-sm transition-colors hover:text-white" style={{ color: '#6b7a8d' }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid #1e2a3a' }}>
          <p className="text-xs" style={{ color: '#4a5568' }}>© 2025 GramVoice AI. Made with ❤️ for Rural India.</p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map(l => (
              <a key={l} href="#" className="text-xs transition-colors hover:text-white" style={{ color: '#4a5568' }}>{l}</a>
            ))}
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
      case 'schemes': return <GovernmentSchemesPage />
      case 'ideas': return <BusinessIdeasPage />
      case 'mentor': return <MentorPage />
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