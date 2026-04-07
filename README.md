# Digital Circuit Simulator

An interactive web-based digital logic circuit simulator. Design, build, and simulate digital circuits using a visual node-based interface with real-time signal propagation.

[English](./README.md) | [简体中文](./README_zh.md)

---

## Features

### Logic Gates
- **Basic Gates**: AND, OR, NOT, NAND, NOR, XOR, XNOR

### Input/Output
- **INPUT**: Toggleable nodes with 0/1 states
- **OUTPUT**: Display nodes for results

### Sequential Logic
- **D Flip-Flop**: With clock input and Q/Q̄ outputs
- **4-bit Register**: With load enable
- **CLOCK**: Oscillating signal generator with configurable frequency (0.1-10 Hz)

### Simulation
- Real-time signal propagation
- Configurable clock frequency
- Clock cycle counter
- Play/Pause controls

### Interface
- Drag-and-drop component placement
- Node connections via handles
- MiniMap and navigation controls
- Properties panel for node editing
- Signal monitoring panel
- Interactive tutorial for new users

---

## Tech Stack

| Tech | Purpose |
|------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Zustand | State Management |
| ReactFlow | Node Editor |
| Lucide React | Icons |

---

## Quick Start

### Requirements
- Node.js 18+
- npm 9+

### Install

```bash
git clone https://github.com/yourusername/digital-circuit-simulator.git
cd digital-circuit-simulator
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 to see the app.

### Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Usage Guide

### Basic Operations

1. **Add Components**: Click component buttons in the toolbar, then click on the canvas to place
2. **Connect Wires**: Drag from a node's output handle to another node's input handle
3. **Edit Properties**: Click a component to view/edit properties
4. **Delete Components**: Select and press Delete or click the delete button
5. **Run Simulation**: Click "Run" to start simulation
6. **Adjust Frequency**: Change clock frequency in the control panel

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Delete | Delete selected component |
| Space | Start/Pause simulation |
| +/- | Zoom in/out |

---

## Project Structure

```
digital-circuit-simulator/
├── public/
│   └── icons.svg          # Icons
├── src/
│   ├── components/        # React components
│   │   ├── Canvas.tsx         # Main canvas (ReactFlow)
│   │   ├── MonitorPanel.tsx    # Signal monitor
│   │   ├── PropertiesPanel.tsx # Property editor
│   │   ├── Toolbar.tsx         # Toolbar
│   │   └── Tutorial.tsx        # Tutorial
│   ├── i18n/               # Internationalization
│   │   ├── index.tsx           # i18n context
│   │   ├── en.json             # English translations
│   │   └── zh.json             # Chinese translations
│   ├── logic/              # Core logic
│   │   ├── circuitEngine.ts    # Circuit evaluation
│   │   └── gateDefinitions.ts  # Gate definitions
│   ├── store/              # State management
│   │   └── circuitStore.ts     # Zustand store
│   ├── types/              # TypeScript types
│   │   └── circuit.ts
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

---

## How It Works

1. Click "Run" to start simulation
2. Clock nodes toggle at the configured frequency
3. `evaluateCombinationalCircuit()` computes all node outputs
4. Sequential elements (Flip-Flops, Registers) update on clock edges
5. UI reflects updated states in real-time

---

## Contributing

Issues and Pull Requests are welcome!

---

## License

MIT License
