import { create } from 'zustand';
import type { CircuitNode, Connection, NodeType } from '../types/circuit';

interface CircuitStore {
  nodes: CircuitNode[];
  connections: Connection[];
  isRunning: boolean;
  clockFrequency: number;
  clockCycle: number;
  selectedNodeId: string | null;
  signalHistory: Record<string, boolean[]>;

  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, updates: Partial<CircuitNode>) => void;
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  removeConnection: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  setIsRunning: (running: boolean) => void;
  setClockFrequency: (freq: number) => void;
  incrementClockCycle: () => void;
  toggleInputState: (id: string) => void;
  clear: () => void;
  recordSignals: (signals: Record<string, boolean>) => void;
  clearSignalHistory: () => void;
  exportCircuit: (name?: string) => void;
  importCircuit: (json: string) => boolean;
  loadExample: (nodes: CircuitNode[], connections: Omit<Connection, 'id'>[], clockFreq?: number) => void;
}

let nodeIdCounter = 0;
let connectionIdCounter = 0;

function generateId(prefix: string): string {
  return `${prefix}_${++nodeIdCounter}`;
}

export const useCircuitStore = create<CircuitStore>((set, get) => ({
  nodes: [],
  connections: [],
  isRunning: false,
  clockFrequency: 1,
  clockCycle: 0,
  selectedNodeId: null,
  signalHistory: {},

  addNode: (type, position) => {
    const id = generateId(type.toLowerCase());
    let internalState;

    switch (type) {
      case 'FLIPFLOP_D':
      case 'FLIPFLOP_JK':
      case 'FLIPFLOP_T':
        internalState = { q: false, lastClock: false };
        break;
      case 'REGISTER':
      case 'REGISTER_8BIT':
        internalState = { values: Array(8).fill(false) };
        break;
      case 'REGISTER_16BIT':
        internalState = { values: Array(16).fill(false) };
        break;
      case 'SHIFT_REGISTER':
        internalState = { values: [false, false, false, false], shiftValue: false };
        break;
      case 'COUNTER_4BIT':
        internalState = { count: 0, lastClock: false };
        break;
      case 'COUNTER_8BIT':
        internalState = { count: 0, lastClock: false };
        break;
      case 'LATCH_SR':
      case 'LATCH_D':
        internalState = { q: false };
        break;
      case 'STATE_MACHINE':
        internalState = { stateValue: 0 };
        break;
      case 'RAM_16x4':
        internalState = {
          memory: Array.from({ length: 16 }, () => [false, false, false, false]),
          lastClock: false,
        };
        break;
      case 'ROM_16x4': {
        // Pre-programmed with binary-to-Gray code conversion
        const grayRom = Array.from({ length: 16 }, (_, i) => {
          const gray = i ^ (i >> 1);
          return [
            Boolean((gray >> 0) & 1),
            Boolean((gray >> 1) & 1),
            Boolean((gray >> 2) & 1),
            Boolean((gray >> 3) & 1),
          ];
        });
        internalState = { memory: grayRom };
        break;
      }
      default:
        internalState = undefined;
    }

    const node: CircuitNode = {
      id,
      type,
      position,
      state: type === 'INPUT' || type === 'CLOCK' ? false : undefined,
      internalState,
    };
    set((state) => ({ nodes: [...state.nodes, node] }));
  },

  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      connections: state.connections.filter(
        (c) => c.source !== id && c.target !== id
      ),
    }));
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    }));
  },

  addConnection: (connection) => {
    const id = `conn_${++connectionIdCounter}`;
    set((state) => ({
      connections: [...state.connections, { ...connection, id }],
    }));
  },

  removeConnection: (id) => {
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
    }));
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  setIsRunning: (running) => set({ isRunning: running }),

  setClockFrequency: (freq) => set({ clockFrequency: freq }),

  incrementClockCycle: () =>
    set((state) => ({ clockCycle: state.clockCycle + 1 })),

  toggleInputState: (id) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, state: !n.state } : n
      ),
    }));
  },

  clear: () =>
    set({
      nodes: [],
      connections: [],
      selectedNodeId: null,
      clockCycle: 0,
      signalHistory: {},
    }),

  recordSignals: (signals) => set((state) => {
    const MAX = 80;
    const newHistory = { ...state.signalHistory };
    Object.entries(signals).forEach(([id, val]) => {
      const existing = newHistory[id] ?? [];
      newHistory[id] = [...existing, val].slice(-MAX);
    });
    return { signalHistory: newHistory };
  }),

  clearSignalHistory: () => set({ signalHistory: {} }),

  exportCircuit: (name = 'circuit') => {
    const { nodes, connections, clockFrequency } = get();
    const data = { version: 1, name, nodes, connections, clockFrequency };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${name}.json`; a.click();
    URL.revokeObjectURL(url);
  },

  importCircuit: (json) => {
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data.nodes) || !Array.isArray(data.connections)) return false;
      set({ nodes: data.nodes, connections: data.connections, clockFrequency: data.clockFrequency ?? 1, signalHistory: {}, clockCycle: 0, isRunning: false, selectedNodeId: null });
      return true;
    } catch { return false; }
  },

  loadExample: (exNodes, exConns, clockFreq = 1) => {
    // Map old IDs to new IDs
    const idMap: Record<string, string> = {};
    let counter = Date.now();
    const nodes = exNodes.map(n => {
      const newId = `${n.type.toLowerCase()}_${counter++}`;
      idMap[n.id] = newId;
      return { ...n, id: newId };
    });
    const connections = exConns.map((c, i) => ({
      ...c,
      id: `conn_${counter + i}`,
      source: idMap[c.source] ?? c.source,
      target: idMap[c.target] ?? c.target,
    }));
    set({ nodes, connections, clockFrequency: clockFreq, signalHistory: {}, clockCycle: 0, isRunning: false, selectedNodeId: null });
  },
}));
