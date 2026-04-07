import type { NodeType } from '../types/circuit';

export interface GateDefinition {
  type: NodeType;
  name: string;
  inputCount: number;
  symbol: string;
  evaluate: (inputs: boolean[]) => boolean;
  outputCount?: number;
}

export const gateDefinitions: Record<NodeType, GateDefinition> = {
  INPUT: {
    type: 'INPUT',
    name: 'Input',
    inputCount: 0,
    symbol: 'IN',
    evaluate: () => true,
  },
  OUTPUT: {
    type: 'OUTPUT',
    name: 'Output',
    inputCount: 1,
    symbol: 'OUT',
    evaluate: (inputs) => inputs[0] ?? false,
  },
  AND: {
    type: 'AND',
    name: 'AND',
    inputCount: 2,
    symbol: '&',
    evaluate: (inputs) => inputs.every((b) => b),
  },
  OR: {
    type: 'OR',
    name: 'OR',
    inputCount: 2,
    symbol: '≥1',
    evaluate: (inputs) => inputs.some((b) => b),
  },
  NOT: {
    type: 'NOT',
    name: 'NOT',
    inputCount: 1,
    symbol: '1',
    evaluate: (inputs) => !inputs[0],
  },
  NAND: {
    type: 'NAND',
    name: 'NAND',
    inputCount: 2,
    symbol: '&',
    evaluate: (inputs) => !inputs.every((b) => b),
  },
  NOR: {
    type: 'NOR',
    name: 'NOR',
    inputCount: 2,
    symbol: '≥1',
    evaluate: (inputs) => !inputs.some((b) => b),
  },
  XOR: {
    type: 'XOR',
    name: 'XOR',
    inputCount: 2,
    symbol: '=1',
    evaluate: (inputs) => inputs.filter((b) => b).length === 1,
  },
  XNOR: {
    type: 'XNOR',
    name: 'XNOR',
    inputCount: 2,
    symbol: '=1',
    evaluate: (inputs) => inputs.filter((b) => b).length !== 1,
  },
  FLIPFLOP_D: {
    type: 'FLIPFLOP_D',
    name: 'D Flip-Flop',
    inputCount: 2,
    symbol: 'D-FF',
    evaluate: () => false,
  },
  CLOCK: {
    type: 'CLOCK',
    name: 'Clock',
    inputCount: 0,
    symbol: 'CLK',
    evaluate: () => false,
  },
  REGISTER: {
    type: 'REGISTER',
    name: 'Register',
    inputCount: 5,
    symbol: 'REG',
    evaluate: () => false,
    outputCount: 4,
  },
  HALF_ADDER: {
    type: 'HALF_ADDER',
    name: 'Half Adder',
    inputCount: 2,
    symbol: 'HA',
    evaluate: (inputs) => {
      const [a, b] = inputs;
      return (a && !b) || (!a && b);
    },
    outputCount: 2,
  },
  FULL_ADDER: {
    type: 'FULL_ADDER',
    name: 'Full Adder',
    inputCount: 3,
    symbol: 'FA',
    evaluate: (inputs) => {
      const [a, b, cin] = inputs;
      return (a && !b && !cin) || (!a && b && !cin) || (!a && !b && cin) || (a && b && cin);
    },
    outputCount: 2,
  },
  MUX_2_1: {
    type: 'MUX_2_1',
    name: '2-1 MUX',
    inputCount: 3,
    symbol: 'MUX',
    evaluate: (inputs) => {
      const [d0, d1, sel] = inputs;
      return (!sel && d0) || (sel && d1);
    },
  },
  MUX_4_1: {
    type: 'MUX_4_1',
    name: '4-1 MUX',
    inputCount: 6,
    symbol: 'MUX',
    evaluate: (inputs) => {
      const [d0, d1, d2, d3, sel0, sel1] = inputs;
      const sel = (sel1 ? 2 : 0) + (sel0 ? 1 : 0);
      return [d0, d1, d2, d3][sel];
    },
  },
  DEMUX_1_2: {
    type: 'DEMUX_1_2',
    name: '1-2 DEMUX',
    inputCount: 2,
    symbol: 'DEMUX',
    evaluate: (inputs) => {
      const [d, sel] = inputs;
      return !sel && d;
    },
    outputCount: 2,
  },
  DECODER_2_4: {
    type: 'DECODER_2_4',
    name: '2-4 Decoder',
    inputCount: 2,
    symbol: 'DEC',
    evaluate: () => false,
    outputCount: 4,
  },
  DECODER_3_8: {
    type: 'DECODER_3_8',
    name: '3-8 Decoder',
    inputCount: 3,
    symbol: 'DEC',
    evaluate: () => false,
    outputCount: 8,
  },
  ENCODER_4_2: {
    type: 'ENCODER_4_2',
    name: '4-2 Encoder',
    inputCount: 4,
    symbol: 'ENC',
    evaluate: (inputs) => {
      const [d0, d1, d2, d3] = inputs;
      if (d3) return (d0 || d1 || d2) ? false : true;
      if (d2) return !d0 && !d1;
      if (d1) return !d0;
      return false;
    },
    outputCount: 2,
  },
  LATCH_SR: {
    type: 'LATCH_SR',
    name: 'SR Latch',
    inputCount: 2,
    symbol: 'SR',
    evaluate: () => false,
  },
  LATCH_D: {
    type: 'LATCH_D',
    name: 'D Latch',
    inputCount: 2,
    symbol: 'D-L',
    evaluate: () => false,
  },
  FLIPFLOP_JK: {
    type: 'FLIPFLOP_JK',
    name: 'JK Flip-Flop',
    inputCount: 3,
    symbol: 'JK-FF',
    evaluate: () => false,
  },
  FLIPFLOP_T: {
    type: 'FLIPFLOP_T',
    name: 'T Flip-Flop',
    inputCount: 2,
    symbol: 'T-FF',
    evaluate: () => false,
  },
  COUNTER_4BIT: {
    type: 'COUNTER_4BIT',
    name: '4-bit Counter',
    inputCount: 2,
    symbol: 'CNT',
    evaluate: () => false,
    outputCount: 4,
  },
  REGISTER_8BIT: {
    type: 'REGISTER_8BIT',
    name: '8-bit Register',
    inputCount: 9,
    symbol: 'REG8',
    evaluate: () => false,
    outputCount: 8,
  },
  REGISTER_16BIT: {
    type: 'REGISTER_16BIT',
    name: '16-bit Register',
    inputCount: 17,
    symbol: 'REG16',
    evaluate: () => false,
    outputCount: 16,
  },
  SHIFT_REGISTER: {
    type: 'SHIFT_REGISTER',
    name: 'Shift Register',
    inputCount: 3,
    symbol: 'SHIFT',
    evaluate: () => false,
    outputCount: 4,
  },
  COUNTER_8BIT: {
    type: 'COUNTER_8BIT',
    name: '8-bit Counter',
    inputCount: 2,
    symbol: 'CNT8',
    evaluate: () => false,
    outputCount: 8,
  },
  MUX_8_1: {
    type: 'MUX_8_1',
    name: '8-1 MUX',
    inputCount: 10,
    symbol: 'MUX',
    evaluate: (inputs) => {
      const d = inputs.slice(0, 8);
      const sel0 = inputs[8] ? 1 : 0;
      const sel1 = inputs[9] ? 2 : 0;
      const sel = sel0 + sel1;
      return d[sel];
    },
  },
  DEMUX_1_4: {
    type: 'DEMUX_1_4',
    name: '1-4 DEMUX',
    inputCount: 3,
    symbol: 'DEMUX',
    evaluate: () => false,
    outputCount: 4,
  },
  STATE_MACHINE: {
    type: 'STATE_MACHINE',
    name: 'State Machine',
    inputCount: 2,
    symbol: 'FSM',
    evaluate: () => false,
  },
  RAM_16x4: {
    type: 'RAM_16x4',
    name: 'RAM 16×4',
    inputCount: 10,
    symbol: 'RAM',
    evaluate: () => false,
    outputCount: 4,
  },
  ROM_16x4: {
    type: 'ROM_16x4',
    name: 'ROM 16×4',
    inputCount: 5,
    symbol: 'ROM',
    evaluate: () => false,
    outputCount: 4,
  },
};

