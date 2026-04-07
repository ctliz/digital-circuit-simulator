import { useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { MonitorPanel } from './components/MonitorPanel';
import { Tutorial } from './components/Tutorial';
import { TruthTablePanel } from './components/TruthTablePanel';
import { KMapPanel } from './components/KMapPanel';
import { useCircuitStore } from './store/circuitStore';
import { useI18n } from './i18n/useI18n';
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
        } else if (node.type === 'REGISTER' || node.type === 'REGISTER_8BIT') {
          const loadConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'load'
          );
          const load = loadConn ? (results.get(loadConn.source) ?? false) : false;

          if (load) {
            const bitCount = node.type === 'REGISTER' ? 4 : 8;
            const handles = Array.from({ length: bitCount }, (_, i) => `d${i}`);
            const newValues = handles.map((handle) => {
              const conn = connections.find(
                (c) => c.target === node.id && c.targetHandle === handle
              );
              return conn ? (results.get(conn.source) ?? false) : false;
            });
            updateNode(node.id, {
              internalState: { values: newValues },
            });
          }
        } else if (node.type === 'REGISTER_16BIT') {
          const loadConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'load'
          );
          const load = loadConn ? (results.get(loadConn.source) ?? false) : false;

          if (load) {
            const handles = Array.from({ length: 16 }, (_, i) => `d${i}`);
            const newValues = handles.map((handle) => {
              const conn = connections.find(
                (c) => c.target === node.id && c.targetHandle === handle
              );
              return conn ? (results.get(conn.source) ?? false) : false;
            });
            updateNode(node.id, {
              internalState: { values: newValues },
            });
          }
        } else if (node.type === 'SHIFT_REGISTER') {
          const clkConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'clk'
          );
          const loadConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'load'
          );
          const dInConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'dIn'
          );
          const clk = clkConn ? (results.get(clkConn.source) ?? false) : false;
          const load = loadConn ? (results.get(loadConn.source) ?? false) : false;
          const dIn = dInConn ? (results.get(dInConn.source) ?? false) : false;
          const lastClk = node.internalState?.lastClock ?? false;
          const risingEdge = clk && !lastClk;
          const currentValues = node.internalState?.values ?? [false, false, false, false];
          
          let newValues: boolean[];
          if (load && risingEdge) {
            newValues = [dIn, ...currentValues.slice(0, 3)];
          } else {
            newValues = currentValues;
          }
          updateNode(node.id, {
            internalState: { values: newValues, shiftValue: dIn, lastClock: clk },
          });
        } else if (node.type === 'COUNTER_8BIT') {
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
          const newCount = reset ? 0 : (risingEdge ? (currentCount + 1) % 256 : currentCount);
          updateNode(node.id, {
            internalState: { count: newCount, lastClock: clk },
          });
        } else if (node.type === 'RAM_16x4') {
          const addrConns = ['addr0', 'addr1', 'addr2', 'addr3'].map((h) =>
            connections.find((c) => c.target === node.id && c.targetHandle === h)
          );
          const dataConns = ['d0', 'd1', 'd2', 'd3'].map((h) =>
            connections.find((c) => c.target === node.id && c.targetHandle === h)
          );
          const weConn = connections.find((c) => c.target === node.id && c.targetHandle === 'we');
          const clkConn = connections.find((c) => c.target === node.id && c.targetHandle === 'clk');

          const addr = addrConns.reduce((acc, conn, i) => {
            const bit = conn ? (results.get(conn.source) ?? false) : false;
            return acc + (bit ? (1 << i) : 0);
          }, 0);
          const we = weConn ? (results.get(weConn.source) ?? false) : false;
          const clk = clkConn ? (results.get(clkConn.source) ?? false) : false;
          const lastClk = node.internalState?.lastClock ?? false;
          const risingEdge = clk && !lastClk;

          const currentMemory = node.internalState?.memory ?? Array.from({ length: 16 }, () => [false, false, false, false]);
          const newMemory = currentMemory.map((row) => [...row]);

          if (we && risingEdge) {
            newMemory[addr] = dataConns.map((conn) =>
              conn ? (results.get(conn.source) ?? false) : false
            );
          }

          updateNode(node.id, {
            internalState: { memory: newMemory, lastClock: clk },
          });
        } else if (node.type === 'ROM_16x4') {
          // ROM is combinational — just update address output passively (no clock needed)
          // The actual output is computed in the render via internalState
          // No state changes needed here since ROM content is fixed
        } else if (node.type === 'STATE_MACHINE') {
          const inputConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'input'
          );
          const clkConn = connections.find(
            (c) => c.target === node.id && c.targetHandle === 'clk'
          );
          const inputVal = inputConn ? (results.get(inputConn.source) ?? false) : false;
          const clk = clkConn ? (results.get(clkConn.source) ?? false) : false;
          const lastClk = node.internalState?.lastClock ?? false;
          const risingEdge = clk && !lastClk;
          const currentState = node.internalState?.stateValue ?? 0;
          
          let newState = currentState;
          if (risingEdge) {
            newState = (currentState + 1) % 4;
          }
          updateNode(node.id, {
            state: inputVal,
            internalState: { stateValue: newState, lastClock: clk },
          });
        } else {
          const result = results.get(node.id);
          if (result !== undefined) {
            updateNode(node.id, { state: result });
          }
        }
      });
    }, 1000 / clockFrequency);

    return () => clearInterval(interval);
  }, [isRunning, clockFrequency, clockCycle, nodes, connections, updateNode, incrementClockCycle]);

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