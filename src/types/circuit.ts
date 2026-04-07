export type NodeType =
  | 'INPUT'
  | 'OUTPUT'
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'NAND'
  | 'NOR'
  | 'XOR'
  | 'XNOR'
  | 'FLIPFLOP_D'
  | 'CLOCK'
  | 'REGISTER';

export interface CircuitNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  label?: string;
  state?: boolean;
  internalState?: {
    q?: boolean;
    lastClock?: boolean;
    values?: boolean[];
  };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface CircuitState {
  nodes: CircuitNode[];
  connections: Connection[];
  isRunning: boolean;
  clockFrequency: number;
  clockCycle: number;
}
