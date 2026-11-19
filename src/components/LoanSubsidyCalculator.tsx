import { useState } from 'react'

interface Props {
  onGenerateReport?: (scheme: string, amount: number) => void
}

export default function LoanSubsidyCalculator({ onGenerateReport }: Props) {
  const [scheme, setScheme] = useState<'pmegp' | 'mudra' | 'vishwakarma'>('pmegp')
  const [projectCost, setProjectCost] = useState<number>(500000)
  const [category, setCategory] = useState<'special' | 'general'>('special')
  const [sector, setSector] = useState<'manufacturing' | 'services'>('manufacturing')
  const [tenureYears, setTenureYears] = useState<number>(5)

  // Calculations
  let ownMarginPercent = 10
  let subsidyPercent = 0
  let interestRate = 9.0 // standard commercial bank rate

  if (scheme === 'pmegp') {
    // PMEGP Rules:
    // Special category (Rural/SC/ST/Women/OBC/PH): 5% own, 35% rural subsidy, 25% urban
    // General category: 10% own, 25% rural subsidy, 15% urban
    if (category === 'special') {
      ownMarginPercent = 5
      subsidyPercent = 35
    } else {
      ownMarginPercent = 10
      subsidyPercent = 25
    }
    interestRate = 8.8
  } else if (scheme === 'mudra') {
    // Mudra: Shishu (<50k: 0% margin), Kishore (50k-5L: 10% margin), Tarun (5L-10L: 15% margin)
    // No direct upfront capital subsidy, but collateral-free and concessional CGTMSE
    if (projectCost <= 50000) {
      ownMarginPercent = 0
    } else if (projectCost <= 500000) {
      ownMarginPercent = 10
    } else {
      ownMarginPercent = 15
    }
    subsidyPercent = 0
    interestRate = 8.5
  } else if (scheme === 'vishwakarma') {
    // PM Vishwakarma: ₹15,000 grant toolkit + loans at 5% fixed interest
    ownMarginPercent = 5
    subsidyPercent = 15 // Effective toolkit subsidy & interest subvention
    interestRate = 5.0
  }

  const ownContribution = Math.round((projectCost * ownMarginPercent) / 100)
  const subsidyAmount = Math.round((projectCost * subsidyPercent) / 100)
  const bankLoan = Math.max(0, projectCost - ownContribution - subsidyAmount)

  // Monthly EMI Calculation: [P x R x (1+R)^N]/[(1+R)^N-1]
  const monthlyRate = interestRate / 12 / 100
  const months = tenureYears * 12
  const emi = bankLoan > 0
    ? Math.round((bankLoan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1))
    : 0

  const totalPayment = emi * months
  const totalInterest = Math.max(0, totalPayment - bankLoan)

  const formatINR = (val: number) => {
    return '₹' + Number(val).toLocaleString('en-IN')
  }

  return (
    <div className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3"
          style={{ background: '#d1fae5', color: '#059669', border: '1px solid #a7f3d0' }}>
          ✨ 100% Free Rural Govt Subsidy & EMI Calculator
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Mudra & 35% PMEGP Subsidy Calculator
        </h2>
        <p className="text-slate-600 text-[15px]">
          अपनी पूंजी, वर्ग और योजना चुनें और देखें कि सरकार से कितनी सब्सिडी मिलेगी और महीने की कितनी EMI बनेगी।
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Scheme Switcher */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2.5">
              योजना चुनें (Select Scheme)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScheme('pmegp')}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center cursor-pointer ${
                  scheme === 'pmegp'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                PMEGP
                <span className="block text-[11px] opacity-80 mt-0.5">35% सब्सिडी</span>
              </button>

              <button
                type="button"
                onClick={() => setScheme('mudra')}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center cursor-pointer ${
                  scheme === 'mudra'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                PM Mudra
                <span className="block text-[11px] opacity-80 mt-0.5">₹10 लाख तक</span>
              </button>

              <button
                type="button"
                onClick={() => setScheme('vishwakarma')}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center cursor-pointer ${
                  scheme === 'vishwakarma'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                PM विश्वकर्मा
                <span className="block text-[11px] opacity-80 mt-0.5">5% ब्याज दर</span>
              </button>
            </div>
          </div>

          {/* Project Cost Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-800">
                कुल प्रोजेक्ट लागत (Total Project Cost)
              </label>
              <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                {formatINR(projectCost)}
              </span>
            </div>
            <input
              type="range"
              min={scheme === 'vishwakarma' ? 25000 : 50000}
              max={scheme === 'vishwakarma' ? 300000 : scheme === 'mudra' ? 1000000 : 2500000}
              step={scheme === 'vishwakarma' ? 5000 : 25000}
              value={projectCost}
              onChange={(e) => setProjectCost(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>{scheme === 'vishwakarma' ? '₹25,000' : '₹50,000'}</span>
              <span>{scheme === 'vishwakarma' ? '₹3 लाख' : scheme === 'mudra' ? '₹10 लाख' : '₹25 लाख'}</span>
            </div>
          </div>

          {/* Beneficiary Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2.5">
              उद्यमी वर्ग (Beneficiary Category)
            </label>
            <div className="grid sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setCategory('special')}
                className={`p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                  category === 'special'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">विशेष वर्ग (Special / Rural)</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    35% सब्सिडी
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">महिलाएं, SC, ST, OBC, दिव्यांग, पूर्व सैनिक, ग्रामीण क्षेत्र</p>
              </button>

              <button
                type="button"
                onClick={() => setCategory('general')}
                className={`p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                  category === 'general'
                    ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">सामान्य वर्ग (General)</span>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                    25% सब्सिडी
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">पुरुष आवेदक (शहरी क्षेत्र में 15%)</p>
              </button>
            </div>
          </div>

          {/* Business Sector & Tenure */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                उद्योग प्रकार (Sector)
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="manufacturing">विनिर्माण / उत्पादन (Manufacturing)</option>
                <option value="services">सेवा / व्यापार (Service / Retail)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                लोन अवधि (Loan Tenure): {tenureYears} वर्ष
              </label>
              <input
                type="range"
                min={1}
                max={7}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>1 वर्ष</span>
                <span>7 वर्ष</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card Column */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="p-6 sm:p-7 rounded-3xl text-white relative overflow-hidden shadow-xl"
            style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a2332 50%, #0f366b 100%)' }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">अनुमानित मासिक EMI</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1 tracking-tight">
                  {formatINR(emi)} <span className="text-xs font-normal text-slate-300">/ महीना</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">ब्याज दर</span>
                <div className="text-sm font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg mt-1">
                  {interestRate}% p.a.
                </div>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-slate-400 block mb-0.5">आपकी पूंजी (Margin {ownMarginPercent}%)</span>
                <span className="text-base sm:text-lg font-bold text-white">{formatINR(ownContribution)}</span>
              </div>

              <div className="bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/30">
                <span className="text-[11px] text-emerald-300 block mb-0.5">सरकारी सब्सिडी ({subsidyPercent}%)</span>
                <span className="text-base sm:text-lg font-bold text-emerald-400">{formatINR(subsidyAmount)}</span>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-slate-400 block mb-0.5">बैंक से लोन (Loan)</span>
                <span className="text-base sm:text-lg font-bold text-white">{formatINR(bankLoan)}</span>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <span className="text-[11px] text-slate-400 block mb-0.5">कुल ब्याज ({tenureYears} वर्ष)</span>
                <span className="text-base sm:text-lg font-bold text-slate-200">{formatINR(totalInterest)}</span>
              </div>
            </div>

            {/* Subsidy Highlight Note */}
            {subsidyAmount > 0 && (
              <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-3.5 flex items-start gap-3 mb-5">
                <span className="text-xl">🎉</span>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  <strong>बधाई!</strong> {scheme === 'pmegp' ? 'PMEGP' : 'PM विश्वकर्मा'} योजना में आपको <strong>{formatINR(subsidyAmount)}</strong> की सीधी सरकारी छूट मिलेगी। यह पैसा आपको बैंक को वापस नहीं लौटाना होता!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {onGenerateReport && (
                <button
                  type="button"
                  onClick={() => onGenerateReport(scheme, projectCost)}
                  className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>📄</span> इस राशि की बैंक प्रोजेक्ट रिपोर्ट (DPR) बनाएं
                </button>
              )}

              <a
                href={
                  scheme === 'pmegp'
                    ? 'https://www.kviconline.gov.in/pmegpeportal/'
                    : scheme === 'vishwakarma'
                    ? 'https://pmvishwakarma.gov.in/'
                    : 'https://www.udyamimitra.in/'
                }
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-2xl text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 transition-all border border-white/15 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🏛️</span> आधिकारिक सरकारी पोर्टल पर आवेदन करें ↗
              </a>
            </div>
          </div>

          {/* Information Tips */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <div>
              <strong>बैंक अप्रूवल टिप:</strong> बैंक जाने से पहले आपके पास आधार कार्ड, पैन कार्ड, बैंक खाता पासबुक और कोटेशन होना चाहिए। 35% सब्सिडी 3 साल बाद आपके लोन खाते में सीधे क्रेडिट कर दी जाती है।
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
