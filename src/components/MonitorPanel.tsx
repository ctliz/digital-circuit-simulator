import { useCircuitStore } from '../store/circuitStore';
import { useI18n } from '../i18n/useI18n';

export function MonitorPanel() {
  const { nodes, isRunning } = useCircuitStore();
  const { t } = useI18n();

  return (
    <div className="monitor-panel">
      <h3>{t('monitor.title')}</h3>
      {!isRunning && (
        <p className="monitor-hint">{t('monitor.hint')}</p>
      )}
      <div className="monitor-list">
        {nodes.map((node) => {
          return (
            <div key={node.id} className={`monitor-item ${node.state ? 'high' : 'low'}`}>
              <span className="monitor-name">
                {t(`gates.${node.type}`)}
                {node.label && <span className="monitor-label"> ({node.label})</span>}
              </span>
              <span className="monitor-state">
                {node.type === 'REGISTER' && node.internalState?.values
                  ? node.internalState.values.map((v) => (v ? '1' : '0')).join('')
                  : node.state
                  ? '1'
                  : '0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}