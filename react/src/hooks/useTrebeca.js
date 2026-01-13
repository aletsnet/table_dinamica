import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';

export const useTrebeca = (initialData, config) => {
  const [data, setData] = useState(initialData);
  const [dataShow, setDataShow] = useState(initialData);
  const [editingRowId, setEditingRowId] = useState(null);

  // Formatters
  const formatMoney = (amount) => {
    const number = parseFloat(amount);
    return isNaN(number) ? amount : number.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  };

  const formatPhone = (phone) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
    }
    return phone;
  };

  const formatEmail = (email) => {
    return email.toLowerCase();
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (!isNaN(d)) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return date;
  };

  const formatter = useCallback((value, type) => {
    switch (type) {
      case 'money':
        return formatMoney(value);
      case 'phone':
        return formatPhone(value);
      case 'email':
        return formatEmail(value);
      case 'date':
        return formatDate(value);
      case 'image':
        return value;
      default:
        return value;
    }
  }, []);

  const unformatter = useCallback((value, type) => {
    let result = value;
    switch (type) {
      case 'money':
        result = value.replace(/[^\d.-]/g, '');
        break;
      case 'phone':
        result = value.replace(/\D/g, '');
        break;
      case 'email':
        result = value.trim();
        break;
      case 'date':
        const parts = value.split('/');
        if (parts.length === 3) {
          result = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        break;
      default:
        result = value;
        break;
    }
    return result;
  }, []);

  // Operators for calculated fields
  const operators = useCallback((item, operator, value) => {
    let result = null;
    if (typeof value === 'object' && Array.isArray(value) && typeof item.id !== 'undefined') {
      switch (operator) {
        case 'rest':
          result = 0;
          for (const v of value) {
            result -= item[v] || 0;
          }
          break;
        case 'sum':
          result = 0;
          for (const v of value) {
            result += item[v] || 0;
          }
          break;
        case 'multiply':
          result = 1;
          for (const v of value) {
            result *= item[v] || 1;
          }
          break;
        case 'concat':
          result = value.join(', ');
          break;
        default:
          result = value.join(' ');
          break;
      }
    }
    return result;
  }, []);

  // Search functionality
  const searchData = useCallback((searchTerm) => {
    if (!searchTerm) {
      setDataShow(data);
      return;
    }

    const fields = config.search?.fields || [];
    const removeAccents = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filtered = data.filter(item => {
      return fields.some(field => {
        const value = item[field] ? removeAccents(item[field].toString().toLowerCase()) : "";
        const searchNorm = removeAccents(searchTerm.toLowerCase());
        return value.includes(searchNorm);
      });
    });

    setDataShow(filtered);
  }, [data, config.search]);

  // Add new item
  const addItem = useCallback(() => {
    const newItem = {
      id: Date.now().toString()
    };

    // Initialize with default values from config
    config.table.cols.forEach(col => {
      if (col.type !== 'button') {
        newItem[col.field] = col.valuedefault || '';
      }
    });

    setData(prev => [newItem, ...prev]);
    setDataShow(prev => [newItem, ...prev]);
    setEditingRowId(newItem.id);

    if (typeof config.add === 'function') {
      config.add();
    }
  }, [config]);

  // Edit item
  const editItem = useCallback((id) => {
    setEditingRowId(id);
    if (typeof config.edit === 'function') {
      config.edit({ target: { id } });
    }
  }, [config]);

  // Save item
  const saveItem = useCallback((id, updatedItem) => {
    setData(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index !== -1) {
        const newData = [...prev];
        newData[index] = { ...updatedItem, id };
        return newData;
      }
      return prev;
    });

    setDataShow(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index !== -1) {
        const newData = [...prev];
        newData[index] = { ...updatedItem, id };
        return newData;
      }
      return prev;
    });

    setEditingRowId(null);

    if (typeof config.save === 'function') {
      config.save({ target: { id } });
    }
  }, [config]);

  // Cancel edit
  const cancelEdit = useCallback(() => {
    setEditingRowId(null);
    if (typeof config.cancel === 'function') {
      config.cancel();
    }
  }, [config]);

  // Delete item
  const deleteItem = useCallback((id) => {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: '¿Estás seguro de eliminar este registro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          setData(prev => prev.filter(item => item.id !== id));
          setDataShow(prev => prev.filter(item => item.id !== id));

          if (typeof config.delete === 'function') {
            config.delete({ target: { id } });
          }
        }
      });
    } else {
      if (window.confirm("¿Estás seguro de eliminar este registro?")) {
        setData(prev => prev.filter(item => item.id !== id));
        setDataShow(prev => prev.filter(item => item.id !== id));

        if (typeof config.delete === 'function') {
          config.delete({ target: { id } });
        }
      }
    }
  }, [config]);

  return {
    data,
    dataShow,
    editingRowId,
    formatter,
    unformatter,
    operators,
    searchData,
    addItem,
    editItem,
    saveItem,
    cancelEdit,
    deleteItem
  };
};
