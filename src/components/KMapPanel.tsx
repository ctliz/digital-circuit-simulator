import { useState } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { useI18n } from '../i18n/useI18n';
import { Grid3X3 } from 'lucide-react';

export function KMapPanel() {
  const { nodes } = useCircuitStore();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [inputCount, setInputCount] = useState(2);
  const [kmapValues, setKmapValues] = useState<boolean[][]>([[false, false], [false, false]]);

  const inputNodes = nodes.filter((n) => n.type === 'INPUT');
  const outputNodes = nodes.filter((n) => n.type === 'OUTPUT');

  const generateKMap = () => {
    if (inputCount === 2) {
      setKmapValues([
        [false, false],
        [false, false],
      ]);
    } else if (inputCount === 3) {
      setKmapValues([
        [false, false, false, false],
        [false, false, false, false],
      ]);
    } else if (inputCount === 4) {
      setKmapValues([
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
      ]);
    }
  };

  const toggleCell = (row: number, col: number) => {
    const newValues = kmapValues.map((r, i) =>
      r.map((v, j) => (i === row && j === col ? !v : v))
    );
    setKmapValues(newValues);
  };

  if (!isOpen) {
    return (
      <button className="kmap-toggle" onClick={() => setIsOpen(true)}>
        <Grid3X3 size={18} />
        <span>K-Map</span>
      </button>
    );
  }

  return (
    <div className="kmap-panel">
      <div className="kmap-header">
        <h3>Karnaugh Map</h3>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
      </div>

      <div className="kmap-controls">
        <label>{t('kmap.variables')}:</label>
        <select
          value={inputCount}
          onChange={(e) => setInputCount(Number(e.target.value))}
        >
          <option value={2}>2 ({t('kmap.vars')})</option>
          <option value={3}>3 ({t('kmap.vars')})</option>
          <option value={4}>4 ({t('kmap.vars')})</option>
        </select>
        <button className="generate-btn" onClick={generateKMap}>
          {t('kmap.generate')}
        </button>
      </div>

      <div className="kmap-info">
        <p>{t('kmap.hint')}</p>
        <p>{inputNodes.length} {t('kmap.inputs')}, {outputNodes.length} {t('kmap.outputs')}</p>
      </div>

      <div className="kmap-container">
        {inputCount === 2 && (
          <table className="kmap-table">
            <thead>
              <tr>
                <th></th>
                <th>0</th>
                <th>1</th>
              </tr>
            </thead>
            <tbody>
              {[['0', '0'], ['1', '1']].map((rowHeader, i) => (
                <tr key={i}>
                  <th>{rowHeader}</th>
                  {kmapValues[i]?.map((val, j) => (
                    <td
                      key={j}
                      className={val ? 'one' : 'zero'}
                      onClick={() => toggleCell(i, j)}
                    >
                      {val ? '1' : '0'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {inputCount === 3 && (
          <table className="kmap-table">
            <thead>
              <tr>
                <th></th>
                <th>00</th>
                <th>01</th>
                <th>11</th>
                <th>10</th>
              </tr>
            </thead>
            <tbody>
              {[['0'], ['1']].map((rowHeader, i) => (
                <tr key={i}>
                  <th>{rowHeader}</th>
                  {kmapValues[i]?.map((val, j) => (
                    <td
                      key={j}
                      className={val ? 'one' : 'zero'}
                      onClick={() => toggleCell(i, j)}
                    >
                      {val ? '1' : '0'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {inputCount === 4 && (
          <table className="kmap-table">
            <thead>
              <tr>
                <th></th>
                <th>00</th>
                <th>01</th>
                <th>11</th>
                <th>10</th>
              </tr>
            </thead>
            <tbody>
              {[['00', '0'], ['01', '1'], ['11', '1'], ['10', '0']].map((rowHeader, i) => (
                <tr key={i}>
                  <th>{rowHeader[0]}</th>
                  {kmapValues[i]?.map((val, j) => (
                    <td
                      key={j}
                      className={val ? 'one' : 'zero'}
                      onClick={() => toggleCell(i, j)}
                    >
                      {val ? '1' : '0'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="kmap-legend">
        <span className="legend-item"><span className="one-box">1</span> = {t('kmap.high')}</span>
        <span className="legend-item"><span className="zero-box">0</span> = {t('kmap.low')}</span>
      </div>
    </div>
  );
}
