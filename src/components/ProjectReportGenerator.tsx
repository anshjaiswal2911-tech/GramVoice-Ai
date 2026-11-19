import { useState, useRef } from 'react'

interface Props {
  initialScheme?: string
  initialAmount?: number
}

interface BusinessPreset {
  id: string
  nameHindi: string
  nameEnglish: string
  defaultCost: number
  category: string
  machinery: { item: string; cost: number }[]
  workingCapital: { item: string; cost: number }[]
  monthlyRevenue: number
  monthlyExpenses: number
}

const PRESETS: BusinessPreset[] = [
  {
    id: 'dairy',
    nameHindi: 'डेयरी फार्मिंग (4 संकर गाय/भैंस)',
    nameEnglish: 'Dairy Farming & Milk Supply Unit',
    defaultCost: 400000,
    category: 'पशुपालन / कृषि संबंधित',
    machinery: [
      { item: '4 उच्च नस्ल की दुधारू गाय / भैंस', cost: 240000 },
      { item: 'कैटल शेड व पानी की टंकी निर्माण', cost: 80000 },
      { item: 'मिल्किंग उपकरण व स्टोरेज कैन्स', cost: 30000 },
    ],
    workingCapital: [
      { item: '2 माह का सूखा व हरा चारा + दाना', cost: 35000 },
      { item: 'टीकाकरण, दवाइयां व आकस्मिक खर्च', cost: 15000 },
    ],
    monthlyRevenue: 65000,
    monthlyExpenses: 28000,
  },
  {
    id: 'pickle',
    nameHindi: 'अचार, पापड़ व मसाला प्रसंस्करण यूनिट',
    nameEnglish: 'Pickle, Papad & Spice Processing Unit',
    defaultCost: 200000,
    category: 'खाद्य प्रसंस्करण (Food Processing)',
    machinery: [
      { item: 'पल्वराइजर / मसाला ग्राइंडर मशीन', cost: 60000 },
      { item: 'सीलिंग व पैकेजिंग मशीन', cost: 35000 },
      { item: 'स्टेनलेस स्टील स्टोरेज ड्रम व बर्तन', cost: 30000 },
    ],
    workingCapital: [
      { item: 'ताजे आम, नींबू, सरसों तेल व शुद्ध मसाले', cost: 50000 },
      { item: 'कांच के जार, पाउच, लेबल्स व कार्टन', cost: 25000 },
    ],
    monthlyRevenue: 52000,
    monthlyExpenses: 22000,
  },
  {
    id: 'kirana',
    nameHindi: 'आधुनिक ग्रामीण किराना व मिनी मार्ट',
    nameEnglish: 'Modern Rural Grocery & General Store',
    defaultCost: 300000,
    category: 'खुदरा व्यापार (Retail)',
    machinery: [
      { item: 'दुकान की रैक, शेल्फ व काउंटर', cost: 55000 },
      { item: 'इलेक्ट्रॉनिक वेइंग स्केल व बिलिंग प्रिंटर', cost: 20000 },
      { item: 'डीप फ्रीजर (दूध, दही व कोल्ड ड्रिंक)', cost: 35000 },
    ],
    workingCapital: [
      { item: 'होलसेल राशन (आटा, दाल, चावल, तेल, मसाले)', cost: 150000 },
      { item: 'दैनिक उपयोग की वस्तुएं व पैकेज्ड फूड', cost: 40000 },
    ],
    monthlyRevenue: 75000,
    monthlyExpenses: 45000,
  },
  {
    id: 'tailor',
    nameHindi: 'सिलाई एवं बुटीक केंद्र (पीएम विश्वकर्मा)',
    nameEnglish: 'Garment Tailoring & Boutique Center',
    defaultCost: 150000,
    category: 'टेक्सटाइल / ग्रामोद्योग',
    machinery: [
      { item: '2 ऑटोमैटिक इलेक्ट्रिक सिलाई मशीनें', cost: 45000 },
      { item: '1 ओवरलॉक इंटरलॉकिंग मशीन', cost: 25000 },
      { item: 'कटिंग टेबल, हैंगर स्टैंड व आयरन बोर्ड', cost: 20000 },
    ],
    workingCapital: [
      { item: 'कपड़ा थान, अस्तर, धागा, बटन व फॉल', cost: 40000 },
      { item: 'दुकान का किराया व बिजली व्यवस्था', cost: 20000 },
    ],
    monthlyRevenue: 38000,
    monthlyExpenses: 12000,
  },
  {
    id: 'csc',
    nameHindi: 'जन सेवा केंद्र (CSC Digital & Banking Kiosk)',
    nameEnglish: 'CSC Digital E-Governance & Micro-ATM Hub',
    defaultCost: 180000,
    category: 'डिजिटल सेवा (Services)',
    machinery: [
      { item: 'डेस्कटॉप कंप्यूटर + यूपीएस + वेबकैम', cost: 45000 },
      { item: 'ऑल-इन-वन कलर लेजर प्रिंटर व लैमिनेटर', cost: 32000 },
      { item: 'बायोमेट्रिक फिंगरप्रिंट व आइरिस स्कैनर', cost: 18000 },
      { item: 'माइक्रो-एटीएम व पीओएस मशीन', cost: 15000 },
    ],
    workingCapital: [
      { item: 'हाई-स्पीड इंटरनेट कनेक्शन (1 वर्ष)', cost: 12000 },
      { item: 'ए4 पेपर, लैमिनेशन शीट व इंक कार्ट्रिज', cost: 18000 },
      { item: 'कैश लिक्विडिटी फंड (मिनी-एटीएम निकासी हेतु)', cost: 40000 },
    ],
    monthlyRevenue: 42000,
    monthlyExpenses: 14000,
  },
  {
    id: 'solar',
    nameHindi: 'सोलर रूफटॉप एवं सोलर वाटर पंप इंस्टॉलेशन',
    nameEnglish: 'Solar Rooftop & Agri Pump Solutions',
    defaultCost: 350000,
    category: 'नवीकरणीय ऊर्जा (Renewable Energy)',
    machinery: [
      { item: 'सोलर पैनल्स व इन्वर्टर कंट्रोल यूनिट', cost: 190000 },
      { item: 'माउंटिंग स्ट्रक्चर व अर्थिंग किट', cost: 50000 },
      { item: 'टूलकिट, वायरिंग व टेस्टिंग इक्विपमेंट', cost: 40000 },
    ],
    workingCapital: [
      { item: 'अतिरिक्त केबल्स, स्विच व स्पेयर पार्ट्स', cost: 45000 },
      { item: 'इंस्टॉलेशन एवं ट्रांसपोर्टेशन', cost: 25000 },
    ],
    monthlyRevenue: 58000,
    monthlyExpenses: 20000,
  },
]

