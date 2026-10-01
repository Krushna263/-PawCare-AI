# 🐾 PawCare AI
> **Better care. Happier companions.**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-API-8E75C4.svg)](https://ai.google.dev/)

**PawCare AI** is an all-in-one digital companion designed to simplify and elevate everyday pet care. Pet parents often juggle fragmented information across notes, calendar reminders, nutritional guidelines, and clinic contacts. PawCare AI unifies personalized multi-pet management, intelligent daily feeding schedules, seasonal weather alerts, demo veterinary appointment requests via WhatsApp, and an empathetic AI pet care assistant powered by Google Gemini.

---

## ✨ Features

### 🤖 AI Pet Care Assistant
- **Context-Aware Guidance**: Every query automatically incorporates the active companion's profile (species, breed, age, weight, activity level, allergies, and dietary restrictions) to deliver tailored everyday care advice.
- **Multimodal Visual Observation**: Upload or capture pet photos to receive non-diagnostic observational notes on posture, coat condition, and demeanor.
- **Curated Prompt Starters**: Instant one-tap access to advice on seasonal transitions, digestive comfort, safe treats, and routine immunization.
- **Offline Resilient**: Features an intelligent built-in fallback advisor that provides structured wellness recommendations even when offline or if an API key is not configured.

### 🐾 Comprehensive Pet Profiles
- **Multi-Pet Management**: Easily switch between companions (dogs, cats, small animals) or add new pet profiles with custom photos, breed details, birth dates, and weight tracking.
- **Companion Health Snapshot**: Real-time display of wellness scores, body condition scores (BCS), hydration baselines, and microchip registration records.

### 🍖 Smart Feeding Planner & Nutrition
- **Interactive Daily Timeline**: Track breakfast, lunch, and dinner meal completions with real-time progress indicators.
- **Caloric Target Estimation**: Approximate daily caloric requirements computed from pet weight and activity intensity.
- **Safe & Toxic Food Directory**: Instant searchable reference guide detailing safe foods (e.g., carrots, blueberries, boiled chicken) and critical household toxins to avoid (e.g., chocolate, xylitol, onions, grapes).

### 🌦️ Seasonal Care Guides
- **Season-Specific Wellness**: Evidence-backed recommendations for **Summer** (heatstroke prevention, asphalt temperature tests), **Monsoon** (paw hygiene, anti-fungal care, tick/flea prevention), **Winter** (joint stiffness, hypothermia prevention), and **Spring** (environmental allergen management).
- **Proactive Health Checklists**: Step-by-step preventative actions tailored to shifting weather conditions.

### 🏥 Veterinary Discovery & Appointments
- **Practitioner Directory**: Browse verified clinic profiles detailing credentials, qualifications, specialties (*General Practice*, *Dermatology*, *Clinical Nutrition*, *Dental Health*, *Orthopedics & Surgery*), locations, patient ratings, and consultation fees.
- **Real-Time Slot Indicators**: View open demo time slots and booked slots at a glance.

### 💬 WhatsApp Appointment Requests *(Demo Feature)*
- **5-Step Booking Workflow**:
  1. **Select Companion**: Choose from registered pets with consultation format (*In-person Visit* vs. *Tele-Health Video*).
  2. **Select Date**: Calendar date picker with minimum-date enforcement and quick presets.
  3. **Select Time Slot**: Interactive time slot picker showing available and booked slots.
  4. **Consultation Reason**: Categorized symptoms and health concerns with optional notes.
  5. **Review & Book**: Formats a standardized appointment request dossier.
- **Click-to-Chat Integration**: Formats and URL-encodes a message sent directly to the clinic's WhatsApp contact (`https://wa.me/`) with zero third-party software needed.
- **Request Lifecycle Tracking**: Track requests in the **My Appointments** dashboard across 4 states:
  - 🟡 `Awaiting confirmation`
  - 🟢 `Confirmed`
  - 🔴 `Cancelled`
  - ⚪ `Completed`
- **Demo Status Simulator**: Easily simulate clinic status transitions directly in the UI for demonstration purposes.

### 💉 Care Reminders & Preventative Health
- **Categorized Tasks**: Schedule and manage reminders across *Medications*, *Vaccinations*, *Grooming*, *Dental Care*, and *Veterinary Visits*.
- **Status Filtering**: Filter by upcoming vs. completed tasks, with visual badges indicating overdue care.

### 🛒 Pet Store & Companion Basket *(Demo Commerce)*
- **Curated Catalog**: Browse veterinary-recommended diets, nutritional supplements, dental chews, grooming products, and enrichment toys.
- **Global Shopping Drawer**: Slide-in cart drawer accessible from any page with real-time quantity adjustments, free shipping threshold calculations ($50+), and a simulated sandbox checkout modal.

### 📱 Responsive & Touch-Optimized
- Engineered from the ground up for desktop, tablet, and mobile displays with accessible tap targets (min 44px), smooth transitions, and zero horizontal scroll.

---

## 🖥️ Screenshots

### Home
![PawCare AI Homepage](screenshots/home.png)

### Pet Dashboard
![Pet Dashboard](screenshots/dashboard.png)

### AI Assistant
![AI Assistant](screenshots/ai-assistant.png)

### Veterinary Care & WhatsApp Booking
![Veterinary Care](screenshots/vet-care.png)

### Feeding Planner
![Feeding Planner](screenshots/feeding.png)

---

## 🏗️ How It Works

```text
       ┌────────────────────────┐
       │   Pet Parent (User)    │
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │ Create / Select Pet    │ (Stores species, breed, age,
       │ Profile in PawCare     │  weight, allergies, diet)
       └───────────┬────────────┘
                   │
         ┌─────────┴──────────────────────────────┐
         ▼                                        ▼
┌────────────────────────┐              ┌────────────────────────┐
│ Context-Aware AI Chat  │              │ Care & Routine Hub     │
│ & Photo Observation    │              │ • Feeding Timeline     │
│ (Google Gemini API via │              │ • Seasonal Warnings    │
│ Express Server Proxy)  │              │ • Care Reminders       │
└────────────────────────┘              └──────────┬─────────────┘
                                                   │
                                                   ▼
                                        ┌────────────────────────┐
                                        │ Veterinary Directory   │
                                        │ & Demo Appointment     │
                                        └──────────┬─────────────┘
                                                   │
                                                   ▼
                                        ┌────────────────────────┐
                                        │ Pre-filled WhatsApp    │
                                        │ Click-to-Chat Request  │
                                        │ (wa.me URL Generator)  │
                                        └──────────┬─────────────┘
                                                   │
                                                   ▼
                                        ┌────────────────────────┐
                                        │ "My Appointments"      │
                                        │ Lifecycle Tracking     │
                                        │ (Awaiting Confirmation)│
                                        └────────────────────────┘
```

---

## 🧠 AI Functionality

PawCare AI leverages Google's **Gemini API** via the modern `@google/genai` TypeScript SDK:

- **Server-Side Proxy Architecture**: Client applications communicate with the backend proxy (`POST /api/gemini/chat` and `POST /api/gemini/photo-observe`). The API key is never exposed to the client browser.
- **Dynamic Context Injection**: Prompts are dynamically assembled on the server with active pet metadata:
  ```text
  Pet Context: Name, Species, Breed, Age, Weight, Activity Level, Allergies, Dietary Restrictions
  ```
- **Multimodal Visual Inspection**: Evaluates pet photographs strictly for non-diagnostic observations (coat luster, posture, facial expression).
- **Graceful Fallbacks**: An intelligent internal rule-based advisor answers nutrition, hydration, and seasonal questions even when working offline or without an active API key.

> ⚠️ **Important:** PawCare AI provides general pet-care information and is not a substitute for professional veterinary care. The application should not be used to diagnose conditions or determine medication dosages.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern declarative UI component architecture |
| **TypeScript** | Static typing, interface definitions, and safety |
| **Tailwind CSS v4** | Utility-first responsive styling and typography |
| **Vite 8** | Rapid development server and optimized production bundler |
| **Express 4** | Full-stack server proxy for Gemini API calls & static hosting |
| **@google/genai (v2.4.0)** | Official Google Gen AI TypeScript SDK for Gemini models |
| **Lucide React** | Lightweight, accessible UI icon system |
| **LocalStorage** | Client-side persistence for pets, reminders, appointments, and cart |

---

## 📁 Project Structure

```text
pawcare-ai/
├── public/                     # Static assets and icons
├── src/
│   ├── assets/                 # Brand assets and images
│   ├── components/
│   │   ├── common/             # Reusable UI components
│   │   │   ├── CartDrawer.tsx          # Global slide-in companion shopping basket
│   │   │   ├── ImageWithFallback.tsx   # Image loader with graceful fallback
│   │   │   └── ToastContainer.tsx      # System feedback toasts
│   │   ├── modals/             # Global overlay modals
│   │   │   └── NewPetModal.tsx         # Create and edit companion profile modal
│   │   ├── vet/                # Dedicated veterinary module
│   │   │   ├── AppointmentBookingModal.tsx # 5-step WhatsApp booking workflow
│   │   │   ├── AppointmentCard.tsx         # Appointment card with status lifecycle
│   │   │   └── TimeSlotPicker.tsx          # Interactive time slot selector
│   │   ├── AICareAssistantView.tsx     # Gemini AI chat & photo observation view
│   │   ├── LandingPage.tsx             # Marketing overview and feature showcase
│   │   ├── Navbar.tsx                  # Responsive 3-zone header and mobile navigation
│   │   ├── PetProfileView.tsx          # Multi-pet dashboard, health score & stats
│   │   ├── PetStoreView.tsx            # Curated catalog with filterable categories
│   │   ├── RemindersView.tsx           # Care schedules and medication reminders
│   │   ├── SeasonalCareView.tsx        # Weather-specific guides & safety checklists
│   │   ├── SmartFeedingView.tsx        # Meal schedule & safe/toxic food directory
│   │   └── VetCareView.tsx             # Practitioner directory & appointment tracker
│   ├── context/
│   │   └── AppContext.tsx      # Central application state and persistent storage
│   ├── data/
│   │   └── mockData.ts         # Realistic demo data for pets, vets, and store products
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces and enum declarations
│   ├── utils/
│   │   └── whatsapp.ts         # WhatsApp message formatting & URL generation
│   ├── App.tsx                 # Root layout and view routing
│   ├── index.css               # Global styles and Tailwind imports
│   └── main.tsx                # Client application entry point
├── .env.example                # Example environment variable template
├── .gitignore                  # Git untracked file configurations
├── index.html                  # HTML entry point with metadata and Google Fonts
├── metadata.json               # Application metadata and platform capabilities
├── package.json                # Project dependencies and script definitions
├── server.ts                   # Full-stack Express server with Vite middleware
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite build and plugin configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher installed on your machine
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <YOUR_GITHUB_REPOSITORY_URL>
   cd pawcare-ai
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   Open `.env` in your editor and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   PORT=3000
   ```
   > 💡 *Note: If you run the project without a Gemini API key, PawCare AI automatically activates its built-in offline Pet Care Advisor.*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Live Demo

🔗 **[Visit PawCare AI](YOUR_DEPLOYED_URL)**  
*(Replace `YOUR_DEPLOYED_URL` with your actual deployment link on Vercel, Cloud Run, or GitHub Pages)*

---

## 🔐 Security & Best Practices

- **Never Commit Secrets**: The `.env` file is explicitly included in `.gitignore`. Never push real Gemini API keys or service credentials to GitHub.
- **Server-Side API Proxying**: All AI API calls are routed through `server.ts`. Client-side code never exposes secrets or tokens in browser network bundles.
- **Demo Phone Numbers**: WhatsApp integration uses configurable demo placeholders in `mockData.ts` to prevent unintentional messaging to real individuals.

---

## 🏥 Veterinary & AI Safety Disclaimers

1. **General Care Information Only**: PawCare AI is designed strictly as an educational and lifestyle tool for pet parents. It does not provide medical diagnoses, treatment plans, or drug dosage recommendations.
2. **Consult Qualified Professionals**: Always consult a licensed veterinarian for health evaluations, illness investigations, and emergency triage.
3. **Simulated Demo Data**: Clinic listings, practitioner contact numbers, available slots, and product checkout flows are simulated demo data for prototype evaluation.

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Multi-companion profile management with health metrics and body score calculations.
- [x] Google Gemini-powered chat assistant with active pet profile context injection.
- [x] Multimodal pet photo visual observation.
- [x] Interactive feeding timeline with calorie estimator and safe/toxic food reference directory.
- [x] Comprehensive seasonal care guides (Summer, Monsoon, Winter, Spring).
- [x] Preventative care reminders across medications, vaccines, grooming, and dental care.
- [x] Verified practitioner directory with rating, fee, and slot availability previews.
- [x] 5-step WhatsApp appointment request workflow with URL-encoded messages.
- [x] "My Appointments" tracking dashboard with 4 lifecycle states and demo status simulator.
- [x] Companion store with global slide-in shopping drawer and demo checkout modal.

### 🚧 Planned
- [ ] Official WhatsApp Business Cloud API integration for automated two-way clinic confirmations.
- [ ] Cloud-synced user authentication and multi-device database persistence (PostgreSQL / Firebase).
- [ ] Exportable pet medical history dossiers for physical clinic visits (PDF generation).
- [ ] Push notifications and calendar synchronization (Google Calendar / Apple iCal) for medications.
- [ ] Real payment gateway integration (Stripe / Razorpay) for veterinary tele-health consultations and store orders.
- [ ] Multi-language support for regional pet parents.

---

## 🤝 Contributing

Contributions make the open-source community a supportive, inspiring place to learn and build:

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## 📄 License

License to be added.

---

## 👨‍💻 Author

**Krushna Rajarwad**
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn Profile]
