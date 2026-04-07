import type { CircuitNode, Connection, NodeType } from '../types/circuit';
import { 
  gateDefinitions,
  getHalfAdderOutputs,
  getFullAdderOutputs,
  getMux2_1Output,
  getMux4_1Output,
  getDemux1_2Outputs,
  getDecoder2_4Outputs,
  getDecoder3_8Outputs,
  getEncoder4_2Outputs,
} from './gateDefinitions';

export function evaluateCombinationalCircuit(
  nodes: CircuitNode[],
  connections: Connection[]
): Map<string, boolean> {
  const nodeMap = new Map<string, CircuitNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const outputValues = new Map<string, boolean>();
  const computedNodes = new Set<string>();

  function getInputValues(nodeId: string, handle?: string): boolean[] {
    const incomingConnections = connections.filter(
      (c) => c.target === nodeId && (handle ? c.targetHandle === handle : true)
    );
    const results: boolean[] = [];
    
    if (!handle) {
      incomingConnections.forEach((c) => {
        if (!outputValues.has(c.source)) {
          computeNode(c.source);
        }
        results.push(outputValues.get(c.source) ?? false);
      });
      return results;
    }
    
    const conn = incomingConnections[0];
    if (conn) {
      if (!outputValues.has(conn.source)) {
        computeNode(conn.source);
      }
      return [outputValues.get(conn.source) ?? false];
    }
    return [false];
  }

  function computeNode(nodeId: string): void {
    if (computedNodes.has(nodeId)) return;
    const node = nodeMap.get(nodeId);
    if (!node) return;

    if (node.type === 'INPUT' || node.type === 'CLOCK') {
      outputValues.set(nodeId, node.state ?? false);
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'OUTPUT') {
      const inputs = getInputValues(nodeId, 'in');
      outputValues.set(nodeId, gateDefinitions.OUTPUT.evaluate(inputs));
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'FLIPFLOP_D') {
      const dInput = connections.find(
        (c) => c.target === nodeId && c.targetHandle === 'd'
      );
      const clkInput = connections.find(
        (c) => c.target === nodeId && c.targetHandle === 'clk'
      );

      if (dInput && clkInput) {
        if (!outputValues.has(dInput.source)) computeNode(dInput.source);
        if (!outputValues.has(clkInput.source)) computeNode(clkInput.source);
        
        const d = outputValues.get(dInput.source) ?? false;
        const clk = outputValues.get(clkInput.source) ?? false;

        const lastClk = node.internalState?.lastClock ?? false;
        const risingEdge = clk && !lastClk;

        const newQ = risingEdge ? d : (node.internalState?.q ?? false);

        outputValues.set(nodeId, newQ);
        computedNodes.add(nodeId);
      }
      return;
    }

    if (node.type === 'REGISTER') {
      const loadConn = connections.find(
        (c) => c.target === nodeId && c.targetHandle === 'load'
      );
      const load = loadConn ? (outputValues.get(loadConn.source) ?? false) : false;

      const currentValues = node.internalState?.values ?? [false, false, false, false];
      
      const d0Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd0');
      const d1Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd1');
      const d2Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd2');
      const d3Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd3');
      
      if (d0Conn && !outputValues.has(d0Conn.source)) computeNode(d0Conn.source);
      if (d1Conn && !outputValues.has(d1Conn.source)) computeNode(d1Conn.source);
      if (d2Conn && !outputValues.has(d2Conn.source)) computeNode(d2Conn.source);
      if (d3Conn && !outputValues.has(d3Conn.source)) computeNode(d3Conn.source);
      
      const newValues = load
        ? [
            d0Conn ? (outputValues.get(d0Conn.source) ?? false) : false,
            d1Conn ? (outputValues.get(d1Conn.source) ?? false) : false,
            d2Conn ? (outputValues.get(d2Conn.source) ?? false) : false,
            d3Conn ? (outputValues.get(d3Conn.source) ?? false) : false,
          ]
        : currentValues;

      newValues.forEach((v, i) => outputValues.set(`${nodeId}_q${i}`, v));
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'HALF_ADDER') {
      const aConn = connections.find((c) => c.target === nodeId && c.targetHandle === 'a');
      const bConn = connections.find((c) => c.target === nodeId && c.targetHandle === 'b');
      
      if (aConn && !outputValues.has(aConn.source)) computeNode(aConn.source);
      if (bConn && !outputValues.has(bConn.source)) computeNode(bConn.source);
      
      const a = aConn ? (outputValues.get(aConn.source) ?? false) : false;
      const b = bConn ? (outputValues.get(bConn.source) ?? false) : false;
      
      const { sum, carry } = getHalfAdderOutputs([a, b]);
      outputValues.set(`${nodeId}_sum`, sum);
      outputValues.set(`${nodeId}_carry`, carry);
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'FULL_ADDER') {
      const aConn = connections.find((c) => c.target === nodeId && c.targetHandle === 'a');
      const bConn = connections.find((c) => c.target === nodeId && c.targetHandle === 'b');
      const cinConn = connections.find((c) => c.target === nodeId && c.targetHandle === 'cin');
      
      if (aConn && !outputValues.has(aConn.source)) computeNode(aConn.source);
      if (bConn && !outputValues.has(bConn.source)) computeNode(bConn.source);
      if (cinConn && !outputValues.has(cinConn.source)) computeNode(cinConn.source);
      
      const a = aConn ? (outputValues.get(aConn.source) ?? false) : false;
      const b = bConn ? (outputValues.get(bConn.source) ?? false) : false;
      const cin = cinConn ? (outputValues.get(cinConn.source) ?? false) : false;
      
      const { sum, carry } = getFullAdderOutputs([a, b, cin]);
      outputValues.set(`${nodeId}_sum`, sum);
      outputValues.set(`${nodeId}_carry`, carry);
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'MUX_2_1') {
      const d0Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd0');
      const d1Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd1');
      const selConn = connections.find((c) => c.target === nodeId && c.targetHandle === 'sel');
      
      if (d0Conn && !outputValues.has(d0Conn.source)) computeNode(d0Conn.source);
      if (d1Conn && !outputValues.has(d1Conn.source)) computeNode(d1Conn.source);
      if (selConn && !outputValues.has(selConn.source)) computeNode(selConn.source);
      
      const d0 = d0Conn ? (outputValues.get(d0Conn.source) ?? false) : false;
      const d1 = d1Conn ? (outputValues.get(d1Conn.source) ?? false) : false;
      const sel = selConn ? (outputValues.get(selConn.source) ?? false) : false;
      
      outputValues.set(nodeId, getMux2_1Output([d0, d1, sel]));
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'MUX_4_1') {
      const d0Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd0');
      const d1Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd1');
      const d2Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd2');
      const d3Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd3');
      const sel0Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'sel0');
      const sel1Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'sel1');
      
      const d0 = d0Conn ? (outputValues.get(d0Conn.source) ?? false) : false;
      const d1 = d1Conn ? (outputValues.get(d1Conn.source) ?? false) : false;
      const d2 = d2Conn ? (outputValues.get(d2Conn.source) ?? false) : false;
      const d3 = d3Conn ? (outputValues.get(d3Conn.source) ?? false) : false;
      const sel0 = sel0Conn ? (outputValues.get(sel0Conn.source) ?? false) : false;
      const sel1 = sel1Conn ? (outputValues.get(sel1Conn.source) ?? false) : false;
      
      outputValues.set(nodeId, getMux4_1Output([d0, d1, d2, d3, sel0, sel1]));
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'DEMUX_1_2') {
      const dConn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd');
      const selConn = connections.find((c) => c.target === nodeId && c.targetHandle === 'sel');
      
      const d = dConn ? (outputValues.get(dConn.source) ?? false) : false;
      const sel = selConn ? (outputValues.get(selConn.source) ?? false) : false;
      
      const { y0, y1 } = getDemux1_2Outputs([d, sel]);
      outputValues.set(`${nodeId}_y0`, y0);
      outputValues.set(`${nodeId}_y1`, y1);
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'DECODER_2_4') {
      const a0Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'a0');
      const a1Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'a1');
      
      const a0 = a0Conn ? (outputValues.get(a0Conn.source) ?? false) : false;
      const a1 = a1Conn ? (outputValues.get(a1Conn.source) ?? false) : false;
      
      const outputs = getDecoder2_4Outputs([a0, a1]);
      outputs.forEach((v, i) => outputValues.set(`${nodeId}_y${i}`, v));
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'DECODER_3_8') {
      const a0Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'a0');
      const a1Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'a1');
      const a2Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'a2');
      
      const a0 = a0Conn ? (outputValues.get(a0Conn.source) ?? false) : false;
      const a1 = a1Conn ? (outputValues.get(a1Conn.source) ?? false) : false;
      const a2 = a2Conn ? (outputValues.get(a2Conn.source) ?? false) : false;
      
      const outputs = getDecoder3_8Outputs([a0, a1, a2]);
      outputs.forEach((v, i) => outputValues.set(`${nodeId}_y${i}`, v));
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'ENCODER_4_2') {
      const d0Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd0');
      const d1Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd1');
      const d2Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd2');
      const d3Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd3');
      
      const d0 = d0Conn ? (outputValues.get(d0Conn.source) ?? false) : false;
      const d1 = d1Conn ? (outputValues.get(d1Conn.source) ?? false) : false;
      const d2 = d2Conn ? (outputValues.get(d2Conn.source) ?? false) : false;
      const d3 = d3Conn ? (outputValues.get(d3Conn.source) ?? false) : false;
      
      const { y0, y1 } = getEncoder4_2Outputs([d0, d1, d2, d3]);
      outputValues.set(`${nodeId}_y0`, y0);
      outputValues.set(`${nodeId}_y1`, y1);
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'MUX_8_1') {
      const dConns = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'].map((h) =>
        connections.find((c) => c.target === nodeId && c.targetHandle === h)
      );
      const sel0Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'sel0');
      const sel1Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'sel1');
      
      const dValues = dConns.map((c) => c ? (outputValues.get(c.source) ?? false) : false);
      const sel0 = sel0Conn ? (outputValues.get(sel0Conn.source) ?? false) : false;
      const sel1 = sel1Conn ? (outputValues.get(sel1Conn.source) ?? false) : false;
      const sel = (sel1 ? 2 : 0) + (sel0 ? 1 : 0);
      
      outputValues.set(nodeId, dValues[sel] ?? false);
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'DEMUX_1_4') {
      const dConn = connections.find((c) => c.target === nodeId && c.targetHandle === 'd');
      const sel0Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'sel0');
      const sel1Conn = connections.find((c) => c.target === nodeId && c.targetHandle === 'sel1');
      
      const d = dConn ? (outputValues.get(dConn.source) ?? false) : false;
      const sel0 = sel0Conn ? (outputValues.get(sel0Conn.source) ?? false) : false;
      const sel1 = sel1Conn ? (outputValues.get(sel1Conn.source) ?? false) : false;
      const sel = (sel1 ? 2 : 0) + (sel0 ? 1 : 0);
      
      ['y0', 'y1', 'y2', 'y3'].forEach((y, i) => {
        outputValues.set(`${nodeId}_${y}`, i === sel ? d : false);
      });
      computedNodes.add(nodeId);
      return;
    }

    const def = gateDefinitions[node.type];
    if (def) {
      const inputs = getInputValues(nodeId);
      const result = def.evaluate(inputs);
      outputValues.set(nodeId, result);
      computedNodes.add(nodeId);
    }
  }

  nodes.forEach((node) => {
    if (!computedNodes.has(node.id)) {
      computeNode(node.id);
    }
  });

  return outputValues;
}

