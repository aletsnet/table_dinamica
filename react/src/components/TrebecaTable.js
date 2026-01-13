import React, { useState } from 'react';
import { useTrebeca } from '../hooks/useTrebeca';
import TableRow from './TableRow';

const TrebecaTable = ({ initialData, config }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    dataShow,
    editingRowId,
    formatter,
    operators,
    searchData,
    addItem,
    editItem,
    saveItem,
    cancelEdit,
    deleteItem
  } = useTrebeca(initialData, config);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchData(value);
  };

  const getButtonConfig = (name) => {
    return config.buttons?.find(btn => btn.name === name) || {};
  };

  const actionColumn = config.table.cols.find(col => col.field === 'actions');

  return (
    <div>
      <table className={`table table-striped ${config.tableClass || ''}`}>
        <thead>
          {config.search && (
            <tr>
              <th colSpan={config.table.cols.length - 1}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </th>
              <th>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => searchData(searchTerm)}
                >
                  <i className="fas fa-search"></i>
                </button>
              </th>
            </tr>
          )}
          <tr>
            {config.table.cols.map((col, idx) => (
              <th key={idx}>
                {col.type === 'button' && actionColumn?.buttons?.includes('add') ? (
                  <button
                    type="button"
                    className={getButtonConfig('add').class || 'btn btn-success'}
                    onClick={addItem}
                    dangerouslySetInnerHTML={{ __html: getButtonConfig('add').label || '<i class="fas fa-plus"></i>' }}
                  />
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataShow.length === 0 ? (
            <tr>
              <td colSpan={config.table.cols.length}>No hay datos disponibles</td>
            </tr>
          ) : (
            dataShow.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                config={config}
                isEditing={editingRowId === row.id}
                onEdit={() => editItem(row.id)}
                onSave={saveItem}
                onCancel={cancelEdit}
                onDelete={() => deleteItem(row.id)}
                formatter={formatter}
                operators={operators}
              />
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={config.table.cols.length} className="text-end">
              Total: <span>{dataShow.length}</span>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TrebecaTable;
