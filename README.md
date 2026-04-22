# HR Workflow Designer
**Tredence Analytics – Full Stack Engineering Intern Case Study**

A visual HR workflow designer built with React + React Flow. Drag, connect, configure, and simulate HR workflows like onboarding, leave approval, and document verification.

## Quick Start
```bash
npm install
npm run dev
```
Open `http://localhost:5173`

## Features
- **5 custom node types**: Start, Task, Approval, Automated Step, End
- **Drag & drop** nodes from sidebar onto canvas
- **Node config forms** — click any node to edit its properties
- **Mock API** — `GET /automations` and `POST /simulate`
- **Sandbox panel** — test & simulate your workflow step-by-step
- **Export/Import** workflow as JSON

## Architecture
```
src/
├── api/mockApi.js              # Mock API layer
├── components/
│   ├── nodes/                  # 5 custom React Flow nodes
│   ├── forms/NodeForms.jsx     # All 5 editing forms
│   ├── Sidebar.jsx             # Node palette + export/import
│   ├── NodeFormPanel.jsx       # Right panel form host
│   └── SandboxPanel.jsx        # Simulation panel
├── hooks/useSimulate.js        # Simulation hook
├── store/workflowStore.js      # Zustand state
└── App.jsx
```

## Tech Stack
React 19 · Vite · React Flow · Zustand · Tailwind CSS v4 · Lucide React

## Design Decisions
- **Zustand** — minimal boilerplate state management
- **Single NodeForms.jsx** — all forms co-located, easy to extend
- **Topological sort** in simulation for correct execution order
- **No form library** — pure controlled components

## What I'd Add With More Time
- Undo/Redo
- Conditional edge routing (yes/no branches on Approval)
- Inline validation errors on nodes
- Auto-layout with dagre
- Persistent storage
