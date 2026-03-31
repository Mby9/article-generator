# LinkedIn Article Generator (AI Copywriter) 🚀

**AI Copywriter** is an intelligent, full-stack web application designed to help professionals transform raw, unstructured ideas into polished, highly engaging LinkedIn articles and social media posts.

Powered by pluggable AI providers (including **Google Gemini** and **OpenRouter**), it provides a modular, step-by-step workflow that breaks down the writing process—from initial brainstorming and angle selection to automated proofreading and final headline generation.

---

## ✨ Key Features

### 1. Multi-Stage Writing Workflow
A carefully designed 5-step UI process that removes the intimidation of a blank page:
*   **Setup:** Define your Persona (e.g., "Freelance Graphic Designer"), Preferred Tone (e.g., "Witty", "Professional"), and the Output Format (LinkedIn Post, Twitter Thread, Blog Post).
*   **Ideation:** Type a raw thought, or use the **"I'm feeling lazy"** button to generate a random provocative angle. The AI expands this into multiple specific, selectable angles.
*   **Workspace:** The main editor where the AI drafts your article based on your chosen angle. 
*   **Proofing:** Features an **Auto-Improve via Proofreader** tool. An isolated AI "Senior Editor" reviews the draft, provides an objective score, and automatically rewrites the text to fix structural flaws and increase engagement.
*   **Headlines & Final Polish:** Generates 5 scroll-stopping headlines to choose from, outputting the final polished post ready to be copied.

### 2. Pluggable AI Architecture
The backend is architected to support multiple AI providers at runtime. You can switch between Gemini and OpenRouter (e.g., GPT-4o-mini) either globally via properties or per-request from the frontend.

### 3. Precise Word Count Slider
Control the exact length of your output with a granular numeric slider ranging from 150 to 1000 words. The application passes strict length guidelines to the AI.

### 4. Native Dark Mode & Theming
The UI features a premium design system that automatically detects your local time to apply an elegant Dark Mode after hours, complete with a manual toggle override.

### 5. Persistent Local State
Your profile configurations (Persona, Tone, Target Length) are securely saved to your browser's `localStorage` and persist across page runs.

---

## 🛠️ Technology Stack

*   **Frontend:** React.js (Create React App), Vanilla CSS (CSS Variables, Flexbox, Grid), Axios
*   **Backend:** Java 17, Spring Boot, Spring Web
*   **AI Integration:** Google Gemini API, OpenRouter API
*   **Build Tools:** Maven Wrapper (Backend), NPM (Frontend)

---

## 🚀 Getting Started

To run this application locally, you will need Java 17+, Node.js, and at least one valid API Key (Gemini or OpenRouter).

### 1. Configure Environment Variables
The application reads your API keys directly from your system environment variables. Before starting the backend, set your preferred key(s):

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your-gemini-key"
$env:OPENROUTER_API_KEY="your-openrouter-key"
```

**Mac/Linux:**
```bash
export GEMINI_API_KEY="your-gemini-key"
export OPENROUTER_API_KEY="your-openrouter-key"
```
*(Note: You can configure the default active provider in `backend/src/main/resources/application.properties` using the `ai.provider=gemini` property).*

### 2. Run the Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows Command Prompt, use `mvnw.cmd spring-boot:run`)*
3. The backend API will start on `http://localhost:8080`.

### 3. Run the Frontend
1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary node modules:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. The application should automatically open in your browser at `http://localhost:3000`.

---