export function getHalfAdderOutputs(inputs: boolean[]): { sum: boolean; carry: boolean } {
  const [a, b] = inputs;
  return {
    sum: (a && !b) || (!a && b),
    carry: a && b,
  };
}

export function getFullAdderOutputs(inputs: boolean[]): { sum: boolean; carry: boolean } {
  const [a, b, cin] = inputs;
  const sum = (a && !b && !cin) || (!a && b && !cin) || (!a && !b && cin) || (a && b && cin);
  const carry = (a && b) || (a && cin) || (b && cin);
  return { sum, carry };
}

export function getMux2_1Output(inputs: boolean[]): boolean {
  const [d0, d1, sel] = inputs;
  return (!sel && d0) || (sel && d1);
}

export function getMux4_1Output(inputs: boolean[]): boolean {
  const [d0, d1, d2, d3, sel0, sel1] = inputs;
  const sel = (sel1 ? 2 : 0) + (sel0 ? 1 : 0);
  return [d0, d1, d2, d3][sel];
}

export function getDemux1_2Outputs(inputs: boolean[]): { y0: boolean; y1: boolean } {
  const [d, sel] = inputs;
  return {
    y0: !sel && d,
    y1: sel && d,
  };
}

export function getDecoder2_4Outputs(inputs: boolean[]): boolean[] {
  const [a0, a1] = inputs;
  return [
    !a0 && !a1,
    !a0 && a1,
    a0 && !a1,
    a0 && a1,
  ];
}

