# 📚 MyShelf - AI Powered Personal Book Tracker

**MyShelf** is not just a book listing application; it is a personal literary assistant powered by artificial intelligence. While providing access to a massive library via the Google Books API, it analyzes your reading habits using the Google Gemini API (GenAI) to offer personalized curations.

![Version](https://img.shields.io/badge/version-1.0.0-amber)
![License](https://img.shields.io/badge/license-MIT-stone)
![Tech](https://img.shields.io/badge/tech-React%2019-blue)
![AI](https://img.shields.io/badge/AI-Gemini%203%20Flash-orange)

---

## ✨ Key Features

### 🤖 AI Curator Desk
The heart of the application, acting differently from classic algorithms:
- **Semantic Analysis:** It doesn't just match genres; it connects the themes of books you've read with the subtexts of books you want to read.
- **"Why" Reasoning:** The AI provides a personalized explanation for every recommendation (e.g., *"Since you enjoyed the dystopian atmosphere in Book X, you might be interested in the philosophy of Book Y"*).

### 🔍 Smart Discovery
- Instant access to millions of books via **Google Books API** integration.
- Category-based filtering and dynamic search.
- Mobile-first user experience with a modern "Snap-carousel" design.

### 🛡️ Privacy & Architecture (Privacy-First)
- **Zero-Backend:** User data is never stored on an external server; everything resides in your browser's `localStorage`, remaining completely private to you.
- **PWA Compatible:** An installable structure via the browser that provides a native mobile app feel.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 (ES6 Modules) | Modern, fast, and declarative UI. |
| **Styling** | Tailwind CSS | Utility-first, responsive design. |
| **AI Engine** | Google Gemini 3 Flash | Advanced natural language processing via `@google/genai`. |
| **Data Source** | Google Books API | Real-time book metadata. |
| **Icons** | Lucide React | Minimalist and performant SVG icon set. |
| **Testing** | Vitest | Service and component-based unit tests. |

---

## 🚀 Installation & Setup

1. **Clone the Project:**
   ```bash
   git clone https://github.com/username/myshelf.git
   ```

2. **Required Environment Variables:**
   The application uses the `process.env.API_KEY` variable to access the Gemini API. Ensure this key is defined in your development environment.

3. **Start the App:**
   Simply open the `index.html` file in the project root using a **Live Server**. Thanks to the modern ESM structure, no additional build step is required.

---

## 🎨 Design Philosophy

The application is inspired by the "Midnight Library" theme:
- **Typography:** *Playfair Display* is used for headers to evoke a classic library aesthetic, while *Inter* is used for body text to ensure modern readability.
- **Color Palette:** Eye-friendly Amber tones and deep Stone colors (with full Dark Mode support).

---


## 📄 License

This project is protected under the MIT license. See the `LICENSE` file for more information.

---
