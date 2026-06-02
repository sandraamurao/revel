# Revel — AI-Assisted API Debugging Tool

A developer tool that analyzes API request/response mismatches, detects inconsistencies, and explains issues using AI.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)

---

## Features

- **JSON Diff Viewer** — side-by-side comparison of request and response with color-coded mismatches
- **Diff Engine** — recursive detection of missing fields, type mismatches, and naming convention conflicts (camelCase vs snake_case)
- **AI Explanation** — human-readable explanation of issues and suggested fixes powered by Hugging Face Inference API
- **Data Mapping** — visual mapping of request fields to response fields with mismatch indicators
- **Source of Truth Toggle** — choose whether request or response is the expected format

---

## Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Markdown

**Backend**
- Node.js + Express
- Hugging Face Inference API (via router.huggingface.co)

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Hugging Face](https://huggingface.co) account with an API token

### 1. Clone the repo
```bash
git clone https://github.com/sandraamurao/revel.git
cd revel
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd server
npm install
```

### 4. Set up environment variables

Create a `.env` file in the `server/` folder:
```
HF_API_KEY=your_huggingface_token
```

Create a `.env` file in the project root:
```
VITE_API_URL=http://localhost:3000
```

### 5. Run the backend
```bash
cd server
node index.js
```

### 6. Run the frontend
```bash
# from project root
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Usage

1. Paste your API **Request JSON** and **Response JSON** into the input panel
2. Select the **Source of Truth** — which side should the other follow
3. Click **Analyze**
4. View detected issues, JSON diff, data mapping, and AI explanation

Or click **Load example** to try it with sample data.

---

## Project Structure

```
src/
  components/       # UI components
  hooks/            # Custom React hooks
  services/         # API calls
  store/            # Zustand state
  utils/            # Pure utility functions
server/
  index.js          # Express backend + AI proxy
```