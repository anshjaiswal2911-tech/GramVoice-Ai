// ── GramVoice AI - Business Plan & Scheme Report Generator (PDF / Print) ────

export interface BusinessPlanData {
  title: string
  category?: string
  investment?: string
  profit?: string
  roi?: string
  steps?: string[]
  equipment?: string[]
  schemes?: string[]
  notes?: string
  userName?: string
  businessLocation?: string
}

export function generateBusinessPlanPDF(data: BusinessPlanData) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to download/print your official Business Plan PDF.')
    return
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const htmlContent = `
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>GramVoice AI - Business Plan Report - ${data.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Instrument+Serif:italic&display=swap');
    
    @page {
      size: A4;
      margin: 15mm;
    }

    body {
      font-family: 'DM Sans', -apple-system, sans-serif;
      color: #0d1117;
      line-height: 1.5;
      margin: 0;
      padding: 20px;
      background: #fff;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #1a6fff;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-badge {
      background: linear-gradient(135deg, #1a6fff, #0ea5e9);
      color: #fff;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
    }

    .brand-title {
      font-size: 22px;
      font-weight: bold;
      color: #0d1117;
    }

    .brand-title span {
      color: #1a6fff;
    }

    .doc-meta {
      text-align: right;
      font-size: 12px;
      color: #64748b;
    }

    .doc-title-box {
      background: #f8fafc;
      border-left: 4px solid #1a6fff;
      padding: 16px 20px;
      border-radius: 0 12px 12px 0;
      margin-bottom: 25px;
    }

    .doc-title {
      font-family: 'Instrument Serif', serif;
      font-size: 28px;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .doc-subtitle {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }

    .metric-card {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      text-align: center;
    }

    .metric-val {
      font-size: 18px;
      font-weight: bold;
      color: #1a6fff;
      margin-bottom: 2px;
    }

    .metric-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
    }

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .steps-list {
      padding-left: 20px;
      margin: 0 0 20px 0;
    }

    .steps-list li {
      margin-bottom: 10px;
      font-size: 13px;
      color: #334155;
    }

    .tag-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .tag {
      background: #e8f0ff;
      color: #1a6fff;
      border: 1px solid #bfdbfe;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #94a3b8;
    }

    .verified-seal {
      color: #10b981;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="logo-badge">🎙️</div>
      <div class="brand-title">Gram<span>Voice</span> AI</div>
    </div>
    <div class="doc-meta">
      <div><strong>Official Business Report</strong></div>
      <div>Date: ${currentDate}</div>
      <div>Entrepreneur: ${data.userName || 'Ramesh Sharma'}</div>
    </div>
  </div>

  <div class="doc-title-box">
    <h1 class="doc-title">${data.title}</h1>
    <p class="doc-subtitle">GramVoice AI Comprehensive Rural Business Roadmap & Scheme Guide</p>
  </div>

  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-val">${data.investment || '₹50,000 - ₹1,50,000'}</div>
      <div class="metric-label">Estimated Initial Capital</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${data.profit || '₹25,000 - ₹45,000 / mo'}</div>
      <div class="metric-label">Expected Net Monthly Profit</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${data.roi || '3 - 6 Months'}</div>
      <div class="metric-label">Break-Even Period</div>
    </div>
  </div>

  ${data.equipment && data.equipment.length > 0 ? `
    <div class="section-title">🛠️ Required Equipment & Assets</div>
    <div class="tag-grid">
      ${data.equipment.map(e => `<span class="tag">✓ ${e}</span>`).join('')}
    </div>
  ` : ''}

  <div class="section-title">📋 Step-by-Step Implementation Roadmap</div>
  <ol class="steps-list">
    ${(data.steps && data.steps.length > 0 ? data.steps : [
      'MSME Udyam Registration & Trade License complete karein (Free on government portal).',
      'Local market research aur high-demand products ki list taiyaar karein.',
      'PM Mudra Yojana (Shishu Loan) ya PM Vishwakarma subsidy ke liye apply karein.',
      'WhatsApp Business catalog aur local QR code payment setup karke sales start karein.'
    ]).map(s => `<li>${s}</li>`).join('')}
  </ol>

  ${data.schemes && data.schemes.length > 0 ? `
    <div class="section-title">🏛️ Applicable Government Subsidies & Schemes</div>
    <div class="tag-grid">
      ${data.schemes.map(s => `<span class="tag" style="background:#d1fae5; color:#065f46; border-color:#a7f3d0">🏛️ ${s}</span>`).join('')}
    </div>
  ` : ''}

  <div class="footer">
    <div>GramVoice AI · Empowering Rural Indian Entrepreneurs</div>
    <div class="verified-seal">✓ Official AI Verified Roadmap</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

// ── WhatsApp Direct Share Helper ──────────────────────────────────────────
export function shareOnWhatsApp(title: string, details: string) {
  const message = `*🌟 GramVoice AI - Business Plan Summary*\n\n📌 *Topic:* ${title}\n\n${details}\n\n🔗 Generated instantly on https://gram-voice-ai.vercel.app`
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/?text=${encoded}`, '_blank')
}