export function getDecoder3_8Outputs(inputs: boolean[]): boolean[] {
  const [a0, a1, a2] = inputs;
  const binary = (a2 ? 4 : 0) + (a1 ? 2 : 0) + (a0 ? 1 : 0);
  return Array.from({ length: 8 }, (_, i) => i === binary);
}

export function getEncoder4_2Outputs(inputs: boolean[]): { y0: boolean; y1: boolean } {
  const [d0, d1, d2, d3] = inputs;
  if (d3) return { y0: true, y1: true };
  if (d2) return { y0: false, y1: true };
  if (d1) return { y0: true, y1: false };
  if (d0) return { y0: false, y1: false };
  return { y0: false, y1: false };
}

export const sequentialGateDefinitions: Record<string, { name: string; symbol: string }> = {
  LATCH_SR: { name: 'SR Latch', symbol: 'SR' },
  LATCH_D: { name: 'D Latch', symbol: 'D-L' },
  FLIPFLOP_JK: { name: 'JK Flip-Flop', symbol: 'JK-FF' },
  FLIPFLOP_T: { name: 'T Flip-Flop', symbol: 'T-FF' },
  COUNTER_4BIT: { name: '4-bit Counter', symbol: 'CNT' },
};

export function getSRLatchOutputs(s: boolean, r: boolean, currentQ: boolean): { q: boolean; qNot: boolean } {
  if (s && r) {
    return { q: false, qNot: false };
  }
  if (s) {
    return { q: true, qNot: false };
  }
  if (r) {
    return { q: false, qNot: true };
  }
  return { q: currentQ, qNot: !currentQ };
}

export function getDLatchOutput(d: boolean, enable: boolean, currentQ: boolean): { q: boolean; qNot: boolean } {
  if (enable) {
    return { q: d, qNot: !d };
  }
  return { q: currentQ, qNot: !currentQ };
}

export function getJKFlipFlopOutputs(j: boolean, k: boolean, clk: boolean, currentQ: boolean, lastClk: boolean): { q: boolean; qNot: boolean } {
  const risingEdge = clk && !lastClk;
  if (risingEdge) {
    if (j && k) {
      return { q: !currentQ, qNot: currentQ };
    }
    if (j) {
      return { q: true, qNot: false };
    }
    if (k) {
      return { q: false, qNot: true };
    }
  }
  return { q: currentQ, qNot: !currentQ };
}

export function getTFlipFlopOutput(t: boolean, clk: boolean, currentQ: boolean, lastClk: boolean): { q: boolean; qNot: boolean } {
  const risingEdge = clk && !lastClk;
  if (risingEdge && t) {
    return { q: !currentQ, qNot: currentQ };
  }
  return { q: currentQ, qNot: !currentQ };
}

export function getCounter4BitOutput(clk: boolean, lastClk: boolean, currentCount: number): number {
  const risingEdge = clk && !lastClk;
  if (risingEdge) {
    return (currentCount + 1) % 16;
  }
  return currentCount;
}
