# FinSight Agent 💰

AI-powered financial coaching web app that analyzes your spending, detects risks, and provides personalized recommendations.

## ✨ Features

- **📊 Smart Dashboard** - 4-tab analytics (Overview, Insights, Goals, Trends)
- **📈 Visual Analytics** - Interactive charts (expense pie chart, cashflow trends)
- **🤖 AI Analysis** - Multi-agent system powered by Gemini 2.0 Flash
- **⚠️ Risk Detection** - Identifies overspending, high subscriptions, low savings
- **💡 Personalized Recommendations** - Actionable financial advice
- **🎯 Goal Tracking** - Monitor progress toward financial goals
- **🔔 Smart Reminders** - Bill payment and subscription alerts
- **💬 AI Chatbot** - Ask questions about your finances
- **📄 PDF Reports** - Downloadable financial summaries
- **🔒 Privacy First** - All data stored locally in browser (IndexedDB)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone or navigate to project
cd finsight

# Install dependencies
npm install

# Set up environment variables
# Create .env.local file with:
GEMINI_API_KEY=your_gemini_api_key_here

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
finsight/
├── app/
│   ├── page.tsx                 # Landing & upload page
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── settings/page.tsx        # Settings & data management
│   ├── api/gemini/route.ts      # Secure Gemini API proxy
│   └── layout.tsx               # Root layout
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── UploadCard.tsx
│   │   └── ProgressBar.tsx
│   └── dashboard/               # Dashboard-specific components
│       ├── MetricsOverview.tsx
│       ├── CashflowChart.tsx
│       ├── ExpensePieChart.tsx
│       ├── RecommendationsList.tsx
│       ├── RemindersList.tsx
│       └── IssuesList.tsx
├── lib/
│   ├── types/                   # TypeScript type definitions
│   ├── parsers/                 # File parsers (PDF, CSV, Excel)
│   ├── agent/                   # AI agent logic
│   │   ├── prompts.ts           # Agent prompt templates
│   │   ├── gemini.ts            # Gemini API client
│   │   └── orchestrator.ts     # Multi-agent orchestration
│   ├── storage.ts               # IndexedDB utilities
│   └── notifications.ts         # Browser notification helpers
└── .env.local                   # API keys (not committed)
```

---

## 🎨 How It Works

### 1. **Upload Financial Documents**
Upload PDF bank statements, CSV transaction exports, Excel files, or plain text invoices.

### 2. **AI Extraction & Parsing**
The Parser Agent extracts transaction data (dates, amounts, merchants) from your files using pattern matching and AI.

### 3. **Smart Categorization**
The Classifier Agent categorizes transactions into:
- Food & Groceries
- Dining & Restaurants  
- Transportation & Travel
- Shopping & Retail
- Entertainment & Subscriptions
- Bills & Utilities
- Healthcare & Medical
- EMI & Loans
- Income sources
- And more...

### 4. **Deep Analysis**
The Analyzer Agent identifies:
- ⚠️ **Overspending** patterns
- 💳 **High EMI burdens**
- 📉 **Cashflow risks**
- 🔔 **Unused subscriptions**
- 📊 **Spending trends**

### 5. **Personalized Recommendations**
Get actionable tips like:
- "Reduce food delivery to 2x/week — Save ₹2,000/month"
- "Cancel unused Zee5 subscription — Save ₹99/month"
- "Set up automated ₹600 weekly savings transfer"

### 6. **Smart Reminders**
Automatically scheduled reminders for:
- Bill due dates
- Savings transfers
- Budget reviews
- Subscription renewals

---

## 🔧 Configuration

### Settings Page Features

**Processing Settings**
- Auto-process uploads: Analyze files immediately after upload
- Enable reminders: Get browser notifications

**Privacy Settings**
- Server-allowed: Send data to Gemini AI (recommended)
- Browser-only: Limit AI features for maximum privacy

**Data Management**
- Export all data as JSON backup
- Import previously exported data
- Clear all data (permanent deletion)

---

## 🧠 AI Architecture

### Multi-Agent System

```
┌─────────────────┐
│  Master Agent   │ ← Coordinates all agents
└────────┬────────┘
         │
    ┌────┴────┬────────┬──────────┬──────────┐
    │         │        │          │          │
