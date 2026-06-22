# Cover Letter AI 📝🤖

Cover Letter AI is a modern, AI-powered web application that helps job seekers generate highly tailored, professional, and compelling cover letters. By analyzing a candidate's resume and a target job description, the application crafts personalized cover letters that match key skills with job requirements, adjust to the desired tone, and optimize for Applicant Tracking Systems (ATS).

---

## 🌟 Key Features

- **📄 Resume Analyzer**: Upload or paste resume content to extract key achievements, technical skills, and experiences.
- **💼 Job Description Parser**: Automatically scans job posts to identify critical responsibilities, required qualifications, and ATS keywords.
- **🎭 Tone & Style Selector**: Adjust the tone of the cover letter (e.g., Professional, Enthusiastic, Confident, Concise, Creative) to match the company culture.
- **⚡ AI-Powered Tailoring**: Integrates with cutting-edge AI models (such as Google Gemini and OpenAI) to draft cover letters that highlight the strongest matches between your experience and the job role.
- **⬇️ Premium Exporting**: Export cover letters directly to PDF with clean, professional layouts, or copy to the clipboard with one click.
- **🗂️ History & Workspace**: Store previous drafts and cover letters, allowing you to return, revise, and customize them later.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Premium, responsive Vanilla CSS with a customized design system (glassmorphism, smooth micro-animations, tailored dark/light modes)
- **State Management**: React Context & Hooks
- **Linter**: ESLint 9

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (LTS version) and npm installed:
```bash
node -v # Recommended: Node 20.x or higher
npm -v
```

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd cover_letter
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```env
   # API Keys for AI generation (e.g., Gemini or OpenAI)
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Development Server

Run the development server locally:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

### Build and Deployment

To build the application for production:
```bash
npm run build
```

To start the production server locally:
```bash
npm run start
```

---

## 📂 Project Structure

```text
cover_letter/
├── public/              # Static assets (images, icons, fonts)
├── src/
│   ├── app/             # Next.js App Router (pages, layouts, and API routes)
│   │   ├── layout.tsx   # Global layout wrapper
│   │   ├── page.tsx     # Main application interface
│   │   ├── globals.css  # Global styles and design system variables
│   │   └── api/         # Backend API routes (AI generation endpoints)
│   ├── components/      # Reusable UI components (buttons, input forms, previews)
│   ├── utils/           # Helper utilities (parsing, PDF export, API wrappers)
│   └── hooks/           # Custom React hooks (state management, API handling)
├── package.json         # Project scripts and dependencies
└── tsconfig.json        # TypeScript configuration
```

---

## 🎨 Design System

Cover Letter AI uses a premium, modern design system built with custom Vanilla CSS:
- **Color Palette**: Dark slate background, vibrant indigo accents, and soft lavender borders.
- **Glassmorphism**: Soft background blurs and subtle borders for a clean, futuristic look.
- **Micro-animations**: Smooth hover transitions, scale-up clicks, and loading state animations to improve user interactivity.
- **Typography**: Clean, highly readable sans-serif typography designed for professional text parsing and generation.
