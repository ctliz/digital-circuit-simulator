import type { NodeType } from '../types/circuit';
import { useCircuitStore } from '../store/circuitStore';
import { useI18n } from '../i18n';
import {
  Play,
  Pause,
  RotateCcw,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Square,
  ChevronRight,
  CircleDot,
  Clock,
  HardDrive,
  Plus,
  GitBranch,
  Layers,
  Share2,
  FlipHorizontal,
} from 'lucide-react';

const toolButtons: { type: NodeType; icon: React.ReactNode; labelKey: string }[] = [
  { type: 'INPUT', icon: <ToggleLeft size={18} />, labelKey: 'gates.INPUT' },
  { type: 'OUTPUT', icon: <ToggleRight size={18} />, labelKey: 'gates.OUTPUT' },
  { type: 'AND', icon: <Square size={18} />, labelKey: 'gates.AND' },
  { type: 'OR', icon: <ChevronRight size={18} />, labelKey: 'gates.OR' },
  { type: 'NOT', icon: <CircleDot size={18} />, labelKey: 'gates.NOT' },
  { type: 'NAND', icon: <Square size={18} />, labelKey: 'gates.NAND' },
  { type: 'NOR', icon: <ChevronRight size={18} />, labelKey: 'gates.NOR' },
  { type: 'XOR', icon: <ChevronRight size={18} />, labelKey: 'gates.XOR' },
  { type: 'XNOR', icon: <ChevronRight size={18} />, labelKey: 'gates.XNOR' },
  { type: 'CLOCK', icon: <Clock size={18} />, labelKey: 'gates.CLOCK' },
];

const sequentialButtons: { type: NodeType; icon: React.ReactNode; labelKey: string }[] = [
  { type: 'FLIPFLOP_D', icon: <HardDrive size={18} />, labelKey: 'gates.FLIPFLOP_D' },
  { type: 'FLIPFLOP_JK', icon: <FlipHorizontal size={18} />, labelKey: 'gates.FLIPFLOP_JK' },
  { type: 'FLIPFLOP_T', icon: <FlipHorizontal size={18} />, labelKey: 'gates.FLIPFLOP_T' },
  { type: 'LATCH_SR', icon: <FlipHorizontal size={18} />, labelKey: 'gates.LATCH_SR' },
  { type: 'LATCH_D', icon: <FlipHorizontal size={18} />, labelKey: 'gates.LATCH_D' },
  { type: 'REGISTER', icon: <HardDrive size={18} />, labelKey: 'gates.REGISTER' },
  { type: 'COUNTER_4BIT', icon: <HardDrive size={18} />, labelKey: 'gates.COUNTER_4BIT' },
];

const arithmeticButtons: { type: NodeType; icon: React.ReactNode; labelKey: string }[] = [
  { type: 'HALF_ADDER', icon: <Plus size={18} />, labelKey: 'gates.HALF_ADDER' },
  { type: 'FULL_ADDER', icon: <Plus size={18} />, labelKey: 'gates.FULL_ADDER' },
];

const muxDemuxButtons: { type: NodeType; icon: React.ReactNode; labelKey: string }[] = [
  { type: 'MUX_2_1', icon: <GitBranch size={18} />, labelKey: 'gates.MUX_2_1' },
  { type: 'MUX_4_1', icon: <GitBranch size={18} />, labelKey: 'gates.MUX_4_1' },
  { type: 'DEMUX_1_2', icon: <Share2 size={18} />, labelKey: 'gates.DEMUX_1_2' },
];

const codecButtons: { type: NodeType; icon: React.ReactNode; labelKey: string }[] = [
  { type: 'DECODER_2_4', icon: <Layers size={18} />, labelKey: 'gates.DECODER_2_4' },
  { type: 'DECODER_3_8', icon: <Layers size={18} />, labelKey: 'gates.DECODER_3_8' },
  { type: 'ENCODER_4_2', icon: <Layers size={18} />, labelKey: 'gates.ENCODER_4_2' },
];

export function Toolbar() {
  const { addNode, isRunning, setIsRunning, clear, nodes, removeNode } =
    useCircuitStore();
  const { t } = useI18n();

  const handleDragStart = (
    e: React.DragEvent,
    type: NodeType
  ) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>{t('toolbar.title')}</h3>
      </div>

      <div className="toolbar-section">
        <div className="toolbar-label">{t('toolbar.basicComponents')}</div>
        <div className="toolbar-buttons">
          {toolButtons.map(({ type, icon, labelKey }) => (
            <button
              key={type}
              className="toolbar-btn"
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onClick={() => addNode(type, { x: 250, y: 200 })}
              title={t(labelKey)}
            >
              {icon}
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <div className="toolbar-label">{t('toolbar.sequential')}</div>
        <div className="toolbar-buttons">
          {sequentialButtons.map(({ type, icon, labelKey }) => (
            <button
              key={type}
              className="toolbar-btn"
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onClick={() => addNode(type, { x: 250, y: 200 })}
              title={t(labelKey)}
            >
              {icon}
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <div className="toolbar-label">{t('toolbar.arithmetic')}</div>
        <div className="toolbar-buttons">
          {arithmeticButtons.map(({ type, icon, labelKey }) => (
            <button
              key={type}
              className="toolbar-btn"
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onClick={() => addNode(type, { x: 250, y: 200 })}
              title={t(labelKey)}
            >
              {icon}
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <div className="toolbar-label">{t('toolbar.muxDemux')}</div>
        <div className="toolbar-buttons">
          {muxDemuxButtons.map(({ type, icon, labelKey }) => (
            <button
              key={type}
              className="toolbar-btn"
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onClick={() => addNode(type, { x: 250, y: 200 })}
              title={t(labelKey)}
            >
              {icon}
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <div className="toolbar-label">{t('toolbar.codec')}</div>
        <div className="toolbar-buttons">
          {codecButtons.map(({ type, icon, labelKey }) => (
            <button
              key={type}
              className="toolbar-btn"
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onClick={() => addNode(type, { x: 250, y: 200 })}
              title={t(labelKey)}
            >
              {icon}
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <div className="toolbar-label">{t('toolbar.simulation')}</div>
        <div className="toolbar-buttons">
          <button
            className={`toolbar-btn ${isRunning ? 'active' : ''}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? t('toolbar.pause') : t('toolbar.run')}</span>
          </button>
          <button className="toolbar-btn" onClick={clear}>
            <RotateCcw size={18} />
            <span>{t('toolbar.reset')}</span>
          </button>
        </div>
      </div>

      <div className="toolbar-section">
        <div className="toolbar-label">{t('toolbar.nodeList')} ({nodes.length})</div>
        <div className="node-list">
          {nodes.map((node) => (
            <div key={node.id} className="node-list-item">
              <span>
                {t(`gates.${node.type}`)}
              </span>
              <button
                className="node-delete-btn"
                onClick={() => removeNode(node.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