export function getNodeInputHandles(type: NodeType): string[] {
  switch (type) {
    case 'INPUT':
    case 'CLOCK':
      return [];
    case 'OUTPUT':
      return ['in'];
    case 'FLIPFLOP_D':
      return ['d', 'clk'];
    case 'FLIPFLOP_JK':
      return ['j', 'k', 'clk'];
    case 'FLIPFLOP_T':
      return ['t', 'clk'];
    case 'LATCH_SR':
      return ['s', 'r'];
    case 'LATCH_D':
      return ['d', 'en'];
    case 'REGISTER':
      return ['d0', 'd1', 'd2', 'd3', 'load'];
    case 'REGISTER_8BIT':
      return ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'load'];
    case 'REGISTER_16BIT':
      return ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12', 'd13', 'd14', 'd15', 'load'];
    case 'SHIFT_REGISTER':
      return ['dIn', 'clk', 'load'];
    case 'COUNTER_4BIT':
      return ['clk', 'reset'];
    case 'COUNTER_8BIT':
      return ['clk', 'reset'];
    case 'HALF_ADDER':
      return ['a', 'b'];
    case 'FULL_ADDER':
      return ['a', 'b', 'cin'];
    case 'MUX_2_1':
      return ['d0', 'd1', 'sel'];
    case 'MUX_4_1':
      return ['d0', 'd1', 'd2', 'd3', 'sel0', 'sel1'];
    case 'MUX_8_1':
      return ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'sel0', 'sel1'];
    case 'DEMUX_1_2':
      return ['d', 'sel'];
    case 'DEMUX_1_4':
      return ['d', 'sel0', 'sel1'];
    case 'DECODER_2_4':
      return ['a0', 'a1'];
    case 'DECODER_3_8':
      return ['a0', 'a1', 'a2'];
    case 'ENCODER_4_2':
      return ['d0', 'd1', 'd2', 'd3'];
    case 'STATE_MACHINE':
      return ['input', 'clk'];
    default:
      return ['in1', 'in2'];
  }
}