┌───▼───┐ ┌──▼──┐ ┌───▼────┐ ┌───▼────┐ ┌──▼────┐
│Parser │ │Class│ │Analyzer│ │Recommen│ │Remind │
│ Agent │ │ifer │ │ Agent  │ │der     │ │er     │
└───────┘ └─────┘ └────────┘ └────────┘ └───────┘
```

**Agent Prompts** (in `lib/agent/prompts.ts`):
- Structured JSON output schemas
- Low temperature (0.1-0.3) for deterministic results
- Context-aware prompts with user data
- Failsafe error handling

**Gemini Integration**:
- Model: `gemini-2.0-flash-exp`
- Temperature: 0.1 (deterministic)
- Max tokens: 2048-4096 per request
- Secure server-side API proxy

---

## 📊 Supported File Formats

| Format | Extensions | Features |
|--------|-----------|----------|
| **PDF** | `.pdf` | Text extraction from bank statements |
| **CSV** | `.csv` | Auto-column detection for transactions |
| **Excel** | `.xlsx`, `.xls` | Multi-sheet support |
| **Text** | `.txt` | Free-form transaction data |

**Max file size**: 10MB per file  
**Processing**: Client-side parsing (privacy-first)

---

## 🔐 Security & Privacy

✅ **LocalStorage Only**: All user data stored in browser IndexedDB  
✅ **No Server DB**: Zero data persistence on servers  
✅ **API Key Security**: Gemini key stored in server env vars  
✅ **Data Control**: Export/import/delete anytime  
✅ **Privacy Mode**: Option to disable server processing  

**What's Sent to AI?**
- Only **extracted transaction text** (not raw files)
- Categorized, anonymized data
- No personally identifiable information (if properly redacted)

**What's NOT Sent?**
- Raw file contents
- Your files themselves
- Any data if privacy mode = "browser-only"

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini 2.0 Flash
- **Storage**: IndexedDB (via idb-keyval)
- **Charts**: Recharts
- **Parsing**: pdfjs-dist, papaparse, xlsx
- **Date handling**: date-fns

---

## 📝 Usage Tips

### Best Practices

1. **Upload Recent Data**: Last 3-6 months for accurate analysis
2. **Clean Files**: Remove sensitive info before upload (optional)
3. **Regular Updates**: Upload new statements monthly
4. **Review Recommendations**: Act on high-impact tips first
5. **Enable Notifications**: Get timely bill reminders

### Troubleshooting

**Files not processing?**
- Check file format (PDF, CSV, Excel, TXT only)
- Ensure file size < 10MB
- Try uploading one file at a time

**No AI insights?**
- Verify `GEMINI_API_KEY` in `.env.local`
- Check browser console for errors
- Ensure privacy mode = "server-allowed"

**Dashboard shows no data?**
- Upload files first from homepage
- Check browser IndexedDB (DevTools > Application)
- Try clearing data and re-uploading

---

## 🚧 Roadmap

- [ ] Multi-currency support
- [ ] Budget planning tools
- [ ] Investment portfolio tracking
- [ ] Chat assistant for Q&A
- [ ] PWA support for offline usage
- [ ] Calendar integration for reminders
- [ ] PDF report generation
- [ ] Spending trend predictions

---

## 📜 License

MIT License - feel free to use for personal or commercial projects.

---

## 🙏 Acknowledgments

- **Gemini AI** by Google for powerful language models
- **Next.js** team for the amazing framework
- **Vercel** for hosting solutions
- **Open source community** for excellent libraries

---

## 📧 Support

For issues or questions:
1. Check existing issues on GitHub
2. Create new issue with details
3. Provide error logs and file samples (redacted)

---

## 🌟 Show Your Support

If this project helped you, please:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🔀 Contribute code

---

**Built with ❤️ by the FinWise team**

*Last updated: November 29, 2025*
