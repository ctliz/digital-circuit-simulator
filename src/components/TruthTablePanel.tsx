import { useState } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { useI18n } from '../i18n/useI18n';
import { generateTruthTable } from '../logic/circuitEngine';
import { Table } from 'lucide-react';

export function TruthTablePanel() {
  const { nodes, connections } = useCircuitStore();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [truthTable, setTruthTable] = useState<{
    inputs: string[];
    outputs: string[];
    rows: boolean[][];
  } | null>(null);

  const handleGenerate = () => {
    const table = generateTruthTable(nodes, connections);
    setTruthTable(table);
  };

  if (!isOpen) {
    return (
      <button className="truth-table-toggle" onClick={() => setIsOpen(true)}>
        <Table size={18} />
        <span>{t('truthTable.title')}</span>
      </button>
    );
  }

  return (
    <div className="truth-table-panel">
      <div className="truth-table-header">
        <h3>{t('truthTable.title')}</h3>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
      </div>

      <button className="generate-btn" onClick={handleGenerate}>
        {t('truthTable.generate')}
      </button>

      {truthTable ? (
        truthTable.inputs.length === 0 ? (
          <p className="no-inputs">{t('properties.noSelection')}</p>
        ) : (
          <div className="truth-table-container">
            <table className="truth-table">
              <thead>
                <tr>
                  {truthTable.inputs.map((input, i) => (
                    <th key={`in-${i}`}>{input}</th>
                  ))}
                  {truthTable.outputs.map((output, i) => (
                    <th key={`out-${i}`} className="output-col">{output}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {truthTable.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((val, colIndex) => (
                      <td
                        key={colIndex}
                        className={val ? 'high' : 'low'}
                      >
                        {val ? '1' : '0'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <p className="hint">{t('monitor.hint')}</p>
      )}
    </div>
  );
}
