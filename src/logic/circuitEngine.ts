import type { CircuitNode, Connection, NodeType } from '../types/circuit';
import { gateDefinitions } from './gateDefinitions';

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
      (c) => c.target === nodeId && c.targetHandle === handle
    );
    return incomingConnections.map((c) => {
      if (!outputValues.has(c.source)) {
        computeNode(c.source);
      }
      return outputValues.get(c.source) ?? false;
    });
  }

  function computeNode(nodeId: string): void {
    if (computedNodes.has(nodeId)) return;
    const node = nodeMap.get(nodeId);
    if (!node) return;

    const def = gateDefinitions[node.type];
    if (!def) return;

    if (node.type === 'INPUT' || node.type === 'CLOCK') {
      outputValues.set(nodeId, node.state ?? false);
      computedNodes.add(nodeId);
      return;
    }

    if (node.type === 'OUTPUT') {
      const inputs = getInputValues(nodeId, 'in');
      outputValues.set(nodeId, def.evaluate(inputs));
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
      const newValues = load
        ? [
            outputValues.get(connections.find((c) => c.target === nodeId && c.targetHandle === 'd0')?.source ?? '') ?? false,
            outputValues.get(connections.find((c) => c.target === nodeId && c.targetHandle === 'd1')?.source ?? '') ?? false,
            outputValues.get(connections.find((c) => c.target === nodeId && c.targetHandle === 'd2')?.source ?? '') ?? false,
            outputValues.get(connections.find((c) => c.target === nodeId && c.targetHandle === 'd3')?.source ?? '') ?? false,
          ]
        : currentValues;

      newValues.forEach((v, i) => outputValues.set(`${nodeId}_q${i}`, v));
      computedNodes.add(nodeId);
      return;
    }

    // Combinational gates
    const inputs = getInputValues(nodeId);
    const result = def.evaluate(inputs);
    outputValues.set(nodeId, result);
    computedNodes.add(nodeId);
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
    case 'REGISTER':
      return ['d0', 'd1', 'd2', 'd3', 'load'];
    default:
      return ['in1', 'in2'];
  }
}

export function getNodeOutputHandles(type: NodeType): string[] {
  switch (type) {
    case 'FLIPFLOP_D':
      return ['q', 'qNot'];
    case 'REGISTER':
      return ['q0', 'q1', 'q2', 'q3'];
    default:
      return ['out'];
  }
}
