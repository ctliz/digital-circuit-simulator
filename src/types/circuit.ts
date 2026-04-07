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
  | 'REGISTER_8BIT'
  | 'REGISTER_16BIT'
  | 'SHIFT_REGISTER'
  | 'COUNTER_4BIT'
  | 'COUNTER_8BIT'
  | 'HALF_ADDER'
  | 'FULL_ADDER'
  | 'MUX_2_1'
  | 'MUX_4_1'
  | 'MUX_8_1'
  | 'DEMUX_1_2'
  | 'DEMUX_1_4'
  | 'DECODER_2_4'
  | 'DECODER_3_8'
  | 'ENCODER_4_2'
  | 'STATE_MACHINE'
  | 'RAM_16x4'
  | 'ROM_16x4';

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
    shiftValue?: boolean;
    stateValue?: number;
    memory?: boolean[][];
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
