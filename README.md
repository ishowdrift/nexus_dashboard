# NEXUS — Premium Freelancer Business Operating System & Mini CRM

> **A serious business cockpit designed for senior freelancers and creative studios.**  
> Crafted with **Dark Editorial × Ambient Neon × Minimalist Creative** aesthetics.

---

## ✦ Core Workflow

```
LEAD → CLIENT → PROJECT → PAYMENT → COMPLETED
```

NEXUS empowers creative technologists, design engineers, and agency founders to monitor their commercial pulse within seconds:
- **What needs attention today:** Urgent focus tasks, active proposals, and approaching deadlines.
- **Which leads require follow-up:** Automated stage progression and one-click lead-to-client conversion.
- **Which projects are active:** Progress tracking, deliverables checklist, and milestone countdowns.
- **How much money is pending:** Accounts receivable, settled revenue, and overdue warnings.
- **Master calendar:** Consolidated roadmap of project deadlines, meetings, follow-ups, and invoice settlements.

---

## ✦ Key Modules & Features

### 1. Executive Dashboard / Overview
- Dynamic contextual greeting (*"Good evening, Nazmus"*) with real-time status summary.
- 4 High-level metric cards: **Active Projects**, **Total Leads**, **Pending Receivables**, and **Total Collected Revenue**.
- **Revenue Velocity Interactive Chart:** Custom smooth SVG area curve with neon gradient fill, monthly breakdown, and projected run-rate comparison.
- **Conversion Pipeline Stepper:** Real-time funnel tracking deal volume across `Lead → Contacted → Proposal → Negotiation → Won`.
- **Active Engagements Grid:** Progress indicators with glowing fills, countdown badges, and budgets.
- **Today's Focus & Upcoming Deadlines:** Interactive task checklists with micro-interactions and milestone reminders.

### 2. Lead Management Hub
- Lead fields: Name, Company, Email, Phone, Source, Service, Estimated Value, Status, Last Contact, Next Follow-up, Notes.
- Statuses: `New`, `Contacted`, `Qualified`, `Proposal Sent`, `Negotiation`, `Won`, `Lost`.
- Full CRUD: Add, edit, filter, search, sort by deal value / follow-up date.
- **1-Click Win & Convert:** Instantly convert won leads into official **Client Accounts**, **Active Projects**, and kick-off tasks with ambient celebration.

### 3. Client Directory & Detailed Accounts
- Client profiles: Contact person, company, email, direct phone, lifetime revenue, outstanding balance, billing address, and notes.
- **5-Tier Client Detail Modal:**
  1. Client Profile & Billing Details
  2. Linked Projects Overview
  3. Invoices & Transaction History
  4. Strategic Notes
  5. Activity Timeline

### 4. Project Deliverables & Milestones
- Project tracking: Client, service scope, start date, deadline, budget, amount paid, remaining balance, live progress slider (0-100%), priority tags, deliverables checklist, and tasks.
- Statuses: `Planning`, `In Progress`, `Review`, `Waiting for Client`, `Completed`, `Archived`.
- Project detail view with milestone timeline, interactive progress slider, and one-click invoice generation.

### 5. Commercial Proposals & Pitches
- Proposal metrics: Total proposed pipeline value, win acceptance rate %, and active proposals.
- Statuses: `Draft`, `Sent`, `Viewed`, `Negotiating`, `Accepted`, `Rejected`.
- **1-Click Acceptance:** Automatically starts an active production project upon approval.

### 6. Financial Ledger & Invoices
- Statuses: `Pending`, `Paid`, `Overdue`, `Partial`.
- Financial metrics: Total Revenue, Pending Amount, Overdue Amount (with warning glow), Paid Settlement Rate.
- **Invoice Voucher & Receipt Preview:** Printable branded voucher with automatic tax calculation and PDF printing support (`window.print()`).
- One-click **"Mark as Paid"** with auto-updates to project finances and client account balances.

### 7. Sprint Task Management
- Support for Title, Project, Client, Priority (`Low`, `Medium`, `High`), Due Date, Status (`To Do`, `In Progress`, `Done`), Notes.
- **Dual Views:** Seamless toggle between List View and Kanban Board.
- Filtering: By period (Due Today, Upcoming, Overdue), Priority, and Project.
- Satisfying completion micro-interactions with glowing strike-through.

### 8. Master Calendar & Agenda
- Month grid view with active event indicators.
- Event categorization without visual clutter: Project Deadlines (Amber), Invoice Settlements (Emerald), Proposal Decisions (Violet), Lead Follow-ups (Cyan), Tasks (Blue).
- Side-panel agenda detailing all items scheduled for the selected day.

### 9. Global Search Command Palette (`⌘K` / `Ctrl+K`)
- Instant fuzzy search across Leads, Clients, Projects, Proposals, Invoices, and Tasks.
- Full keyboard navigation with `↑`, `↓`, `Enter` to jump directly into the selected record.

### 10. Data Sovereignty & Settings
- Local-first architecture: all data is safely preserved in browser `localStorage`.
- One-click **Export Backup (JSON)** and **Import Backup (JSON)**.
- **Reset to Demo Data:** Instant restoration of realistic agency seed data.

---

## ✦ Visual Direction & Design Identity

- **Palette:** Deep charcoal & obsidian background (`#080A0E`, `#0E1218`) with restrained neon accents (`#10B981` Emerald, `#06B6D4` Cyan, `#8B5CF6` Violet, `#F59E0B` Amber).
- **Typography:** `Plus Jakarta Sans` for clean editorial hierarchy paired with `JetBrains Mono` for monetary figures and dates.
- **Surfaces:** Translucent glass panels with hairline borders (`rgba(255,255,255,0.06)`), subtle glows, and backdrop blurs.
- **Accessibility:** Semantic HTML elements, accessible form labels, keyboard navigation, focus rings (`focus-visible:ring-2 focus-visible:ring-emerald-400`), and `prefers-reduced-motion` compliance.

---

## ✦ Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run automated tests
npm test

# Create optimized production build
npm run build
```

---

## ✦ Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons:** Lucide React
- **Celebration / Micro-interactions:** Canvas Confetti
- **Testing:** Vitest + React Testing Library + JSDOM
- **Build Tool:** Vite 8
