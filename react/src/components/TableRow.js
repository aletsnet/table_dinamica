import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const TableRow = ({ row, config, isEditing, onEdit, onSave, onCancel, onDelete, formatter, operators }) => {
  const [editedRow, setEditedRow] = useState({ ...row });

  useEffect(() => {
    setEditedRow({ ...row });
  }, [row, isEditing]);

  const handleFieldChange = (field, value) => {
    setEditedRow(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(row.id, editedRow);
  };

  const handleImageUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleFieldChange(field, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCodeSearch = (event) => {
    if (event.key === 'Enter') {
      const col = config.table.cols.find(c => c.field === 'code');
      if (col && typeof col.function === 'function') {
        col.function(event);
      }
    }
  };

  const getButtonConfig = (name) => {
    return config.buttons?.find(btn => btn.name === name) || {};
  };

  const renderCell = (col) => {
    let value = editedRow[col.field] || '';

    // Handle operators for calculated fields
    if (col.operator && col.reference) {
      value = operators(editedRow, col.operator, col.reference);
    }

    if (isEditing && col.type !== 'button' && col.edit !== false) {
      switch (col.type) {
        case 'text':
        case 'number':
        case 'email':
        case 'url':
        case 'date':
          return (
            <input
              type={col.type === 'money' ? 'number' : col.type}
              className="form-control form-control-sm"
              value={value}
              onChange={(e) => handleFieldChange(col.field, e.target.value)}
              onKeyUp={col.field === 'code' ? handleCodeSearch : undefined}
              placeholder={col.placeholder || col.label}
              step={col.type === 'number' || col.type === 'money' ? '0.01' : undefined}
            />
          );
        case 'money':
          return (
            <input
              type="number"
              className="form-control form-control-sm"
              value={value}
              onChange={(e) => handleFieldChange(col.field, e.target.value)}
              placeholder={col.placeholder || col.label}
              step="0.01"
            />
          );
        case 'textarea':
          return (
            <textarea
              className="form-control form-control-sm"
              value={value}
              onChange={(e) => handleFieldChange(col.field, e.target.value)}
              placeholder={col.placeholder || col.label}
            />
          );
        case 'select':
          return (
            <select
              className="form-select form-select-sm"
              value={value}
              onChange={(e) => handleFieldChange(col.field, e.target.value)}
            >
              {col.options?.map((option, idx) => (
                <option key={idx} value={option.value || option}>
                  {option.label || option}
                </option>
              ))}
            </select>
          );
        case 'image':
          return (
            <div>
              <img
                src={value || col.valuedefault}
                alt={col.label}
                style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => document.getElementById(`file-${row.id}-${col.field}`).click()}
              />
              <input
                id={`file-${row.id}-${col.field}`}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleImageUpload(col.field, e)}
              />
            </div>
          );
        default:
          if (col.operator) {
            return formatter(value, col.type);
          }
          return (
            <input
              type="text"
              className="form-control form-control-sm"
              value={value}
              onChange={(e) => handleFieldChange(col.field, e.target.value)}
            />
          );
      }
    } else {
      // Display mode
      if (col.type === 'image') {
        return (
          <img
            src={value || col.valuedefault}
            alt={col.label}
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        );
      } else if (col.type === 'button') {
        const actionConfig = config.table.cols.find(c => c.field === 'actions');
        return (
          <div>
            {actionConfig?.buttons?.includes('edit') && (
              <button
                type="button"
                className={getButtonConfig('edit').class || 'btn btn-warning btn-sm me-1'}
                onClick={onEdit}
                style={{ display: isEditing ? 'none' : 'inline-block' }}
                dangerouslySetInnerHTML={{ __html: getButtonConfig('edit').label || '<i class="fas fa-edit"></i>' }}
              />
            )}
            {actionConfig?.buttons?.includes('delete') && (
              <button
                type="button"
                className={getButtonConfig('delete').class || 'btn btn-danger btn-sm'}
                onClick={onDelete}
                style={{ display: isEditing ? 'none' : 'inline-block' }}
                dangerouslySetInnerHTML={{ __html: getButtonConfig('delete').label || '<i class="fas fa-trash"></i>' }}
              />
            )}
            {actionConfig?.buttons?.includes('save') && (
              <>
                <button
                  type="button"
                  className={getButtonConfig('save').class || 'btn btn-success btn-sm me-1'}
                  onClick={handleSave}
                  style={{ display: isEditing ? 'inline-block' : 'none' }}
                  dangerouslySetInnerHTML={{ __html: getButtonConfig('save').label || '<i class="fas fa-save"></i>' }}
                />
                <button
                  type="button"
                  className={getButtonConfig('cancel').class || 'btn btn-secondary btn-sm'}
                  onClick={onCancel}
                  style={{ display: isEditing ? 'inline-block' : 'none' }}
                  dangerouslySetInnerHTML={{ __html: getButtonConfig('cancel').label || '<i class="fas fa-times"></i>' }}
                />
              </>
            )}
            {config.buttons?.filter(btn => btn.modo === 'row_extra').map((btn, idx) => (
              <button
                key={idx}
                type="button"
                className={btn.class}
                onClick={(e) => btn.function && btn.function(e)}
                dangerouslySetInnerHTML={{ __html: btn.label }}
              />
            ))}
          </div>
        );
      }
      return formatter(value, col.type);
    }
  };

  return (
    <tr onDoubleClick={!isEditing ? onEdit : undefined}>
      {config.table.cols.map((col, idx) => (
        <td key={idx} data-field={col.field} data-type={col.type}>
          {renderCell(col)}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
