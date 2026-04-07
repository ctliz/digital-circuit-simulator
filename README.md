# Digital Circuit Simulator

An interactive web-based digital logic circuit simulator. Design, build, and simulate digital circuits using a visual node-based interface with real-time signal propagation.

Based on **Mano's Digital Design** textbook curriculum.

[English](./README.md) | [简体中文](./README_zh.md)

---

## Features

### Basic Gates
- **AND**, **OR**, **NOT**, **NAND**, **NOR**, **XOR**, **XNOR**

### Input/Output
- **INPUT**: Toggleable nodes with 0/1 states
- **OUTPUT**: Display nodes for results

### Arithmetic Circuits (Ch. 4)
- **Half Adder**: A + B → Sum, Carry
- **Full Adder**: A + B + Cin → Sum, Carry

### Multiplexers / Demultiplexers (Ch. 4)
- **2-1 MUX**: 2 inputs, 1 select, 1 output
- **4-1 MUX**: 4 inputs, 2 selects, 1 output
- **1-2 DEMUX**: 1 input, 1 select, 2 outputs

### Encoders / Decoders (Ch. 4)
- **2-4 Decoder**: 2 inputs, 4 outputs
- **3-8 Decoder**: 3 inputs, 8 outputs
- **4-2 Encoder**: 4 inputs, 2 outputs

### Sequential Logic (Ch. 5)
- **D Flip-Flop**: With clock input and Q/Q̄ outputs
- **JK Flip-Flop**: J, K inputs with clock
- **T Flip-Flop**: Toggle flip-flop with clock
- **SR Latch**: Set-Reset latch
- **D Latch**: Data latch with enable
- **Register**: 4-bit register with load enable
- **8-bit Register**: 8-bit register with load enable
- **16-bit Register**: 16-bit register with load enable
- **Shift Register**: 4-bit shift register with serial input
- **4-bit Counter**: Binary counter with reset
- **8-bit Counter**: Binary counter with reset
- **State Machine**: Finite state machine component
- **Clock**: Oscillating signal generator (0.1-10 Hz)

### Truth Table Generator
- Automatically generates truth tables for combinational circuits
- Supports up to 8 inputs

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
- Interactive tutorial
- **K-Map visualization** for Boolean simplification
- **Multi-language support** (English/Chinese)

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
git clone https://github.com/ctliz/digital-circuit-simulator.git
cd digital-circuit-simulator
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
npm run preview
```

---

## Usage Guide

### Basic Operations

1. **Add Components**: Click component buttons in the toolbar, then click on the canvas
2. **Connect Wires**: Drag from output handle to input handle
3. **Edit Properties**: Click a component to view/edit properties
4. **Delete Components**: Select and press Delete or click the delete button
5. **Run Simulation**: Click "Run" to start simulation
6. **Generate Truth Table**: Click the table icon at bottom-left
7. **K-Map Visualization**: Click the grid icon for K-map simplification

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
├── src/
│   ├── components/        # React components
│   │   ├── Canvas.tsx         # Main canvas
│   │   ├── MonitorPanel.tsx   # Signal monitor
│   │   ├── PropertiesPanel.tsx # Property editor
│   │   ├── Toolbar.tsx        # Toolbar
│   │   ├── Tutorial.tsx        # Tutorial
│   │   ├── TruthTablePanel.tsx # Truth table generator
│   │   └── KMapPanel.tsx      # K-map visualization
│   ├── i18n/               # Internationalization
│   ├── logic/              # Core logic
│   │   ├── circuitEngine.ts    # Circuit evaluation
│   │   └── gateDefinitions.ts   # Gate definitions
│   ├── store/              # State management
│   └── types/              # TypeScript types
```

---

## Textbook Reference

This project follows the curriculum of **Mano's Digital Design**:

| Chapter | Topic | Status |
|---------|-------|--------|
| Ch 2 | Boolean Algebra & Logic Gates | ✅ |
| Ch 3 | Combinational Logic | ✅ |
| Ch 4 | Combinational Functions | ✅ |
| Ch 5 | Sequential Logic | Partial |
| Ch 6 | Registers & Counters | Planned |

---

## Contributing

Issues and Pull Requests are welcome!

---

## License

MIT License