export function getNodeOutputHandles(type: NodeType): string[] {
  switch (type) {
    case 'FLIPFLOP_D':
    case 'FLIPFLOP_JK':
    case 'FLIPFLOP_T':
      return ['q', 'qNot'];
    case 'LATCH_SR':
    case 'LATCH_D':
      return ['q', 'qNot'];
    case 'REGISTER':
    case 'REGISTER_8BIT':
    case 'SHIFT_REGISTER':
      return ['q0', 'q1', 'q2', 'q3'];
    case 'REGISTER_16BIT':
      return ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15'];
    case 'COUNTER_4BIT':
      return ['q0', 'q1', 'q2', 'q3'];
    case 'COUNTER_8BIT':
      return ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
    case 'HALF_ADDER':
      return ['sum', 'carry'];
    case 'FULL_ADDER':
      return ['sum', 'carry'];
    case 'DEMUX_1_2':
      return ['y0', 'y1'];
    case 'DEMUX_1_4':
      return ['y0', 'y1', 'y2', 'y3'];
    case 'DECODER_2_4':
      return ['y0', 'y1', 'y2', 'y3'];
    case 'DECODER_3_8':
      return ['y0', 'y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7'];
    case 'ENCODER_4_2':
      return ['y0', 'y1'];
    case 'STATE_MACHINE':
      return ['out', 'state'];
    default:
      return ['out'];
  }
}

