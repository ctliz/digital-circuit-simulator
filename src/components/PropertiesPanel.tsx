import { useCircuitStore } from '../store/circuitStore';
import { useI18n } from '../i18n/useI18n';

export function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNode, clockFrequency, setClockFrequency } =
    useCircuitStore();
  const { t } = useI18n();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="properties-panel">
        <h3>{t('properties.title')}</h3>
        <p className="no-selection">{t('properties.noSelection')}</p>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <h3>{t('properties.title')}</h3>
      <div className="property-group">
        <label>{t('properties.type')}</label>
        <span>{t(`gates.${selectedNode.type}`)}</span>
      </div>
      <div className="property-group">
        <label>{t('properties.id')}</label>
        <span className="node-id">{selectedNode.id}</span>
      </div>
      {selectedNode.type === 'INPUT' && (
        <div className="property-group">
          <label>{t('properties.currentValue')}</label>
          <span className={selectedNode.state ? 'value-high' : 'value-low'}>
            {selectedNode.state ? `1 (${t('properties.highLevel')})` : `0 (${t('properties.lowLevel')})`}
          </span>
        </div>
      )}
      {selectedNode.type === 'CLOCK' && (
        <div className="property-group">
          <label>{t('properties.frequency')}</label>
          <input
            type="number"
            value={clockFrequency}
            onChange={(e) => setClockFrequency(Number(e.target.value))}
            min={0.1}
            max={10}
            step={0.1}
          />
        </div>
      )}
      <div className="property-group">
        <label>{t('properties.label')}</label>
        <input
          type="text"
          value={selectedNode.label || ''}
          onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
          placeholder={t('properties.label') + '...'}
        />
      </div>
    </div>
  );
}