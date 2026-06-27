# Sorting Visualizer — Divyanshu

An interactive, web-based visualizer designed to demonstrate how various classic sorting algorithms manipulate data structures in real-time. This tool helps developers and students build an intuitive understanding of time complexities and array mutations.

## 🚀 Live Demo
Check out the live application here:
[Sorting Visualizer Live](https://sorting-algorithm-analyzer.vercel.app)

---

## 🛠️ Features
- **Real-Time Visualization:** Watch arrays sort step-by-step with smooth color-coded transitions.
- **Multiple Algorithms Supported:** Includes implementations for classic sorting methods.
- **Modular Codebase:** Clean separation between algorithm logic, interface scripting, and UI styling.

---

## 📂 Project Structure

The project has been organized with an independent, root-level deployment setup for seamless hosting:

├── algorithms/               # Dedicated folder for modular sorting logic
│   ├── bubble.js             # Bubble Sort implementation
│   ├── insertion.js          # Insertion Sort implementation
│   ├── merge.js              # Merge Sort implementation
│   ├── quick.js              # Quick Sort implementation
│   └── selection.js          # Selection Sort implementation
├── index.html                # Main entry point and structural layout
├── main.js                   # Application state handler and DOM controller
├── style.css                 # Custom styling and visualizer layout
└── README.md                 # Project documentation
