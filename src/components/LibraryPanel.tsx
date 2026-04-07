import { useState } from 'react';
import { useCircuitStore, type SavedCircuit } from '../store/circuitStore';
import { useI18n } from '../i18n/useI18n';
import { BookMarked, X, Trash2, FolderOpen } from 'lucide-react';

export function LibraryPanel() {
  const { t } = useI18n();
  const { saveToLibrary, loadFromLibrary, deleteFromLibrary, getLibrary, circuitName } = useCircuitStore();
  const [visible, setVisible] = useState(false);
  const [library, setLibrary] = useState<SavedCircuit[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const open = () => {
    setLibrary(getLibrary());
    setVisible(true);
  };

  const handleSave = () => {
    saveToLibrary();
    setLibrary(getLibrary());
  };

  const handleLoad = (id: string) => {
    loadFromLibrary(id);
    setVisible(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFromLibrary(id);
    setLibrary(getLibrary());
  };

  const handleRenameStart = (entry: SavedCircuit, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(entry.id);
    setRenameValue(entry.name);
  };

  const handleRenameCommit = (id: string) => {
    const lib = getLibrary();
    const updated = lib.map((e) => e.id === id ? { ...e, name: renameValue || e.name } : e);
    localStorage.setItem('dcs_library', JSON.stringify(updated));
    setLibrary(updated);
    setRenamingId(null);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  if (!visible) {
    return (
      <button className="examples-toggle-btn" onClick={open} title={t('library.title')}>
        <BookMarked size={16} />
        <span>{t('library.title')}</span>
      </button>
    );
  }

  return (
    <div className="examples-overlay" onClick={() => setVisible(false)}>
      <div className="examples-panel library-panel" onClick={(e) => e.stopPropagation()}>
        <div className="examples-header">
          <BookMarked size={16} />
          <span>{t('library.title')}</span>
          <button className="panel-close-btn" onClick={() => setVisible(false)}><X size={14} /></button>
        </div>

        <div className="library-save-bar">
          <span className="library-current-name">{t('library.current')}: <strong>{circuitName}</strong></span>
          <button className="library-save-btn" onClick={handleSave}>{t('library.save')}</button>
        </div>

        {library.length === 0 ? (
          <div className="library-empty">{t('library.empty')}</div>
        ) : (
          <div className="library-list">
            {library.map((entry) => (
              <div key={entry.id} className="library-item" onClick={() => handleLoad(entry.id)}>
                <div className="library-item-info">
                  {renamingId === entry.id ? (
                    <input
                      className="library-rename-input"
                      value={renameValue}
                      autoFocus
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameCommit(entry.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRenameCommit(entry.id); if (e.key === 'Escape') setRenamingId(null); }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      className="library-item-name"
                      title={t('library.doubleClickRename')}
                      onDoubleClick={(e) => handleRenameStart(entry, e)}
                    >
                      {entry.name}
                    </span>
                  )}
                  <span className="library-item-meta">{entry.nodeCount} {t('library.nodes')} · {formatDate(entry.savedAt)}</span>
                </div>
                <div className="library-item-actions">
                  <button className="lib-action-btn load" title={t('library.load')} onClick={(e) => { e.stopPropagation(); handleLoad(entry.id); }}>
                    <FolderOpen size={13} />
                  </button>
                  <button className="lib-action-btn delete" title={t('library.delete')} onClick={(e) => handleDelete(entry.id, e)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
