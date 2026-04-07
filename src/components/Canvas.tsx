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
import { useI18n } from '../i18n/useI18n';

function InputNode({ data }: { data: { state?: boolean; label?: string } }) {
  const { t } = useI18n();
  return (
    <div className={`node input-node ${data.state ? 'active' : ''}`}>
      <Handle type="source" position={Position.Right} />
      <div className="node-label">{data.label || t('gates.INPUT')}</div>
      <div className="node-state">{data.state ? '1' : '0'}</div>
    </div>
  );
}

function OutputNode({ data }: { data: { state?: boolean; label?: string } }) {
  const { t } = useI18n();
  return (
    <div className={`node output-node ${data.state ? 'active' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-state">{data.state ? '1' : '0'}</div>
      <div className="node-label">{data.label || t('gates.OUTPUT')}</div>
    </div>
  );
}

function GateNode({
  data,
}: {
  data: { type: NodeType; state?: boolean; inputCount?: number };
}) {
  const { t } = useI18n();
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
      <div className="gate-name">{t(`gates.${data.type}`)}</div>
      <div className={`node-state ${data.state ? 'high' : 'low'}`}>
        {data.state ? '1' : '0'}
      </div>
    </div>
  );
}

function ClockNode({ data }: { data: { state?: boolean; label?: string } }) {
  const { t } = useI18n();
  return (
    <div className={`node clock-node ${data.state ? 'active' : ''}`}>
      <Handle type="source" position={Position.Right} />
      <div className="node-label">{t('gates.CLOCK')}</div>
      <div className="node-state">{data.state ? '↑' : '↓'}</div>
    </div>
  );
}

function FlipFlopNode({
  data,
}: {
  data: { state?: boolean; label?: string };
}) {
  const { t } = useI18n();
  return (
    <div className={`node flipflop-node ${data.state ? 'active' : ''}`}>
      <Handle type="target" position={Position.Left} id="d" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="clk" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="q" style={{ top: '30%' }} />
      <Handle type="source" position={Position.Right} id="qNot" style={{ top: '70%' }} />
      <div className="ff-label">{t('gates.FLIPFLOP_D')}</div>
      <div className="ff-outputs">
        <span>Q: {data.state ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function RegisterNode({ data }: { data: { values?: boolean[]; label?: string } }) {
  const { t } = useI18n();
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
      <div className="ff-label">{t('gates.REGISTER')}</div>
      <div className="reg-outputs">
        {values.map((v, i) => (
          <span key={i}>{(v ? 1 : 0)}</span>
        ))}
      </div>
    </div>
  );
}

function HalfAdderNode({ data }: { data: { sum?: boolean; carry?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node compound-node">
      <Handle type="target" position={Position.Left} id="a" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="b" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="sum" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="carry" style={{ top: '65%' }} />
      <div className="compound-label">{t('gates.HALF_ADDER')}</div>
      <div className="compound-outputs">
        <span>S: {data.sum ? '1' : '0'}</span>
        <span>C: {data.carry ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function FullAdderNode({ data }: { data: { sum?: boolean; carry?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node compound-node">
      <Handle type="target" position={Position.Left} id="a" style={{ top: '20%' }} />
      <Handle type="target" position={Position.Left} id="b" style={{ top: '40%' }} />
      <Handle type="target" position={Position.Left} id="cin" style={{ top: '60%' }} />
      <Handle type="source" position={Position.Right} id="sum" style={{ top: '40%' }} />
      <Handle type="source" position={Position.Right} id="carry" style={{ top: '70%' }} />
      <div className="compound-label">{t('gates.FULL_ADDER')}</div>
      <div className="compound-outputs">
        <span>S: {data.sum ? '1' : '0'}</span>
        <span>C: {data.carry ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function Mux2_1Node({ data }: { data: { state?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node mux-node">
      <Handle type="target" position={Position.Left} id="d0" style={{ top: '25%' }} />
      <Handle type="target" position={Position.Left} id="d1" style={{ top: '45%' }} />
      <Handle type="target" position={Position.Left} id="sel" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />
      <div className="gate-symbol">MUX</div>
      <div className="gate-name">{t('gates.MUX_2_1')}</div>
      <div className={`node-state ${data.state ? 'high' : 'low'}`}>
        {data.state ? '1' : '0'}
      </div>
    </div>
  );
}

function Mux4_1Node({ data }: { data: { state?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node mux-node">
      <Handle type="target" position={Position.Left} id="d0" style={{ top: '15%' }} />
      <Handle type="target" position={Position.Left} id="d1" style={{ top: '27%' }} />
      <Handle type="target" position={Position.Left} id="d2" style={{ top: '39%' }} />
      <Handle type="target" position={Position.Left} id="d3" style={{ top: '51%' }} />
      <Handle type="target" position={Position.Left} id="sel0" style={{ top: '70%' }} />
      <Handle type="target" position={Position.Left} id="sel1" style={{ top: '85%' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ top: '55%' }} />
      <div className="gate-symbol">MUX</div>
      <div className="gate-name">{t('gates.MUX_4_1')}</div>
      <div className={`node-state ${data.state ? 'high' : 'low'}`}>
        {data.state ? '1' : '0'}
      </div>
    </div>
  );
}

function Demux1_2Node({ data }: { data: { y0?: boolean; y1?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node demux-node">
      <Handle type="target" position={Position.Left} id="d" style={{ top: '40%' }} />
      <Handle type="target" position={Position.Left} id="sel" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="y0" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="y1" style={{ top: '65%' }} />
      <div className="gate-symbol">DEMUX</div>
      <div className="gate-name">{t('gates.DEMUX_1_2')}</div>
      <div className="compound-outputs">
        <span>Y0: {data.y0 ? '1' : '0'}</span>
        <span>Y1: {data.y1 ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function Decoder2_4Node({ data }: { data: { outputs?: boolean[] } }) {
  const { t } = useI18n();
  const outputs = data.outputs || [false, false, false, false];
  return (
    <div className="node decoder-node">
      <Handle type="target" position={Position.Left} id="a0" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="a1" style={{ top: '65%' }} />
      <Handle type="source" position={Position.Right} id="y0" style={{ top: '15%' }} />
      <Handle type="source" position={Position.Right} id="y1" style={{ top: '30%' }} />
      <Handle type="source" position={Position.Right} id="y2" style={{ top: '45%' }} />
      <Handle type="source" position={Position.Right} id="y3" style={{ top: '60%' }} />
      <div className="gate-symbol">DEC</div>
      <div className="gate-name">{t('gates.DECODER_2_4')}</div>
      <div className="decoder-outputs">
        {outputs.map((v, i) => (
          <span key={i} className={v ? 'high' : 'low'}>Y{i}:{v ? '1' : '0'}</span>
        ))}
      </div>
    </div>
  );
}

function Decoder3_8Node({ data }: { data: { outputs?: boolean[] } }) {
  const { t } = useI18n();
  const outputs = data.outputs || Array(8).fill(false);
  return (
    <div className="node decoder-node wide">
      <Handle type="target" position={Position.Left} id="a0" style={{ top: '20%' }} />
      <Handle type="target" position={Position.Left} id="a1" style={{ top: '40%' }} />
      <Handle type="target" position={Position.Left} id="a2" style={{ top: '60%' }} />
      {outputs.map((_, i) => (
        <Handle
          key={`y${i}`}
          type="source"
          position={Position.Right}
          id={`y${i}`}
          style={{ top: `${(i + 0.5) * (100 / 8)}%` }}
        />
      ))}
      <div className="gate-symbol">DEC</div>
      <div className="gate-name">{t('gates.DECODER_3_8')}</div>
      <div className="decoder-outputs compact">
        {outputs.map((v, i) => (
          <span key={i} className={v ? 'high' : 'low'}>{v ? '1' : '0'}</span>
        ))}
      </div>
    </div>
  );
}

function Encoder4_2Node({ data }: { data: { y0?: boolean; y1?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node encoder-node">
      <Handle type="target" position={Position.Left} id="d0" style={{ top: '20%' }} />
      <Handle type="target" position={Position.Left} id="d1" style={{ top: '40%' }} />
      <Handle type="target" position={Position.Left} id="d2" style={{ top: '60%' }} />
      <Handle type="target" position={Position.Left} id="d3" style={{ top: '80%' }} />
      <Handle type="source" position={Position.Right} id="y0" style={{ top: '40%' }} />
      <Handle type="source" position={Position.Right} id="y1" style={{ top: '60%' }} />
      <div className="gate-symbol">ENC</div>
      <div className="gate-name">{t('gates.ENCODER_4_2')}</div>
      <div className="compound-outputs">
        <span>Y0: {data.y0 ? '1' : '0'}</span>
        <span>Y1: {data.y1 ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function SRLatchNode({ data }: { data: { q?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node latch-node">
      <Handle type="target" position={Position.Left} id="s" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="r" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="q" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="qNot" style={{ top: '65%' }} />
      <div className="ff-label">{t('gates.LATCH_SR')}</div>
      <div className="compound-outputs">
        <span>Q: {data.q ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function DLatchNode({ data }: { data: { q?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node latch-node">
      <Handle type="target" position={Position.Left} id="d" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="en" style={{ top: '65%' }} />
      <Handle type="source" position={Position.Right} id="q" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="qNot" style={{ top: '65%' }} />
      <div className="ff-label">{t('gates.LATCH_D')}</div>
      <div className="compound-outputs">
        <span>Q: {data.q ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function JKFlipFlopNode({ data }: { data: { q?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node flipflop-node">
      <Handle type="target" position={Position.Left} id="j" style={{ top: '25%' }} />
      <Handle type="target" position={Position.Left} id="clk" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} id="k" style={{ top: '75%' }} />
      <Handle type="source" position={Position.Right} id="q" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="qNot" style={{ top: '65%' }} />
      <div className="ff-label">{t('gates.FLIPFLOP_JK')}</div>
      <div className="compound-outputs">
        <span>Q: {data.q ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function TFlipFlopNode({ data }: { data: { q?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node flipflop-node">
      <Handle type="target" position={Position.Left} id="t" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="clk" style={{ top: '65%' }} />
      <Handle type="source" position={Position.Right} id="q" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="qNot" style={{ top: '65%' }} />
      <div className="ff-label">{t('gates.FLIPFLOP_T')}</div>
      <div className="compound-outputs">
        <span>Q: {data.q ? '1' : '0'}</span>
      </div>
    </div>
  );
}

function Counter4BitNode({ data }: { data: { count?: number } }) {
  const { t } = useI18n();
  const count = data.count ?? 0;
  const bits = [(count >> 0) & 1, (count >> 1) & 1, (count >> 2) & 1, (count >> 3) & 1];
  return (
    <div className="node counter-node">
      <Handle type="target" position={Position.Left} id="clk" style={{ top: '40%' }} />
      <Handle type="target" position={Position.Left} id="reset" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="q0" style={{ top: '20%' }} />
      <Handle type="source" position={Position.Right} id="q1" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="q2" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Right} id="q3" style={{ top: '65%' }} />
      <div className="ff-label">{t('gates.COUNTER_4BIT')}</div>
      <div className="counter-display">{count.toString(2).padStart(4, '0')}</div>
      <div className="counter-bits">
        {bits.map((b, i) => (
          <span key={i} className={b ? 'high' : 'low'}>{b}</span>
        ))}
      </div>
    </div>
  );
}

function Register8BitNode({ data }: { data: { values?: boolean[] } }) {
  const { t } = useI18n();
  const values = data.values || Array(8).fill(false);
  return (
    <div className="node register-node wide">
      <Handle type="target" position={Position.Left} id="d0" style={{ top: '12%' }} />
      <Handle type="target" position={Position.Left} id="d1" style={{ top: '22%' }} />
      <Handle type="target" position={Position.Left} id="d2" style={{ top: '32%' }} />
      <Handle type="target" position={Position.Left} id="d3" style={{ top: '42%' }} />
      <Handle type="target" position={Position.Left} id="d4" style={{ top: '52%' }} />
      <Handle type="target" position={Position.Left} id="d5" style={{ top: '62%' }} />
      <Handle type="target" position={Position.Left} id="d6" style={{ top: '72%' }} />
      <Handle type="target" position={Position.Left} id="d7" style={{ top: '82%' }} />
      <Handle type="target" position={Position.Left} id="load" style={{ top: '95%' }} />
      <Handle type="source" position={Position.Right} id="q0" style={{ top: '12%' }} />
      <Handle type="source" position={Position.Right} id="q1" style={{ top: '22%' }} />
      <Handle type="source" position={Position.Right} id="q2" style={{ top: '32%' }} />
      <Handle type="source" position={Position.Right} id="q3" style={{ top: '42%' }} />
      <Handle type="source" position={Position.Right} id="q4" style={{ top: '52%' }} />
      <Handle type="source" position={Position.Right} id="q5" style={{ top: '62%' }} />
      <Handle type="source" position={Position.Right} id="q6" style={{ top: '72%' }} />
      <Handle type="source" position={Position.Right} id="q7" style={{ top: '82%' }} />
      <div className="ff-label">{t('gates.REGISTER_8BIT')}</div>
      <div className="reg-outputs">
        {values.map((v, i) => (
          <span key={i} className={v ? 'high' : 'low'}>{(v ? 1 : 0)}</span>
        ))}
      </div>
    </div>
  );
}

function ShiftRegisterNode({ data }: { data: { values?: boolean[] } }) {
  const { t } = useI18n();
  const values = data.values || [false, false, false, false];
  return (
    <div className="node shift-node">
      <Handle type="target" position={Position.Left} id="dIn" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="clk" style={{ top: '55%' }} />
      <Handle type="target" position={Position.Left} id="load" style={{ top: '75%' }} />
      <Handle type="source" position={Position.Right} id="q0" style={{ top: '20%' }} />
      <Handle type="source" position={Position.Right} id="q1" style={{ top: '40%' }} />
      <Handle type="source" position={Position.Right} id="q2" style={{ top: '60%' }} />
      <Handle type="source" position={Position.Right} id="q3" style={{ top: '80%' }} />
      <div className="ff-label">{t('gates.SHIFT_REGISTER')}</div>
      <div className="reg-outputs">
        {values.map((v, i) => (
          <span key={i} className={v ? 'high' : 'low'}>{(v ? 1 : 0)}</span>
        ))}
      </div>
    </div>
  );
}

function Counter8BitNode({ data }: { data: { count?: number } }) {
  const { t } = useI18n();
  const count = data.count ?? 0;
  const bits = Array.from({ length: 8 }, (_, i) => (count >> i) & 1);
  return (
    <div className="node counter-node wide">
      <Handle type="target" position={Position.Left} id="clk" style={{ top: '40%' }} />
      <Handle type="target" position={Position.Left} id="reset" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Right} id="q0" style={{ top: '15%' }} />
      <Handle type="source" position={Position.Right} id="q1" style={{ top: '25%' }} />
      <Handle type="source" position={Position.Right} id="q2" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="q3" style={{ top: '45%' }} />
      <Handle type="source" position={Position.Right} id="q4" style={{ top: '55%' }} />
      <Handle type="source" position={Position.Right} id="q5" style={{ top: '65%' }} />
      <Handle type="source" position={Position.Right} id="q6" style={{ top: '75%' }} />
      <Handle type="source" position={Position.Right} id="q7" style={{ top: '85%' }} />
      <div className="ff-label">{t('gates.COUNTER_8BIT')}</div>
      <div className="counter-display">{count.toString(2).padStart(8, '0')}</div>
      <div className="counter-bits">
        {bits.map((b, i) => (
          <span key={i} className={b ? 'high' : 'low'}>{b}</span>
        ))}
      </div>
    </div>
  );
}

function Mux8_1Node({ data }: { data: { state?: boolean } }) {
  const { t } = useI18n();
  return (
    <div className="node mux-node wide">
      <Handle type="target" position={Position.Left} id="d0" style={{ top: '8%' }} />
      <Handle type="target" position={Position.Left} id="d1" style={{ top: '16%' }} />
      <Handle type="target" position={Position.Left} id="d2" style={{ top: '24%' }} />
      <Handle type="target" position={Position.Left} id="d3" style={{ top: '32%' }} />
      <Handle type="target" position={Position.Left} id="d4" style={{ top: '40%' }} />
      <Handle type="target" position={Position.Left} id="d5" style={{ top: '48%' }} />
      <Handle type="target" position={Position.Left} id="d6" style={{ top: '56%' }} />
      <Handle type="target" position={Position.Left} id="d7" style={{ top: '64%' }} />
      <Handle type="target" position={Position.Left} id="sel0" style={{ top: '80%' }} />
      <Handle type="target" position={Position.Left} id="sel1" style={{ top: '92%' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ top: '50%' }} />
      <div className="gate-symbol">MUX</div>
      <div className="gate-name">{t('gates.MUX_8_1')}</div>
      <div className={`node-state ${data.state ? 'high' : 'low'}`}>
        {data.state ? '1' : '0'}
      </div>
    </div>
  );
}

function Demux1_4Node({ data }: { data: { outputs?: boolean[] } }) {
  const { t } = useI18n();
  const outputs = data.outputs || [false, false, false, false];
  return (
    <div className="node demux-node">
      <Handle type="target" position={Position.Left} id="d" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="sel0" style={{ top: '60%' }} />
      <Handle type="target" position={Position.Left} id="sel1" style={{ top: '80%' }} />
      <Handle type="source" position={Position.Right} id="y0" style={{ top: '15%' }} />
      <Handle type="source" position={Position.Right} id="y1" style={{ top: '38%' }} />
      <Handle type="source" position={Position.Right} id="y2" style={{ top: '62%' }} />
      <Handle type="source" position={Position.Right} id="y3" style={{ top: '85%' }} />
      <div className="gate-symbol">DEMUX</div>
      <div className="gate-name">{t('gates.DEMUX_1_4')}</div>
      <div className="decoder-outputs">
        {outputs.map((v, i) => (
          <span key={i} className={v ? 'high' : 'low'}>Y{i}:{v ? '1' : '0'}</span>
        ))}
      </div>
    </div>
  );
}

function Ram16x4Node({ data }: { data: { internalState?: { memory?: boolean[][] } } }) {
  const { t } = useI18n();
  const memory = data.internalState?.memory ?? Array.from({ length: 16 }, () => [false, false, false, false]);
  return (
    <div className="node ram-node">
      <Handle type="target" position={Position.Left} id="addr0" style={{ top: '10%' }} />
      <Handle type="target" position={Position.Left} id="addr1" style={{ top: '20%' }} />
      <Handle type="target" position={Position.Left} id="addr2" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="addr3" style={{ top: '40%' }} />
      <Handle type="target" position={Position.Left} id="d0" style={{ top: '53%' }} />
      <Handle type="target" position={Position.Left} id="d1" style={{ top: '62%' }} />
      <Handle type="target" position={Position.Left} id="d2" style={{ top: '71%' }} />
      <Handle type="target" position={Position.Left} id="d3" style={{ top: '80%' }} />
      <Handle type="target" position={Position.Left} id="we" style={{ top: '90%' }} />
      <Handle type="target" position={Position.Bottom} id="clk" style={{ left: '50%' }} />
      <Handle type="source" position={Position.Right} id="q0" style={{ top: '25%' }} />
      <Handle type="source" position={Position.Right} id="q1" style={{ top: '40%' }} />
      <Handle type="source" position={Position.Right} id="q2" style={{ top: '55%' }} />
      <Handle type="source" position={Position.Right} id="q3" style={{ top: '70%' }} />
      <div className="ff-label">{t('gates.RAM_16x4')}</div>
      <div className="ram-grid">
        {memory.slice(0, 8).map((row, i) => (
          <div key={i} className="ram-row">
            <span className="ram-addr">{i.toString(16).toUpperCase()}:</span>
            <span className="ram-data">{row.map((b) => (b ? '1' : '0')).join('')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Rom16x4Node({ data }: { data: { internalState?: { memory?: boolean[][] } } }) {
  const { t } = useI18n();
  const memory = data.internalState?.memory ?? Array.from({ length: 16 }, (_, i) => {
    const gray = i ^ (i >> 1);
    return [Boolean((gray >> 0) & 1), Boolean((gray >> 1) & 1), Boolean((gray >> 2) & 1), Boolean((gray >> 3) & 1)];
  });
  return (
    <div className="node rom-node">
      <Handle type="target" position={Position.Left} id="addr0" style={{ top: '15%' }} />
      <Handle type="target" position={Position.Left} id="addr1" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="addr2" style={{ top: '45%' }} />
      <Handle type="target" position={Position.Left} id="addr3" style={{ top: '60%' }} />
      <Handle type="target" position={Position.Left} id="ce" style={{ top: '80%' }} />
      <Handle type="source" position={Position.Right} id="q0" style={{ top: '25%' }} />
      <Handle type="source" position={Position.Right} id="q1" style={{ top: '40%' }} />
      <Handle type="source" position={Position.Right} id="q2" style={{ top: '55%' }} />
      <Handle type="source" position={Position.Right} id="q3" style={{ top: '70%' }} />
      <div className="ff-label">{t('gates.ROM_16x4')}</div>
      <div className="ram-grid">
        {memory.slice(0, 8).map((row, i) => (
          <div key={i} className="ram-row">
            <span className="ram-addr">{i.toString(16).toUpperCase()}:</span>
            <span className="ram-data">{row.map((b) => (b ? '1' : '0')).join('')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StateMachineNode({ data }: { data: { state?: number } }) {
  const { t } = useI18n();
  const state = data.state ?? 0;
  return (
    <div className="node state-machine-node">
      <Handle type="target" position={Position.Left} id="input" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="clk" style={{ top: '65%' }} />
      <Handle type="source" position={Position.Right} id="out" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Right} id="state" style={{ top: '65%' }} />
      <div className="ff-label">{t('gates.STATE_MACHINE')}</div>
      <div className="compound-outputs">
        <span>State: {state}</span>
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
  FLIPFLOP_JK: JKFlipFlopNode,
  FLIPFLOP_T: TFlipFlopNode,
  LATCH_SR: SRLatchNode,
  LATCH_D: DLatchNode,
  REGISTER: RegisterNode,
  REGISTER_8BIT: Register8BitNode,
  SHIFT_REGISTER: ShiftRegisterNode,
  COUNTER_4BIT: Counter4BitNode,
  COUNTER_8BIT: Counter8BitNode,
  HALF_ADDER: HalfAdderNode,
  FULL_ADDER: FullAdderNode,
  MUX_2_1: Mux2_1Node,
  MUX_4_1: Mux4_1Node,
  MUX_8_1: Mux8_1Node,
  DEMUX_1_2: Demux1_2Node,
  DEMUX_1_4: Demux1_4Node,
  DECODER_2_4: Decoder2_4Node,
  DECODER_3_8: Decoder3_8Node,
  ENCODER_4_2: Encoder4_2Node,
  STATE_MACHINE: StateMachineNode,
  RAM_16x4: Ram16x4Node,
  ROM_16x4: Rom16x4Node,
};

export function Canvas() {
  const { t } = useI18n();
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

  const rfNodes: Node[] = storeNodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: {
      ...n,
      inputCount: gateDefinitions[n.type]?.inputCount,
    },
  }));

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

  useEffect(() => {
    setNodes(rfNodes);
  }, [rfNodes, setNodes]);

  useEffect(() => {
    setEdges(rfEdges);
  }, [rfEdges, setEdges]);

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
        {t('monitor.cycle')}: {clockCycle} | {t('monitor.status')}: {isRunning ? t('toolbar.running') : t('toolbar.stopped')}
      </div>
    </div>
  );
}
