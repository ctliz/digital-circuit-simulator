import type { CircuitNode, Connection } from '../types/circuit';

export interface ExampleCircuit {
  id: string;
  nameKey: string;
  descKey: string;
  nodes: CircuitNode[];
  connections: Omit<Connection, 'id'>[];
  clockFrequency?: number;
}

export const examples: ExampleCircuit[] = [
  {
    id: 'and_gate',
    nameKey: 'examples.andGate',
    descKey: 'examples.andGateDesc',
    nodes: [
      { id: 'ex_in1', type: 'INPUT', position: { x: 100, y: 150 }, state: false },
      { id: 'ex_in2', type: 'INPUT', position: { x: 100, y: 250 }, state: false },
      { id: 'ex_and', type: 'AND', position: { x: 300, y: 200 } },
      { id: 'ex_out', type: 'OUTPUT', position: { x: 500, y: 200 } },
    ],
    connections: [
      { source: 'ex_in1', target: 'ex_and', sourceHandle: undefined, targetHandle: 'in1' },
      { source: 'ex_in2', target: 'ex_and', sourceHandle: undefined, targetHandle: 'in2' },
      { source: 'ex_and', target: 'ex_out', sourceHandle: undefined, targetHandle: 'in' },
    ],
  },
  {
    id: 'half_adder',
    nameKey: 'examples.halfAdder',
    descKey: 'examples.halfAdderDesc',
    nodes: [
      { id: 'ex_a', type: 'INPUT', position: { x: 100, y: 150 }, state: false },
      { id: 'ex_b', type: 'INPUT', position: { x: 100, y: 280 }, state: false },
      { id: 'ex_ha', type: 'HALF_ADDER', position: { x: 320, y: 190 } },
      { id: 'ex_sum', type: 'OUTPUT', position: { x: 520, y: 150 } },
      { id: 'ex_carry', type: 'OUTPUT', position: { x: 520, y: 260 } },
    ],
    connections: [
      { source: 'ex_a', target: 'ex_ha', sourceHandle: undefined, targetHandle: 'a' },
      { source: 'ex_b', target: 'ex_ha', sourceHandle: undefined, targetHandle: 'b' },
      { source: 'ex_ha', target: 'ex_sum', sourceHandle: 'sum', targetHandle: 'in' },
      { source: 'ex_ha', target: 'ex_carry', sourceHandle: 'carry', targetHandle: 'in' },
    ],
  },
  {
    id: 'sr_latch',
    nameKey: 'examples.srLatch',
    descKey: 'examples.srLatchDesc',
    nodes: [
      { id: 'ex_s', type: 'INPUT', position: { x: 100, y: 150 }, state: false },
      { id: 'ex_r', type: 'INPUT', position: { x: 100, y: 280 }, state: false },
      { id: 'ex_latch', type: 'LATCH_SR', position: { x: 320, y: 190 }, internalState: { q: false } },
      { id: 'ex_q', type: 'OUTPUT', position: { x: 520, y: 150 } },
      { id: 'ex_qnot', type: 'OUTPUT', position: { x: 520, y: 260 } },
    ],
    connections: [
      { source: 'ex_s', target: 'ex_latch', sourceHandle: undefined, targetHandle: 's' },
      { source: 'ex_r', target: 'ex_latch', sourceHandle: undefined, targetHandle: 'r' },
      { source: 'ex_latch', target: 'ex_q', sourceHandle: 'q', targetHandle: 'in' },
      { source: 'ex_latch', target: 'ex_qnot', sourceHandle: 'qNot', targetHandle: 'in' },
    ],
  },
  {
    id: 'd_flipflop',
    nameKey: 'examples.dFlipFlop',
    descKey: 'examples.dFlipFlopDesc',
    nodes: [
      { id: 'ex_clk', type: 'CLOCK', position: { x: 100, y: 250 }, state: false },
      { id: 'ex_d', type: 'INPUT', position: { x: 100, y: 150 }, state: false },
      { id: 'ex_dff', type: 'FLIPFLOP_D', position: { x: 320, y: 170 }, internalState: { q: false, lastClock: false } },
      { id: 'ex_q', type: 'OUTPUT', position: { x: 540, y: 140 } },
      { id: 'ex_qnot', type: 'OUTPUT', position: { x: 540, y: 240 } },
    ],
    connections: [
      { source: 'ex_d', target: 'ex_dff', sourceHandle: undefined, targetHandle: 'd' },
      { source: 'ex_clk', target: 'ex_dff', sourceHandle: undefined, targetHandle: 'clk' },
      { source: 'ex_dff', target: 'ex_q', sourceHandle: 'q', targetHandle: 'in' },
      { source: 'ex_dff', target: 'ex_qnot', sourceHandle: 'qNot', targetHandle: 'in' },
    ],
    clockFrequency: 2,
  },
  {
    id: 'counter_4bit',
    nameKey: 'examples.counter4bit',
    descKey: 'examples.counter4bitDesc',
    nodes: [
      { id: 'ex_clk', type: 'CLOCK', position: { x: 100, y: 180 }, state: false },
      { id: 'ex_rst', type: 'INPUT', position: { x: 100, y: 300 }, state: false },
      { id: 'ex_cnt', type: 'COUNTER_4BIT', position: { x: 330, y: 150 }, internalState: { count: 0, lastClock: false } },
      { id: 'ex_q0', type: 'OUTPUT', position: { x: 560, y: 100 } },
      { id: 'ex_q1', type: 'OUTPUT', position: { x: 560, y: 170 } },
      { id: 'ex_q2', type: 'OUTPUT', position: { x: 560, y: 240 } },
      { id: 'ex_q3', type: 'OUTPUT', position: { x: 560, y: 310 } },
    ],
    connections: [
      { source: 'ex_clk', target: 'ex_cnt', sourceHandle: undefined, targetHandle: 'clk' },
      { source: 'ex_rst', target: 'ex_cnt', sourceHandle: undefined, targetHandle: 'reset' },
      { source: 'ex_cnt', target: 'ex_q0', sourceHandle: 'q0', targetHandle: 'in' },
      { source: 'ex_cnt', target: 'ex_q1', sourceHandle: 'q1', targetHandle: 'in' },
      { source: 'ex_cnt', target: 'ex_q2', sourceHandle: 'q2', targetHandle: 'in' },
      { source: 'ex_cnt', target: 'ex_q3', sourceHandle: 'q3', targetHandle: 'in' },
    ],
    clockFrequency: 2,
  },
  {
    id: 'decoder_2_4',
    nameKey: 'examples.decoder24',
    descKey: 'examples.decoder24Desc',
    nodes: [
      { id: 'ex_a0', type: 'INPUT', position: { x: 100, y: 170 }, state: false },
      { id: 'ex_a1', type: 'INPUT', position: { x: 100, y: 280 }, state: false },
      { id: 'ex_dec', type: 'DECODER_2_4', position: { x: 310, y: 180 } },
      { id: 'ex_y0', type: 'OUTPUT', position: { x: 520, y: 100 } },
      { id: 'ex_y1', type: 'OUTPUT', position: { x: 520, y: 190 } },
      { id: 'ex_y2', type: 'OUTPUT', position: { x: 520, y: 280 } },
      { id: 'ex_y3', type: 'OUTPUT', position: { x: 520, y: 370 } },
    ],
    connections: [
      { source: 'ex_a0', target: 'ex_dec', sourceHandle: undefined, targetHandle: 'a0' },
      { source: 'ex_a1', target: 'ex_dec', sourceHandle: undefined, targetHandle: 'a1' },
      { source: 'ex_dec', target: 'ex_y0', sourceHandle: 'y0', targetHandle: 'in' },
      { source: 'ex_dec', target: 'ex_y1', sourceHandle: 'y1', targetHandle: 'in' },
      { source: 'ex_dec', target: 'ex_y2', sourceHandle: 'y2', targetHandle: 'in' },
      { source: 'ex_dec', target: 'ex_y3', sourceHandle: 'y3', targetHandle: 'in' },
    ],
  },
  {
    id: 'full_adder',
    nameKey: 'examples.fullAdder',
    descKey: 'examples.fullAdderDesc',
    nodes: [
      { id: 'ex_a', type: 'INPUT', position: { x: 100, y: 120 }, state: false },
      { id: 'ex_b', type: 'INPUT', position: { x: 100, y: 240 }, state: false },
      { id: 'ex_cin', type: 'INPUT', position: { x: 100, y: 360 }, state: false },
      { id: 'ex_fa', type: 'FULL_ADDER', position: { x: 320, y: 200 } },
      { id: 'ex_sum', type: 'OUTPUT', position: { x: 540, y: 170 } },
      { id: 'ex_cout', type: 'OUTPUT', position: { x: 540, y: 290 } },
    ],
    connections: [
      { source: 'ex_a', target: 'ex_fa', sourceHandle: undefined, targetHandle: 'a' },
      { source: 'ex_b', target: 'ex_fa', sourceHandle: undefined, targetHandle: 'b' },
      { source: 'ex_cin', target: 'ex_fa', sourceHandle: undefined, targetHandle: 'cin' },
      { source: 'ex_fa', target: 'ex_sum', sourceHandle: 'sum', targetHandle: 'in' },
      { source: 'ex_fa', target: 'ex_cout', sourceHandle: 'carry', targetHandle: 'in' },
    ],
  },
];