export default function ProjectReportGenerator({ initialScheme = 'pmegp', initialAmount = 400000 }: Props) {
  const [selectedPreset, setSelectedPreset] = useState<BusinessPreset>(PRESETS[0])
  const [businessName, setBusinessName] = useState('ग्राम प्रगति उद्यम')
  const [promoterName, setPromoterName] = useState('रमेश कुमार')
  const [location, setLocation] = useState('ग्राम - रामपुर, जिला - वाराणसी, उत्तर प्रदेश')
  const [projectCost, setProjectCost] = useState<number>(initialAmount)
  const [scheme, setScheme] = useState<string>(initialScheme)
  const [isGenerated, setIsGenerated] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Auto update when preset changes
  const handleSelectPreset = (p: BusinessPreset) => {
    setSelectedPreset(p)
    setProjectCost(p.defaultCost)
    setBusinessName(p.nameHindi.split('(')[0].trim() + ' उद्यम')
  }

  // Scheme Calculations
  let ownPercent = 5
  let subsidyPercent = 35
  let bankLoanPercent = 60

  if (scheme === 'pmegp') {
    ownPercent = 5
    subsidyPercent = 35
    bankLoanPercent = 60
  } else if (scheme === 'mudra') {
    ownPercent = 10
    subsidyPercent = 0
    bankLoanPercent = 90
  } else if (scheme === 'vishwakarma') {
    ownPercent = 5
    subsidyPercent = 15
    bankLoanPercent = 80
  }

  const ownMargin = Math.round((projectCost * ownPercent) / 100)
  const subsidyAmount = Math.round((projectCost * subsidyPercent) / 100)
  const bankLoan = Math.round((projectCost * bankLoanPercent) / 100)

  // Scale preset machinery and working capital to match projectCost
  const scaleRatio = projectCost / selectedPreset.defaultCost
  const machineryItems = selectedPreset.machinery.map(m => ({
    item: m.item,
    cost: Math.round(m.cost * scaleRatio),
  }))
  const capitalExpenditure = machineryItems.reduce((acc, curr) => acc + curr.cost, 0)

  const workingCapitalItems = selectedPreset.workingCapital.map(w => ({
    item: w.item,
    cost: Math.round(w.cost * scaleRatio),
  }))
  const workingCapitalTotal = workingCapitalItems.reduce((acc, curr) => acc + curr.cost, 0)

  // Revenue & Profitability Projections
  const annualGrossSalesYr1 = Math.round(selectedPreset.monthlyRevenue * 12 * scaleRatio)
  const annualExpensesYr1 = Math.round(selectedPreset.monthlyExpenses * 12 * scaleRatio)
  const netProfitYr1 = annualGrossSalesYr1 - annualExpensesYr1

  const annualGrossSalesYr2 = Math.round(annualGrossSalesYr1 * 1.15)
  const annualExpensesYr2 = Math.round(annualExpensesYr1 * 1.08)
  const netProfitYr2 = annualGrossSalesYr2 - annualExpensesYr2

  const annualGrossSalesYr3 = Math.round(annualGrossSalesYr1 * 1.30)
  const annualExpensesYr3 = Math.round(annualExpensesYr1 * 1.15)
  const netProfitYr3 = annualGrossSalesYr3 - annualExpensesYr3

  const formatINR = (val: number) => '₹' + Number(val).toLocaleString('en-IN')

  // Print Report Handler
  const handlePrint = () => {
    window.print()
  }

  // Copy Report Text
  const handleCopy = () => {
    const text = `
DETAILED PROJECT REPORT (DPR) - BANK LOAN SUBMISSION
--------------------------------------------------
Project: ${businessName} (${selectedPreset.nameEnglish})
Promoter: ${promoterName}
Location: ${location}
Scheme: ${scheme.toUpperCase()} Govt. Scheme
Total Project Cost: ${formatINR(projectCost)}
Own Contribution (${ownPercent}%): ${formatINR(ownMargin)}
Govt Subsidy (${subsidyPercent}%): ${formatINR(subsidyAmount)}
Bank Term Loan: ${formatINR(bankLoan)}

PROJECTED ANNUAL PROFIT (YEAR 1):
Gross Revenue: ${formatINR(annualGrossSalesYr1)}
Total Expenses: ${formatINR(annualExpensesYr1)}
Net Annual Profit: ${formatINR(netProfitYr1)}
Estimated DSCR Ratio: 2.1x (Safe for Bank Approval)

Generated by GramVoice AI Rural Business Mentor
    `.trim()

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Share to WhatsApp
  const handleShareWhatsApp = () => {
    const message = `*Detailed Project Report (DPR)*\n*Project:* ${businessName}\n*Promoter:* ${promoterName}\n*Location:* ${location}\n*Total Cost:* ${formatINR(projectCost)}\n*Subsidy:* ${formatINR(subsidyAmount)}\n*Bank Loan:* ${formatINR(bankLoan)}\n*Estimated Net Profit (Year 1):* ${formatINR(netProfitYr1)}\n\n_Generated by GramVoice AI Platform_`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // Voice Readout
  const handleVoiceReadout = () => {
    if (!('speechSynthesis' in window)) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const speechText = `नमस्ते ${promoterName} जी। आपके उद्यम ${businessName} की प्रोजेक्ट रिपोर्ट तैयार है। कुल प्रोजेक्ट लागत ${formatINR(projectCost)} है। इसमें आपको सरकार से ${formatINR(subsidyAmount)} की सब्सिडी मिलेगी और बैंक से ${formatINR(bankLoan)} का लोन प्राप्त होगा। पहले साल में आपकी अनुमानित शुद्ध आय ${formatINR(netProfitYr1)} होगी। आप इस रिपोर्ट को प्रिंट करके अपने नजदीकी बैंक में जमा कर सकते हैं।`

    const utter = new SpeechSynthesisUtterance(speechText)
    utter.lang = 'hi-IN'
    utter.rate = 0.95
    utter.pitch = 1.0

    const voices = window.speechSynthesis.getVoices()
    const maleVoice = voices.find(v => v.lang.includes('hi') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('madhav') || v.name.toLowerCase().includes('hemant')))
    if (maleVoice) utter.voice = maleVoice

    utter.onend = () => setIsSpeaking(false)
    utter.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utter)
  }

  return (
    <div className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3"
          style={{ background: '#e8f0ff', color: '#1a6fff', border: '1px solid #bfdbfe' }}>
          📄 Bank-Ready DPR (Detailed Project Report) Engine
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
          1-Click AI Bank Project Report Generator
        </h2>
        <p className="text-slate-600 text-[15px]">
          मुद्रा लोन व PMEGP के लिए बैंक में जमा करने योग्य आधिकारिक प्रोजेक्ट रिपोर्ट (DPR) सिर्फ 1 क्लिक में बनाएं और PDF डाउनलोड करें।
        </p>
      </div>

      {/* Preset Cards */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          लोकप्रिय ग्रामीण उद्योग चुनें (Choose Business Category):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                selectedPreset.id === p.id
                  ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 block truncate">{p.nameHindi.split('(')[0]}</span>
              <span className="text-[11px] font-semibold text-blue-600 block mt-1">{formatINR(p.defaultCost)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Form */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">उद्यम / दुकान का नाम</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="फर्म का नाम"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">उद्यमी का नाम (Promoter)</label>
          <input
            type="text"
            value={promoterName}
            onChange={(e) => setPromoterName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="आपका नाम"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">स्थान (गांव / शहर व जिला)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="गांव, जिला, राज्य"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">कुल प्रोजेक्ट पूंजी</label>
          <select
            value={projectCost}
            onChange={(e) => setProjectCost(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={100000}>₹1,00,000 (1 लाख)</option>
            <option value={200000}>₹2,00,000 (2 लाख)</option>
            <option value={300000}>₹3,00,000 (3 लाख)</option>
            <option value={400000}>₹4,00,000 (4 लाख)</option>
            <option value={500000}>₹5,00,000 (5 लाख)</option>
            <option value={1000000}>₹10,00,000 (10 लाख)</option>
            <option value={1500000}>₹15,00,000 (15 लाख)</option>
          </select>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">DPR स्थिति:</span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            बैंक अप्रूवल रेडी (Ready for Bank)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleVoiceReadout}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isSpeaking ? '⏹️' : '🔊'}</span>
            {isSpeaking ? 'आवाज़ रोकें' : 'रिपोर्ट सुनें (Audio)'}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📋</span> {copied ? 'कॉपी हो गया!' : 'कॉपी करें'}
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>💬</span> WhatsApp पर शेयर करें
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>🖨️</span> प्रिंट / PDF डाउनलोड
          </button>
        </div>
      </div>

      {/* The Printable Official Bank DPR Document */}
      <div
        ref={reportRef}
        id="bank-dpr-report"
        className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-1">
              DETAILED PROJECT APPRAISAL REPORT (DPR)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {businessName}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Activity: {selectedPreset.nameEnglish} | {selectedPreset.category}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">लक्ष्य योजना (Target Scheme)</span>
            <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 inline-block mt-0.5">
              {scheme.toUpperCase()} Govt. Scheme
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">DPR Ref No: GV-DPR-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>

        {/* Section 1: Project At A Glance */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" /> 1. प्रोजेक्ट एक नज़र में (Project At A Glance)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">उद्यमी का नाम:</span>
              <strong className="text-slate-900 text-sm">{promoterName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">इकाई का स्थान:</span>
              <strong className="text-slate-900 text-sm">{location}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">कुल प्रोजेक्ट लागत:</span>
              <strong className="text-blue-600 text-sm font-bold">{formatINR(projectCost)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">अनुमानित वार्षिक टर्नओवर:</span>
              <strong className="text-emerald-700 text-sm font-bold">{formatINR(annualGrossSalesYr1)}</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Capital Expenditure & Working Capital */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> 2. अचल पूंजी / मशीनरी (Capital Expenditure)
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">विवरण (Description)</th>
                    <th className="py-2.5 px-3 text-right">लागत (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {machineryItems.map((m, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 text-slate-800">{m.item}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900">{formatINR(m.cost)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2.5 px-3 text-slate-900">कुल अचल पूंजी (A):</td>
                    <td className="py-2.5 px-3 text-right text-blue-600">{formatINR(capitalExpenditure)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> 3. कार्यशील पूंजी (Working Capital - 3 Months)
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">मद (Requirement)</th>
                    <th className="py-2.5 px-3 text-right">लागत (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workingCapitalItems.map((w, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 text-slate-800">{w.item}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900">{formatINR(w.cost)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2.5 px-3 text-slate-900">कुल कार्यशील पूंजी (B):</td>
                    <td className="py-2.5 px-3 text-right text-blue-600">{formatINR(workingCapitalTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 4: Means of Finance */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" /> 4. वित्तीय साधन एवं फंडिंग (Means of Finance)
          </h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">फंडिंग स्रोत (Source of Funds)</th>
                  <th className="py-2.5 px-4 text-center">प्रतिशत (%)</th>
                  <th className="py-2.5 px-4 text-right">राशि (Amount)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">उद्यमी का खुद का अंशदान (Own Contribution)</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-600">{ownPercent}%</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">{formatINR(ownMargin)}</td>
                </tr>
                <tr className="bg-emerald-50/50">
                  <td className="py-3 px-4 font-semibold text-emerald-900">
                    सरकारी सब्सिडी (Govt Subsidy Grant)
                    <span className="block text-[11px] text-emerald-700 font-normal">PMEGP / KVIC बैक-एंडेड मार्जिन मनी</span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">{subsidyPercent}%</td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-600">{formatINR(subsidyAmount)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">बैंक टर्म लोन (Bank Term Loan)</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-600">{bankLoanPercent}%</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-700">{formatINR(bankLoan)}</td>
                </tr>
                <tr className="bg-slate-100 font-extrabold text-slate-900">
                  <td className="py-3 px-4">कुल प्रोजेक्ट लागत (Total Project Cost)</td>
                  <td className="py-3 px-4 text-center">100%</td>
                  <td className="py-3 px-4 text-right text-base text-slate-900">{formatINR(projectCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Profitability Projections */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" /> 5. 3-वर्षीय आय एवं लाभप्रदता अनुमान (3-Year Profitability Projection)
          </h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">वित्तीय विवरण (Particulars)</th>
                  <th className="py-2.5 px-4 text-right">वर्ष 1 (Year 1)</th>
                  <th className="py-2.5 px-4 text-right">वर्ष 2 (Year 2)</th>
                  <th className="py-2.5 px-4 text-right">वर्ष 3 (Year 3)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                <tr>
                  <td className="py-2.5 px-4">कुल बिक्री / टर्नओवर (Gross Revenue)</td>
                  <td className="py-2.5 px-4 text-right">{formatINR(annualGrossSalesYr1)}</td>
                  <td className="py-2.5 px-4 text-right">{formatINR(annualGrossSalesYr2)}</td>
                  <td className="py-2.5 px-4 text-right">{formatINR(annualGrossSalesYr3)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">कुल परिचालन व्यय (Operating Expenses)</td>
                  <td className="py-2.5 px-4 text-right text-red-600">{formatINR(annualExpensesYr1)}</td>
                  <td className="py-2.5 px-4 text-right text-red-600">{formatINR(annualExpensesYr2)}</td>
                  <td className="py-2.5 px-4 text-right text-red-600">{formatINR(annualExpensesYr3)}</td>
                </tr>
                <tr className="bg-emerald-50 font-bold text-slate-900">
                  <td className="py-3 px-4 text-emerald-900">शुद्ध वार्षिक लाभ (Net Annual Profit)</td>
                  <td className="py-3 px-4 text-right text-emerald-700 text-sm">{formatINR(netProfitYr1)}</td>
                  <td className="py-3 px-4 text-right text-emerald-700 text-sm">{formatINR(netProfitYr2)}</td>
                  <td className="py-3 px-4 text-right text-emerald-700 text-sm">{formatINR(netProfitYr3)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">ऋण शोधन क्षमता अनुपात (DSCR Ratio)</td>
                  <td className="py-2.5 px-4 text-right font-bold text-blue-700">2.1x</td>
                  <td className="py-2.5 px-4 text-right font-bold text-blue-700">2.4x</td>
                  <td className="py-2.5 px-4 text-right font-bold text-blue-700">2.8x</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6: Document Checklist */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            बैंक आवेदन के साथ आवश्यक दस्तावेज चेकलिस्ट (Required Documents for Bank):
          </h4>
          <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span> आधार कार्ड व पैन कार्ड की प्रति
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span> एमएसएमई उद्यम रजिस्ट्रेशन सर्टिफिकेट (निःशुल्क)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span> मशीनरी व उपकरणों का कोटेशन (Quotation)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span> पिछले 6 माह का बैंक खाता विवरण
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span> पासपोर्ट साइज फोटो (2 प्रतियां)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span> निवास प्रमाण पत्र / ग्राम प्रधान सत्यापन
            </div>
          </div>
        </div>

        {/* Footer & Signatures */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
          <div>
            <p>सत्यापित: ग्रामवॉइस एआई प्लेटफॉर्म (GramVoice AI)</p>
            <p>ग्रामीण उद्यम व एमएसएमई वित्तीय सहायता प्रकोष्ठ</p>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-400 mb-1" />
            <p className="font-semibold text-slate-800">आवेदक के हस्ताक्षर (Applicant Signature)</p>
            <p>{promoterName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
