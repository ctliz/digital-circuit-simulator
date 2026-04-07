import { useRef, useEffect, useState } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { useI18n } from '../i18n/useI18n';
import { X, Activity } from 'lucide-react';

const ROW_HEIGHT = 30;
const LABEL_WIDTH = 110;
const SAMPLE_W = 14;
const SIG_H = 20; // height of high signal within row
const SIG_TOP = 5; // top margin within row

export function WaveformPanel() {
  const { t } = useI18n();
  const { nodes, signalHistory } = useCircuitStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  // Get tracked signals: INPUT, CLOCK, OUTPUT, Flip-Flops
  const trackedNodes = nodes.filter(n =>
    ['INPUT', 'CLOCK', 'OUTPUT', 'FLIPFLOP_D', 'FLIPFLOP_JK', 'FLIPFLOP_T'].includes(n.type)
  );

  const signals = trackedNodes
    .map(n => ({
      id: n.id,
      label: n.label || `${n.type.toLowerCase().replace('flipflop_', 'ff_')}_${n.id.split('_').pop()}`,
      history: signalHistory[n.id] ?? [],
      type: n.type,
    }))
    .filter(s => s.history.length > 0);

  useEffect(() => {
    if (!visible || !canvasRef.current || signals.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxLen = Math.max(...signals.map(s => s.history.length));
    const waveWidth = maxLen * SAMPLE_W + 20;
    canvas.width = LABEL_WIDTH + waveWidth;
    canvas.height = signals.length * ROW_HEIGHT + 24; // 24 for time axis

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Signal rows
    signals.forEach((sig, rowIdx) => {
      const y = rowIdx * ROW_HEIGHT;

      // Row background (alternating)
      ctx.fillStyle = rowIdx % 2 === 0 ? '#0d1f3c' : '#0a1a34';
      ctx.fillRect(0, y, canvas.width, ROW_HEIGHT);

      // Label
      ctx.fillStyle = sig.type === 'CLOCK' ? '#f59e0b' : sig.type === 'INPUT' ? '#10b981' : sig.type === 'OUTPUT' ? '#e94560' : '#60a5fa';
      ctx.font = '11px monospace';
      ctx.textBaseline = 'middle';
      ctx.fillText(sig.label.slice(0, 12), 6, y + ROW_HEIGHT / 2);

      // Separator
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(LABEL_WIDTH, y);
      ctx.lineTo(LABEL_WIDTH, y + ROW_HEIGHT);
      ctx.stroke();

      // Waveform
      if (sig.history.length === 0) return;

      const highY = y + SIG_TOP;
      const lowY = y + SIG_TOP + SIG_H;

      ctx.strokeStyle = sig.type === 'CLOCK' ? '#f59e0b' : sig.type === 'INPUT' ? '#10b981' : sig.type === 'OUTPUT' ? '#e94560' : '#60a5fa';
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      let prevVal = sig.history[0];
      ctx.moveTo(LABEL_WIDTH + SAMPLE_W / 2, prevVal ? highY : lowY);

      sig.history.forEach((val, i) => {
        if (i === 0) return;
        const cx = LABEL_WIDTH + i * SAMPLE_W + SAMPLE_W / 2;
        if (val !== prevVal) {
          ctx.lineTo(cx, prevVal ? highY : lowY);
          ctx.lineTo(cx, val ? highY : lowY);
        } else {
          ctx.lineTo(cx, val ? highY : lowY);
        }
        prevVal = val;
      });

      // Draw to end
      const lastX = LABEL_WIDTH + (sig.history.length - 1) * SAMPLE_W + SAMPLE_W;
      ctx.lineTo(lastX, prevVal ? highY : lowY);
      ctx.stroke();
    });

    // Time axis
    const axisY = signals.length * ROW_HEIGHT;
    ctx.fillStyle = '#1e3a5f';
    ctx.fillRect(0, axisY, canvas.width, 24);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.textBaseline = 'middle';
    for (let t_i = 0; t_i * SAMPLE_W < SAMPLE_W * (maxLen + 1); t_i += Math.max(1, Math.floor(10))) {
      const tx = LABEL_WIDTH + t_i * SAMPLE_W;
      ctx.fillStyle = '#475569';
      ctx.fillRect(tx, axisY, 1, 6);
      if (t_i % 5 === 0) {
        ctx.fillStyle = '#64748b';
        ctx.fillText(String(t_i), tx + 2, axisY + 14);
      }
    }
    ctx.fillStyle = '#475569';
    ctx.fillText(t('waveform.cycles'), LABEL_WIDTH + 2, axisY + 14);

  }, [signals, visible, t]);

  if (!visible) {
    return (
      <button
        className="waveform-toggle-btn"
        onClick={() => setVisible(true)}
        title={t('waveform.title')}
      >
        <Activity size={16} />
        <span>{t('waveform.title')}</span>
      </button>
    );
  }

  return (
    <div className="waveform-panel">
      <div className="waveform-header">
        <Activity size={14} />
        <span>{t('waveform.title')}</span>
        <span className="waveform-hint">{t('waveform.hint')}</span>
        <button className="panel-close-btn" onClick={() => setVisible(false)}><X size={14} /></button>
      </div>
      <div className="waveform-content">
        {signals.length === 0 ? (
          <div className="waveform-empty">{t('waveform.empty')}</div>
        ) : (
          <div className="waveform-scroll">
            <canvas ref={canvasRef} />
          </div>
        )}
      </div>
    </div>
  );
}
