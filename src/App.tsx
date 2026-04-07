import { useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { MonitorPanel } from './components/MonitorPanel';
import { Tutorial } from './components/Tutorial';
import { TruthTablePanel } from './components/TruthTablePanel';
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

        if (node.type === 'FLIPFLOP_D') {
          const clkConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'clk'
          );
          const dConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'd'
          );

          if (clkConn && dConn) {
            const clk = results.get(clkConn.source) ?? false;
            const d = results.get(dConn.source) ?? false;
            const lastClk = node.internalState?.lastClock ?? false;
            const risingEdge = clk && !lastClk;

            const newQ = risingEdge ? d : (node.internalState?.q ?? false);
            updateNode(node.id, {
              state: newQ,
              internalState: { q: newQ, lastClock: clk },
            });
          }
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
    </div>
  );
}

export default App;