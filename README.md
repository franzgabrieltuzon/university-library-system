# New Era University Library Management System

A professional, high-fidelity library check-in and analytics platform designed for New Era University. This system streamlines visitor management while providing administrators with powerful AI-driven insights and data visualization.

## 🚀 Features

### For Visitors (Students & Faculty)
- **Multi-Modal Authentication**: Secure login via institutional `@neu.edu.ph` email or simulated RFID card scanning.
- **Smart Check-in**: A user-friendly interface to log visit reasons (Research, Studying, Meetings, etc.).
- **Personalized Welcome**: Dynamic greeting ("Welcome to NEU Library!") with user-specific program and college details.
- **Institutional Identity**: Sleek, professional UI featuring the NEU motto: *"Learn with purpose. Grow in faith. Serve with excellence."*

### For Administrators
- **Executive Dashboard**: Real-time analytics on library occupancy, filtered by date (Daily, Weekly, Monthly) and visitor type.
- **AI-Powered Insights**: Uses Google Genkit to analyze unstructured visitor reasons, providing automated summaries and trend categorization.
- **Advanced Log Management**: Searchable historical records with the ability to filter by college, program, or reason.
- **Data Export**: Integrated tools to print or export logs as professional PDF documents.
- **Access Control**: A centralized "Restricted Access" tool to block or unblock specific accounts for security.

## 🛠️ Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & ShadCN UI
- **Icons**: Lucide React
- **Charts**: Recharts (Data Visualization)
- **AI Engine**: Google Genkit (Gemini 2.5 Flash)
- **Animations**: Framer Motion
- **State Management**: Zustand (Simplified implementation)

## 🔐 Access Configuration
- **Admin Access**: `jcesperanza@neu.edu.ph`
- **Visitor Access**: Any valid `@neu.edu.ph` email address.

## 📖 Documentation
This project is built with a focus on **Clean Code** and **Modular Design**. 
- `src/app/admin`: Contains the dashboard, log management, and user control views.
- `src/app/visitor`: Contains the check-in and welcome screens for regular users.
- `src/ai`: Houses the Genkit flows for smart analysis.
- `src/components/ui`: Houses reusable, highly-styled ShadCN components.
- `src/lib`: Contains mock database logic and state management.

---
*Created for the New Era University Library Data Management Project.*
