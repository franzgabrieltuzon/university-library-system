# New Era University Library Management System

A professional, sleek, and high-performance Library Visitor Log and Analytics System designed specifically for **New Era University**. This application provides a modern digital alternative to traditional logbooks, featuring role-based access, RFID validation simulation, and AI-powered usage insights.

## 🚀 Deployment & URL Generation
To generate your project link for submission, follow these steps:

1. **Push to GitHub:**
   - Create a new repository on GitHub.
   - Run `git init`, `git add .`, `git commit -m "Initial commit"`.
   - Link your local project to GitHub: `git remote add origin YOUR_GITHUB_REPO_URL`.
   - Push your code: `git push -u origin main`.

2. **Connect to Firebase App Hosting:**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Select your project and navigate to **App Hosting** in the left sidebar.
   - Click "Get Started" and connect your GitHub account.
   - Select your repository and click **Finish and Deploy**.
   - Firebase will provide a live URL (e.g., `https://your-app-id.web.app`) once the build is complete. **This is your live link.**

## 🔑 Key Features

### Institutional Branding
- **Custom UI:** Clean, professional "Academic Blue" theme with a high-impact campus backdrop.
- **Institutional Alignment:** Features the NEU mission and values integrated into the user experience.

### Secure Access Control
- **Role Selection:** Users can choose between "Student" and "Admin" roles at login.
- **Institutional Validation:** Only `@neu.edu.ph` emails are granted access.
- **RFID Simulation:** Futuristic RFID card validation for quick entry.

### Visitor Experience
- **Personalized Greeting:** Validated students are greeted with "Welcome to NEU Library!".
- **Digital Check-in:** Quick process to log visit reasons (Research, Study, etc.).

### Administrative Control
- **Secure Dashboard:** Exclusive analytics and logs for administrators.
- **AI Insights:** Automated categorization and summary of visitor reasons using Genkit.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS & Shadcn/UI
- **State Management:** Zustand (Simulated Singleton)
- **AI Engine:** Google Genkit with Gemini 2.5 Flash
- **Deployment:** Firebase App Hosting
