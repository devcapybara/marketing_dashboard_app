import { useState } from 'react';

const DropdownEditor = ({
  kind,
  options = [],
  value,
  onChange,
  canDelete = () => false,
  onCreate,
  onDelete,
  placeholder = '-',
  menuClass = 'w-56',
}) => {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState('');

  const selectItem = (val) => {
    onChange && onChange(val);
    setOpen(false);
  };

  const handleAddClick = () => {
    setAdding(true);
    setNewVal('');
  };

  const handleSave = async () => {
    if (!newVal.trim()) return;
    const label = newVal.trim();
    try {
      if (onCreate) await onCreate(label);
      if (onChange) onChange(label);
    } finally {
      setAdding(false);
      setOpen(false);
    }
  };

  const handleDelete = async (label) => {
    if (!onDelete) return;
    await onDelete(label);
  };

  return (
    <div className="relative inline-block w-full">
      <button type="button" className="input px-3 py-1 w-full" onClick={() => setOpen((o) => !o)}>
        {value || placeholder}
      </button>
      {open && (
        <div className={`absolute z-20 mt-1 ${menuClass} bg-dark-surface border border-dark-border rounded-lg shadow-lg`}>
          {!adding ? (
            <div className="max-h-48 overflow-auto">
              {options.map((opt) => (
                <div
                  key={opt}
                  className="flex items-center justify-between px-3 py-2 hover:bg-dark-card cursor-pointer"
                  onClick={() => selectItem(opt)}
                >
                  <span>{opt}</span>
                  {canDelete(opt) && (
                    <button
                      className="text-red-500 hover:text-red-400 px-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(opt);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <div className="px-3 py-2 hover:bg-dark-card cursor-pointer" onClick={handleAddClick}>+ Tambah</div>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              <input className="input w-full" value={newVal} onChange={(e) => setNewVal(e.target.value)} placeholder={`Nama ${kind}`} />
              <div className="flex justify-end gap-2">
                <button className="btn-secondary px-2 py-1" onClick={() => { setAdding(false); setOpen(false); }}>Cancel</button>
                <button className="btn-primary px-2 py-1" onClick={handleSave} disabled={!newVal.trim()}>Save</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownEditor;
