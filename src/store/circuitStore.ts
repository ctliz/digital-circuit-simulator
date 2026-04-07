import { create } from 'zustand';
import type { CircuitNode, Connection, NodeType } from '../types/circuit';

interface CircuitStore {
  nodes: CircuitNode[];
  connections: Connection[];
  isRunning: boolean;
  clockFrequency: number;
  clockCycle: number;
  selectedNodeId: string | null;

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
}

let nodeIdCounter = 0;
let connectionIdCounter = 0;

function generateId(prefix: string): string {
  return `${prefix}_${++nodeIdCounter}`;
}

export const useCircuitStore = create<CircuitStore>((set) => ({
  nodes: [],
  connections: [],
  isRunning: false,
  clockFrequency: 1,
  clockCycle: 0,
  selectedNodeId: null,

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
        internalState = { values: [false, false, false, false] };
        break;
      case 'COUNTER_4BIT':
        internalState = { count: 0 };
        break;
      case 'LATCH_SR':
      case 'LATCH_D':
        internalState = { q: false };
        break;
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
    }),
}));
