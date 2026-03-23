
# New Era University Library Management System

A professional, sleek, and high-performance Library Visitor Log and Analytics System designed specifically for **New Era University**. This application provides a modern digital alternative to traditional logbooks, featuring role-based access, RFID validation simulation, and AI-powered usage insights.

## 🚀 Live Application

The application is deployed and can be accessed here:

**[https://university-library-system-ftgl5dl5s-frnztzn24-3905s-projects.vercel.app/](https://university-library-system-ftgl5dl5s-frnztzn24-3905s-projects.vercel.app/)**

## About The Project

The New Era University Library Management System is a comprehensive solution designed to modernize the way the university tracks and analyzes library usage. It replaces the outdated and inefficient paper-based logbook system with a secure, efficient, and data-driven digital platform.

### What is this for?

This system is for the students and administrators of New Era University.

*   **For Students:** It offers a quick and seamless way to check into the library, simply by using their institutional email and a simulated RFID validation.
*   **For Administrators:** It provides a powerful dashboard to monitor library traffic, understand the reasons for visits, and gain valuable insights through AI-powered analytics.

### How is it helpful?

This application is helpful in several ways:

*   **Efficiency:** It streamlines the check-in process, reducing wait times and eliminating the need for manual data entry.
*   **Data-Driven Decisions:** It provides administrators with real-time data and analytics, enabling them to make informed decisions about resource allocation, library hours, and services.
*   **Enhanced Security:** By validating institutional emails, the system ensures that only authorized personnel and students can access the library.
*   **Modern Experience:** It provides a modern and professional experience for both students and staff, reflecting the university's commitment to innovation.
*   **AI-Powered Insights:** The system uses Genkit and the Gemini API to automatically categorize and summarize the reasons for library visits, saving administrators time and effort.

## 🔑 Key Features

### Institutional Branding
- **Custom UI:** A clean, professional "Academic Blue" theme with a high-impact campus backdrop that aligns with New Era University's branding.
- **Institutional Alignment:** Features the NEU mission and values integrated into the user experience, reinforcing the university's identity.

### Secure Access Control
- **Role-Based Access:** Users can select between "Student" and "Admin" roles at login, with distinct functionalities for each.
- **Institutional Email Validation:** Access is restricted to users with a valid `@neu.edu.ph` email address, ensuring that only members of the university can use the system.
- **Simulated RFID Validation:** A futuristic and engaging RFID card validation simulation for a quick and secure entry process.

### Visitor Experience
- **Personalized Greeting:** Students are greeted with a warm "Welcome to NEU Library!" upon successful validation.
- **Digital Check-in:** A simple and quick process for students to log the reason for their visit (e.g., Research, Study, Borrowing Books), which provides valuable data for the administration.

### Administrative Control
- **Secure Admin Dashboard:** An exclusive and secure dashboard for administrators to view visitor logs and analytics.
- **AI-Powered Insights:** The system leverages Google's Genkit and the Gemini 2.5 Flash model to provide automated categorization and summarization of visitor reasons, offering deep insights into library usage patterns.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS & Shadcn/UI
- **State Management:** Zustand (Simulated Singleton)
- **AI Engine:** Google Genkit with Gemini 2.5 Flash
- **Deployment:** Vercel

## 🚀 Deployment

This project is deployed using **Vercel**.

1.  **Push to GitHub:**
    -   Ensure your project is a Git repository and has been pushed to GitHub.

2.  **Deploy with Vercel:**
    -   Install the Vercel CLI: `npm i -g vercel`.
    -   Log in to your Vercel account: `vercel login`.
    -   Run the deployment command from your project's root directory: `vercel`.
    -   Follow the prompts to link the project and deploy. Vercel will provide a live URL upon completion.
