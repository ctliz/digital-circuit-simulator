import { useState } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { useI18n } from '../i18n/useI18n';
import { examples } from '../data/examples';
import { BookOpen, X } from 'lucide-react';

export function ExamplesPanel() {
  const { t } = useI18n();
  const { loadExample } = useCircuitStore();
  const [visible, setVisible] = useState(false);

  const handleLoad = (ex: typeof examples[0]) => {
    loadExample(ex.nodes, ex.connections, ex.clockFrequency);
    setVisible(false);
  };

  if (!visible) {
    return (
      <button className="examples-toggle-btn" onClick={() => setVisible(true)} title={t('examples.title')}>
        <BookOpen size={16} />
        <span>{t('examples.title')}</span>
      </button>
    );
  }

  return (
    <div className="examples-overlay" onClick={() => setVisible(false)}>
      <div className="examples-panel" onClick={e => e.stopPropagation()}>
        <div className="examples-header">
          <BookOpen size={16} />
          <span>{t('examples.title')}</span>
          <button className="panel-close-btn" onClick={() => setVisible(false)}><X size={14} /></button>
        </div>
        <div className="examples-grid">
          {examples.map(ex => (
            <div key={ex.id} className="example-card" onClick={() => handleLoad(ex)}>
              <div className="example-name">{t(ex.nameKey)}</div>
              <div className="example-desc">{t(ex.descKey)}</div>
              <div className="example-load">{t('examples.load')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
