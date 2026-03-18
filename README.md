# New Era University Library Management System

## Project Overview
A sophisticated, professional visitor management and analytics portal designed for the New Era University Library. The system provides a seamless check-in experience for students and faculty while offering powerful data-driven insights for administrators.

**Tagline:** "Learn with purpose. Grow in faith. Serve with excellence."

## Key Features

### 1. Advanced Authentication
- **Dual Login Methods:** Supports both simulated **RFID Validation** for physical ID cards and **Institutional Email** (Azure/Office 365) authentication.
- **Institutional Guardrails:** Restricts access exclusively to users with `@neu.edu.ph` email addresses.

### 2. Visitor Experience
- **Sleek Welcome Portal:** Personalized greetings for validated institutional users.
- **Simplified Check-in:** A clean, multi-step process for logging visit reasons (e.g., Research, Study, Meetings).
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop library kiosks.

### 3. Administrative Suite
- **Role-Based Access Control:** Specifically configured for administrative oversight.
  - **Admin User:** `jcesperanza@neu.edu.ph`
- **Real-time Analytics Dashboard:** Visual breakdown of library occupancy and usage trends.
- **AI-Powered Insights:** Integrates **Genkit (Gemini 2.5 Flash)** to analyze unstructured visitor feedback and generate trend summaries.
- **Visitor Logs:** Detailed historical records with export and print capabilities.
- **Access Control:** Centralized management for blocking/unblocking institutional accounts for security.

## Technical Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS with a professional Blue & White "Academic" theme.
- **UI Components:** Shadcn/UI (Radix UI) for accessible, high-fidelity components.
- **AI Engine:** Google Genkit with Gemini Pro.
- **State Management:** Zustand-inspired singleton store for authentication.
- **Icons:** Lucide-React.
- **Animations:** Framer Motion for sleek transitions.

## Project Structure
- `src/app/page.tsx`: Redesigned high-impact login page with campus backdrop.
- `src/app/admin/`: Administrative dashboard and management routes.
- `src/app/visitor/`: Visitor check-in and welcome workflows.
- `src/ai/`: Genkit flows for library data analysis.
- `src/components/layout/`: Unified navigation and institutional branding.

## Design Philosophy
The UI follows a "Clean Academic" aesthetic, utilizing a professional palette of **University Blue** (#2752B3) and **White**. It emphasizes clarity, institutional pride, and ease of use for the university community.