export function generateTruthTable(
  nodes: CircuitNode[],
  connections: Connection[]
): { inputs: string[]; outputs: string[]; rows: boolean[][] } | null {
  const inputNodes = nodes.filter((n) => n.type === 'INPUT');
  const outputNodes = nodes.filter((n) => n.type === 'OUTPUT');

  if (inputNodes.length === 0 || outputNodes.length === 0) {
    return null;
  }

  const inputIds = inputNodes.map((n) => n.id);
  const outputIds = outputNodes.map((n) => n.id);

  const rows: boolean[][] = [];
  const combinations = Math.pow(2, inputNodes.length);

  for (let i = 0; i < combinations; i++) {
    const inputValues = inputNodes.map((_, j) => Boolean((i >> (inputNodes.length - 1 - j)) & 1));
    
    const testNodes = nodes.map((n) => {
      if (n.type === 'INPUT') {
        const idx = inputIds.indexOf(n.id);
        return { ...n, state: inputValues[idx] };
      }
      return { ...n };
    });

    const results = evaluateCombinationalCircuit(testNodes, connections);
    
    const outputValues = outputIds.map((id) => {
      const conn = connections.find((c) => c.target === id && c.targetHandle === 'in');
      if (conn) {
        return results.get(conn.source) ?? false;
      }
      return false;
    });

    rows.push([...inputValues, ...outputValues]);
  }

  return {
    inputs: inputNodes.map((n) => n.label || n.id),
    outputs: outputNodes.map((n) => n.label || n.id),
    rows,
  };
}
