# Calculus ni Baks v1.6.0 📘✏️

_A next-gen, no-backend grade calculator for Civil Engineering students who know that "If it's easy, it's not CE."_

## 🧠 What is this?

**Calculus ni Baks** is a high-performance, mobile-first academic suite designed for engineering students. It handles complex grading systems (Base-50, Base-60, Zero-Based) and provides predictive analytics to help you reach your target grades.

---

## 📐 Comprehensive Grading Registry

The system supports a wide range of engineering subjects with specialized logic:

### 📊 Supported Subject Templates
- **Calculus Series (Distura):** 50-point adjustment (Base-50). 30/70 period ratio. 75% passing.
- **Geotechnical Engineering:** Base-60 adjustment for major exams. 40/60 period ratio. 70% passing.
- **Physics for Engineers:** Base-50 adjustment across all components. 33/67 period ratio. 75% passing.
- **Structural Theory:** Strict Zero-Based logic (Linear). 30/70 period ratio. 50% passing.
- **Thermodynamics:** Base-50 adjustment. 40/60 period ratio. 75% passing.
- **Construction Materials:** Zero-Based logic. 30/70 period ratio. 50% passing.

---

## 🧩 The Mathematical Core

### 1. **The 50-Point Adjustment (Base-50)**
$$ \text{Result} = \left( \frac{\text{Raw}}{\text{Max}} \times 50 \right) + 50 $$

### 2. **Period Aggregation**
$$ \text{Final Grade} = (\text{Midterm} \times W_m) + (\text{Finals} \times W_f) $$

### 3. **Goal Targeting (Predictive Logic)**
$$ F_{req} = \frac{T - (M \times W_m)}{W_f} $$

---

## 🧰 Modern Mobile Features

- [x] **Live Proof Engine:** Real-time LaTeX breakdown of every calculation step.
- [x] **Predictive Analytics:** Calculate exactly what score you need to pass or hit a target.
- [x] **Glassmorphism UI:** Modern, gamer-inspired aesthetic with dark mode optimization.
- [x] **Zero-Server Architecture:** 100% private, all data stays on your device (LocalStorage).
- [x] **Export Capabilities:** Save your success as a high-quality image transcript.

---

## 🏗️ Tech Stack

- **Framework:** React 18 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **Math:** KaTeX (LaTeX Rendering)
- **Persistence:** LocalStorage API

---

## 📜 License

Open source and free to use. Just don’t tell Sir Baks we automated it 😅

---

## 💬 Motivational Quote

> _"IF IT’S EASY, IT’S NOT CE."_
> – The Holy Blackboard
