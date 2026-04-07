import { useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { MonitorPanel } from './components/MonitorPanel';
import { Tutorial } from './components/Tutorial';
import { TruthTablePanel } from './components/TruthTablePanel';
import { KMapPanel } from './components/KMapPanel';
import { useCircuitStore } from './store/circuitStore';
import { useI18n } from './i18n';
import { evaluateCombinationalCircuit } from './logic/circuitEngine';

import './App.css';

function App() {
  const {
    nodes,
    connections,
    updateNode,
    isRunning,
    clockCycle,
    incrementClockCycle,
    clockFrequency,
  } = useCircuitStore();
  const { locale, setLocale } = useI18n();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      incrementClockCycle();

      nodes
        .filter((n) => n.type === 'CLOCK')
        .forEach((node) => {
          updateNode(node.id, { state: !node.state });
        });

      const results = evaluateCombinationalCircuit(nodes, connections);

      nodes.forEach((node) => {
        if (node.type === 'INPUT' || node.type === 'CLOCK') return;

        if (node.type === 'FLIPFLOP_D' || node.type === 'FLIPFLOP_JK' || node.type === 'FLIPFLOP_T') {
          const clkConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'clk'
          );

          if (clkConn) {
            const clk = results.get(clkConn.source) ?? false;
            const lastClk = node.internalState?.lastClock ?? false;
            const risingEdge = clk && !lastClk;

            if (node.type === 'FLIPFLOP_D') {
              const dConn = connections.find(
                (c) => c.target === node.id && c.targetHandle === 'd'
              );
              const d = dConn ? (results.get(dConn.source) ?? false) : false;
              const newQ = risingEdge ? d : (node.internalState?.q ?? false);
              updateNode(node.id, {
                state: newQ,
                internalState: { q: newQ, lastClock: clk },
              });
            } else if (node.type === 'FLIPFLOP_JK') {
              const jConn = connections.find(
                (c) => c.target === node.id && c.targetHandle === 'j'
              );
              const kConn = connections.find(
                (c) => c.target === node.id && c.targetHandle === 'k'
              );
              const j = jConn ? (results.get(jConn.source) ?? false) : false;
              const k = kConn ? (results.get(kConn.source) ?? false) : false;
              const currentQ = node.internalState?.q ?? false;
              let newQ = currentQ;
              if (risingEdge) {
                if (j && k) newQ = !currentQ;
                else if (j) newQ = true;
                else if (k) newQ = false;
              }
              updateNode(node.id, {
                state: newQ,
                internalState: { q: newQ, lastClock: clk },
              });
            } else if (node.type === 'FLIPFLOP_T') {
              const tConn = connections.find(
                (c) => c.target === node.id && c.targetHandle === 't'
              );
              const t = tConn ? (results.get(tConn.source) ?? false) : false;
              const currentQ = node.internalState?.q ?? false;
              const newQ = risingEdge && t ? !currentQ : currentQ;
              updateNode(node.id, {
                state: newQ,
                internalState: { q: newQ, lastClock: clk },
              });
            }
          }
        } else if (node.type === 'LATCH_SR') {
          const sConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 's'
          );
          const rConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'r'
          );
          const s = sConn ? (results.get(sConn.source) ?? false) : false;
          const r = rConn ? (results.get(rConn.source) ?? false) : false;
          const currentQ = node.internalState?.q ?? false;
          let newQ = currentQ;
          if (s && r) newQ = false;
          else if (s) newQ = true;
          else if (r) newQ = false;
          updateNode(node.id, { state: newQ, internalState: { q: newQ } });
        } else if (node.type === 'LATCH_D') {
          const dConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'd'
          );
          const enConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'en'
          );
          const d = dConn ? (results.get(dConn.source) ?? false) : false;
          const en = enConn ? (results.get(enConn.source) ?? false) : false;
          const currentQ = node.internalState?.q ?? false;
          const newQ = en ? d : currentQ;
          updateNode(node.id, { state: newQ, internalState: { q: newQ } });
        } else if (node.type === 'COUNTER_4BIT') {
          const clkConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'clk'
          );
          const resetConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'reset'
          );
          const clk = clkConn ? (results.get(clkConn.source) ?? false) : false;
          const reset = resetConn ? (results.get(resetConn.source) ?? false) : false;
          const lastClk = node.internalState?.lastClock ?? false;
          const risingEdge = clk && !lastClk;
          const currentCount = node.internalState?.count ?? 0;
          const newCount = reset ? 0 : (risingEdge ? (currentCount + 1) % 16 : currentCount);
          updateNode(node.id, {
            internalState: { count: newCount, lastClock: clk },
          });
        } else if (node.type === 'REGISTER') {
          const loadConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'load'
          );
          const load = loadConn ? (results.get(loadConn.source) ?? false) : false;

          if (load) {
            const newValues = ['d0', 'd1', 'd2', 'd3'].map((handle) => {
              const conn = connections.find(
                (c) => c.target === node.id && c.targetHandle === handle
              );
              return conn ? (results.get(conn.source) ?? false) : false;
            });
            updateNode(node.id, {
              internalState: { values: newValues },
            });
          }
        } else {
          const result = results.get(node.id);
          if (result !== undefined) {
            updateNode(node.id, { state: result });
          }
        }
      });
    }, 1000 / clockFrequency);

    return () => clearInterval(interval);
  }, [isRunning, clockFrequency, clockCycle, nodes, connections]);

  return (
    <div className="app">
      <div className="lang-switch">
        <button
          className={`lang-btn ${locale === 'zh' ? 'active' : ''}`}
          onClick={() => setLocale('zh')}
        >
          中文
        </button>
        <button
          className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
          onClick={() => setLocale('en')}
        >
          EN
        </button>
      </div>
      <Toolbar />
      <div className="main-content">
        <Canvas />
        <div className="side-panel">
          <PropertiesPanel />
          <MonitorPanel />
        </div>
      </div>
      <Tutorial />
      <TruthTablePanel />
      <KMapPanel />
    </div>
  );
}

export default App;