# Antigravity Copywriter 🚀

**Antigravity Copywriter** is an intelligent, full-stack web application designed to help professionals transform raw, unstructured ideas into polished, highly engaging LinkedIn articles and social media posts.

Powered by the **Google Gemini API**, it provides a modular, step-by-step workflow that breaks down the writing process—from initial brainstorming and angle selection to automated proofreading and final headline generation.

---

## ✨ Key Features

### 1. Multi-Stage writing Workflow
A carefully designed 5-step UI process that removes the intimidation of a blank page:
*   **Setup:** Define your Persona (e.g., "Freelance Graphic Designer"), Preferred Tone (e.g., "Witty", "Professional"), and the Output Format (LinkedIn Post, Twitter Thread, Blog Post).
*   **Ideation:** Type a raw thought, or use the **"I'm feeling lazy"** button to generate a random provocative angle. The AI expands this into multiple specific, selectable angles.
*   **Workspace:** The main editor where the AI drafts your article based on your chosen angle. 
*   **Proofing:** Features an **Auto-Improve via Proofreader** tool. An isolated AI "Senior Editor" reviews the draft, provides an objective score, and automatically rewrites the text to fix structural flaws and increase engagement.
*   **Headlines & Final Polish:** Generates 5 scroll-stopping headlines to choose from, outputting the final polished post ready to be copied.

### 2. Precise Word Count Slider
Control the exact length of your output with a granular numeric slider ranging from 150 to 1000 words. The backend strictly enforces the AI to adhere to this limit (+/- 10 words).

### 3. Native Dark Mode & Theming
The UI features a premium design system that automatically detects your local time. If it is past 6 PM or before 6 AM, the interface seamlessly drops into a sophisticated Navy/Slate Dark Mode. You can also override this manually using the global toggle switch.

### 4. Resilient AI Model Fallback Logic
Because API quotas can be restrictive, the backend is built with a cascading fallback strategy. If the primary model (`gemini-2.5-flash`) hits a 429 Too Many Requests error, the server gracefully steps down to `gemini-1.5-flash`, and then to `gemini-3.1-flash-lite-preview`. The user is softly notified via UI toasts, ensuring zero downtime or application crashes.

### 5. Persistent Local State
Your profile configurations (Persona, Tone, Target Length) are securely saved to your browser's `localStorage` and persist across page reloads.

---

## 🛠️ Technology Stack

*   **Frontend:** React.js, Vanilla CSS (CSS Variables, Flexbox, Grid)
*   **Backend:** Java 17, Spring Boot, Spring Web
*   **AI Integration:** Google Gemini API (via direct REST/JSON interface)
*   **Build Tools:** Maven (Backend), NPM/Webpack (Frontend)

---

## 🚀 Getting Started

To run this application locally, you will need Java 17+, Node.js, and a valid Google Gemini API Key.

### 1. Backend Setup
1. Navigate to the `backend/` directory.
2. In `src/main/resources/application.properties`, configure your Gemini API key:
   ```properties
   gemini.api.key=YOUR_API_KEY_HERE
   gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/
   ```
   *(Alternatively, export `GEMINI_API_KEY` in your environment variables).*
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend API will start on `http://localhost:8080`.

### 2. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install the necessary node modules:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---
*Built with ❤️ by Antigravity*
