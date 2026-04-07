import { useState } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { useI18n } from '../i18n/useI18n';
import { examples, type ExampleCategory } from '../data/examples';
import { BookOpen, X } from 'lucide-react';

const CATEGORIES: Array<{ key: ExampleCategory | 'all'; labelKey: string; color: string }> = [
  { key: 'all',        labelKey: 'examples.catAll',        color: '#64748b' },
  { key: 'basic',      labelKey: 'examples.catBasic',      color: '#3b82f6' },
  { key: 'arithmetic', labelKey: 'examples.catArithmetic', color: '#8b5cf6' },
  { key: 'sequential', labelKey: 'examples.catSequential', color: '#10b981' },
  { key: 'counter',    labelKey: 'examples.catCounter',    color: '#f59e0b' },
  { key: 'codec',      labelKey: 'examples.catCodec',      color: '#ef4444' },
  { key: 'memory',     labelKey: 'examples.catMemory',     color: '#06b6d4' },
];

const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  CATEGORIES.filter((c) => c.key !== 'all').map((c) => [c.key, c.color])
);

export function ExamplesPanel() {
  const { t } = useI18n();
  const { loadExample } = useCircuitStore();
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ExampleCategory | 'all'>('all');

  const handleLoad = (ex: typeof examples[0]) => {
    loadExample(ex.nodes, ex.connections, ex.clockFrequency);
    setVisible(false);
  };

  const filtered = activeCategory === 'all' ? examples : examples.filter((e) => e.category === activeCategory);

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
      <div className="examples-panel" onClick={(e) => e.stopPropagation()}>
        <div className="examples-header">
          <BookOpen size={16} />
          <span>{t('examples.title')}</span>
          <button className="panel-close-btn" onClick={() => setVisible(false)}><X size={14} /></button>
        </div>

        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
              style={activeCategory === cat.key ? { borderColor: cat.color, color: cat.color } : undefined}
              onClick={() => setActiveCategory(cat.key)}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        <div className="examples-grid">
          {filtered.map((ex) => (
            <div key={ex.id} className="example-card" onClick={() => handleLoad(ex)}>
              <div className="example-card-top">
                <div className="example-name">{t(ex.nameKey)}</div>
                <span
                  className="example-category-badge"
                  style={{ background: CATEGORY_COLOR[ex.category] + '22', color: CATEGORY_COLOR[ex.category], borderColor: CATEGORY_COLOR[ex.category] + '55' }}
                >
                  {t(`examples.cat${ex.category.charAt(0).toUpperCase()}${ex.category.slice(1)}`)}
                </span>
              </div>
              <div className="example-desc">{t(ex.descKey)}</div>
              <div className="example-load">{t('examples.load')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
