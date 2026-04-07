import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import type { Connection, Edge, Node, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCircuitStore } from '../store/circuitStore';
import type { NodeType } from '../types/circuit';
import { gateDefinitions } from '../logic/gateDefinitions';

function InputNode({ data }: { data: { state?: boolean; label?: string } }) {
  return (
    <div className={`node input-node ${data.state ? 'active' : ''}`}>
      <Handle type="source" position={Position.Right} />
      <div className="node-label">{data.label || '输入'}</div>
      <div className="node-state">{data.state ? '1' : '0'}</div>
    </div>
  );
}

function OutputNode({ data }: { data: { state?: boolean; label?: string } }) {
  return (
    <div className={`node output-node ${data.state ? 'active' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-state">{data.state ? '1' : '0'}</div>
      <div className="node-label">{data.label || '输出'}</div>
    </div>
  );
}

function GateNode({
  data,
}: {
  data: { type: NodeType; state?: boolean; inputCount?: number };
}) {
  const def = gateDefinitions[data.type];
  const inputCount = data.inputCount || def?.inputCount || 2;

  return (
    <div className={`node gate-node ${data.state ? 'active' : ''}`}>
      {Array.from({ length: inputCount }).map((_, i) => (
        <Handle
          key={`in-${i}`}
          type="target"
          position={Position.Left}
          id={`in${i + 1}`}
          style={{ top: `${((i + 1) / (inputCount + 1)) * 100}%` }}
        />
      ))}
      <Handle type="source" position={Position.Right} />
      <div className="gate-symbol">{def?.symbol || '?'}</div>
      <div className="gate-name">{def?.name || data.type}</div>
      <div className={`node-state ${data.state ? 'high' : 'low'}`}>
        {data.state ? '1' : '0'}
      </div>
    </div>
  );
}

function ClockNode({ data }: { data: { state?: boolean; label?: string } }) {
  return (
    <div className={`node clock-node ${data.state ? 'active' : ''}`}>
      <Handle type="source" position={Position.Right} />
      <div className="node-label">时钟</div>
      <div className="node-state">{data.state ? '↑' : '↓'}</div>
    </div>
  );
}

function FlipFlopNode({
  data,
}: {
  data: { state?: boolean; label?: string };
}) {
  return (
    <div className={`node flipflop-node ${data.state ? 'active' : ''}`}>
      <Handle type="target" position={Position.Left} id="d" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="clk" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="q" style={{ top: '30%' }} />
      <Handle type="source" position={Position.Right} id="qNot" style={{ top: '70%' }} />
      <div className="ff-label">D-FF</div>
      <div className="ff-outputs">
        <span>Q: {data.state ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function RegisterNode({ data }: { data: { values?: boolean[]; label?: string } }) {
  const values = data.values || [false, false, false, false];
  return (
    <div className="node register-node">
      <Handle type="target" position={Position.Left} id="d0" style={{ top: '20%' }} />
      <Handle type="target" position={Position.Left} id="d1" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="d2" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} id="d3" style={{ top: '65%' }} />
      <Handle type="target" position={Position.Left} id="load" style={{ top: '85%' }} />
      <Handle type="source" position={Position.Right} id="q0" style={{ top: '20%' }} />
      <Handle type="source" position={Position.Right} id="q1" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="q2" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Right} id="q3" style={{ top: '65%' }} />
      <div className="ff-label">REG</div>
      <div className="reg-outputs">
        {values.map((v, i) => (
          <span key={i}>{(v ? 1 : 0)}</span>
        ))}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  INPUT: InputNode,
  OUTPUT: OutputNode,
  AND: GateNode,
  OR: GateNode,
  NOT: GateNode,
  NAND: GateNode,
  NOR: GateNode,
  XOR: GateNode,
  XNOR: GateNode,
  CLOCK: ClockNode,
  FLIPFLOP_D: FlipFlopNode,
  REGISTER: RegisterNode,
};

export function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes: storeNodes,
    connections,
    addNode,
    addConnection,
    updateNode,
    isRunning,
    clockCycle,
    toggleInputState,
  } = useCircuitStore();

  // Convert store nodes to ReactFlow nodes
  const rfNodes: Node[] = storeNodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: {
      ...n,
      inputCount: gateDefinitions[n.type]?.inputCount,
    },
  }));

  // Convert store connections to ReactFlow edges
  const rfEdges: Edge[] = connections.map((c) => ({
    id: c.id,
    source: c.source,
    target: c.target,
    sourceHandle: c.sourceHandle,
    targetHandle: c.targetHandle,
    animated: true,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  // Sync store nodes to ReactFlow state when store changes
  useEffect(() => {
    setNodes(rfNodes);
  }, [storeNodes, setNodes]);

  // Sync store connections to ReactFlow state when store changes
  useEffect(() => {
    setEdges(rfEdges);
  }, [connections, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      addConnection({
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      });
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
          },
          eds
        )
      );
    },
    [addConnection, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 40,
        y: event.clientY - reactFlowBounds.top - 40,
      };
      addNode(type, position);
    },
    [addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === 'INPUT') {
        toggleInputState(node.id);
      }
    },
    [toggleInputState]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      updateNode(node.id, { position: node.position });
    },
    [updateNode]
  );

  return (
    <div ref={reactFlowWrapper} className="canvas-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <div className="simulation-info">
        时钟周期: {clockCycle} | 状态: {isRunning ? '运行中' : '已停止'}
      </div>
    </div>
  );
}
