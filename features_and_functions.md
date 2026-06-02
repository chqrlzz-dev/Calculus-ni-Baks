# Calculus ni Baks - Modern Mobile-First UI (Full Specification)

This document outlines the completely redesigned UI/UX and technical architecture of the **Calculus ni Baks** application, optimized for modern high-end mobile devices and engineering student workflows.

---

## 🚀 Modern Mobile Features

### 1. Unified Navigation System
- **Floating Command Bar:** Futuristic bottom navigation providing instant access to Calculation, Formulas (Rules), Goal Tracking, and the Global Menu.
- **Drawer-First Configuration:** All complex settings (Weights, Quiz Counts, Course Management) are housed in high-performance bottom sheets (Drawers) to keep the workspace clean.
- **Academic Ecosystem:** Integrated links to specialized pages (About, FAQ, Math Guide, Feedback) via the global menu.

### 2. High-Performance Grade Engine
- **Predictive Analytics:** The "Goal" tool uses reverse-engineering formulas to calculate exactly what score is needed in the finals to achieve a target grade.
- **Glassmorphism UI:** Sticky headers with backdrop-blur provide real-time overall grade and GPE tracking without obscuring content.
- **Dynamic Quiz Scaling:** Supports real-time addition/removal of quiz fields (1-5) with instant array re-balancing.

### 3. Logic & Documentation
- **Integrated Math Guide:** A dedicated "Calculations" page and "Rules" tab provide full mathematical proofs using KaTeX.
- **Step-by-Step Breakdown:** The "Live Calculation Preview" drawer shows every intermediate step of the 50-point adjustment and period aggregation.

---

## 🎨 UI/UX Redesign Principles (GEMINI.md)

### Visual Identity
- **Gamer-Modern Aesthetic:** Near-black backgrounds (`#0a0a0a`) with primary violet accents (`#8b5cf6`) and glowing status indicators.
- **Extreme Legibility:** Usage of `font-black` (900 weight) for all critical data points and `font-mono` for mathematical values.
- **Tactile Feedback:** 32px corner radiuses, large touch targets (min 56px), and subtle scale animations on interaction.

### Privacy & Trust
- **Zero-Server Architecture:** 100% of data processing and storage occurs on the client device.
- **Local Persistence:** Automatic synchronization with LocalStorage ensures data survives browser refreshes.

---

## 🔧 Technical Component Map

| Component | Responsibility | Key Features |
| :--- | :--- | :--- |
| `ModernGradeCalculator` | Core Orchestrator | Tab management, global state, weight logic, and drawer handling. |
| `GradingPeriod` | Period Context | Sectioned layout for Quizzes, Exams, and Participation. |
| `ScoreInput` | Input Atom | High-precision numeric fields with built-in total/raw score support. |
| `FormulasPanel` | Educational View | Visual breakdown of the 50-point adjustment logic. |
| `CalculationPreview` | Math Proof | Step-by-step mathematical trace of current results. |
| `CourseSelector` | Persistence | Subject switching and CRUD operations. |

---

### 🚀 Discord-Powered Ecosystem
- **Instant Feedback:** All user reports and star ratings are transmitted via Discord Webhooks for real-time developer review.
- **Global Crashlytics:** Unhandled runtime errors and promise rejections are automatically logged to a secure Discord channel for proactive debugging.

---

## 📐 The Master Formula Registry

The system streamlines core engineering subjects with specialized mathematical logic:

### Subject Templates & Logic
- **Calculus Series (Distura):** 50-point adjustment (Base-50). 30/70 period ratio. 75% passing.
- **Structural Theory (Cabanus):** Strict Zero-Based logic (Linear). 30/70 period ratio. 60% passing.
- **Construction Materials (Borbon):** Zero-Based logic. 30/70 period ratio. 50% passing.

### Standard Adjustment Formula (Base-50)
$$ \text{Adjusted Score} = \left( \frac{\text{Raw Score}}{\text{Max Score}} \times 50 \right) + 50 $$

### Target Projection Logic
$$ F_{req} = \frac{\text{Target} - (\text{Midterm} \times W_m)}{W_f} $$
