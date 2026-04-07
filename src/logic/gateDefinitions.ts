import type { NodeType } from '../types/circuit';

export interface GateDefinition {
  type: NodeType;
  name: string;
  inputCount: number;
  symbol: string;
  evaluate: (inputs: boolean[]) => boolean;
}

export const gateDefinitions: Record<NodeType, GateDefinition> = {
  INPUT: {
    type: 'INPUT',
    name: '输入',
    inputCount: 0,
    symbol: 'IN',
    evaluate: () => true,
  },
  OUTPUT: {
    type: 'OUTPUT',
    name: '输出',
    inputCount: 1,
    symbol: 'OUT',
    evaluate: (inputs) => inputs[0] ?? false,
  },
  AND: {
    type: 'AND',
    name: '与门',
    inputCount: 2,
    symbol: '&',
    evaluate: (inputs) => inputs.every((b) => b),
  },
  OR: {
    type: 'OR',
    name: '或门',
    inputCount: 2,
    symbol: '≥1',
    evaluate: (inputs) => inputs.some((b) => b),
  },
  NOT: {
    type: 'NOT',
    name: '非门',
    inputCount: 1,
    symbol: '1',
    evaluate: (inputs) => !inputs[0],
  },
  NAND: {
    type: 'NAND',
    name: '与非门',
    inputCount: 2,
    symbol: '&',
    evaluate: (inputs) => !inputs.every((b) => b),
  },
  NOR: {
    type: 'NOR',
    name: '或非门',
    inputCount: 2,
    symbol: '≥1',
    evaluate: (inputs) => !inputs.some((b) => b),
  },
  XOR: {
    type: 'XOR',
    name: '异或门',
    inputCount: 2,
    symbol: '=1',
    evaluate: (inputs) => inputs.filter((b) => b).length === 1,
  },
  XNOR: {
    type: 'XNOR',
    name: '同或门',
    inputCount: 2,
    symbol: '=1',
    evaluate: (inputs) => inputs.filter((b) => b).length !== 1,
  },
  FLIPFLOP_D: {
    type: 'FLIPFLOP_D',
    name: 'D触发器',
    inputCount: 2, // D and CLK
    symbol: 'D-FF',
    evaluate: () => false,
  },
  CLOCK: {
    type: 'CLOCK',
    name: '时钟',
    inputCount: 0,
    symbol: 'CLK',
    evaluate: () => false,
  },
  REGISTER: {
    type: 'REGISTER',
    name: '寄存器',
    inputCount: 5, // 4-bit data + load enable
    symbol: 'REG',
    evaluate: () => false,
  },
};
