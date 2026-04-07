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
