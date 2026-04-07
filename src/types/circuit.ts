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
  | 'FLIPFLOP_JK'
  | 'FLIPFLOP_T'
  | 'LATCH_SR'
  | 'LATCH_D'
  | 'CLOCK'
  | 'REGISTER'
  | 'COUNTER_4BIT'
  | 'HALF_ADDER'
  | 'FULL_ADDER'
  | 'MUX_2_1'
  | 'MUX_4_1'
  | 'DEMUX_1_2'
  | 'DECODER_2_4'
  | 'DECODER_3_8'
  | 'ENCODER_4_2';

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
    count?: number;
    lastJ?: boolean;
    lastK?: boolean;
    lastT?: boolean;
    s?: boolean;
    r?: boolean;
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
