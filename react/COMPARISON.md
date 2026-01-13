# Comparación: Vanilla JS vs React

Esta guía compara la implementación original en Vanilla JavaScript con la nueva versión en React.

## Arquitectura

### Vanilla JS (articulos.html + trebeca.js)

```
articulos.html
├── HTML completo con Bootstrap
├── Script inline con datos y configuración
└── trebeca.js importado (función global)
```

**Características:**
- Todo en un archivo HTML
- JavaScript ejecutado en el navegador
- Manipulación directa del DOM
- Función trebeca() inicializa la tabla

### React (Estructura modular)

```
react/
├── src/
│   ├── App.js (Lógica principal)
│   ├── components/ (Componentes UI)
│   └── hooks/ (Lógica de negocio)
└── public/ (HTML base)
```

**Características:**
- Componentes reutilizables
- Estado reactivo
- Virtual DOM
- Hooks para lógica

## Código Lado a Lado

### Inicialización

**Vanilla JS:**
```javascript
// En articulos.html
const data = [...];
const config = {...};
trebeca(config, data);
```

**React:**
```javascript
// En App.js
function App() {
  const data = [...];
  const config = {...};
  return <TrebecaTable initialData={data} config={config} />;
}
```

### Gestión del Estado

**Vanilla JS:**
```javascript
// En trebeca.js
let data_show = data;
let editingRowId = null;

// Actualización manual
data_show = data.filter(...);
show_data(); // Re-renderizar manualmente
```

**React:**
```javascript
// En useTrebeca.js
const [dataShow, setDataShow] = useState(data);
const [editingRowId, setEditingRowId] = useState(null);

// Actualización reactiva
setDataShow(data.filter(...)); // React re-renderiza automáticamente
```

### Búsqueda

**Vanilla JS:**
```javascript
const search_data = (search) => {
  const filtered = data.filter(item => {
    return fields.some(field => {
      const value = item[field]?.toString().toLowerCase();
      return value.includes(search.toLowerCase());
    });
  });
  data_show = filtered;
  show_data();
};
```

**React:**
```javascript
const searchData = useCallback((searchTerm) => {
  if (!searchTerm) {
    setDataShow(data);
    return;
  }
  const filtered = data.filter(item => {
    return fields.some(field => {
      const value = item[field]?.toString().toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  });
  setDataShow(filtered);
}, [data, config.search]);
```

### Renderizado de Filas

**Vanilla JS:**
```javascript
// Creación manual de elementos DOM
const newRow = document.createElement('tr');
const td = document.createElement('td');
td.innerHTML = formatter(value, col.type);
newRow.appendChild(td);
tableBody.appendChild(newRow);
```

**React:**
```javascript
// JSX declarativo
return (
  <tr>
    <td>{formatter(value, col.type)}</td>
  </tr>
);
```

### Edición de Filas

**Vanilla JS:**
```javascript
const edit_item = (event) => {
  const tr_row = event.target.closest('tr');
  for (const td of tr_row.children) {
    create_input(td, col); // Modifica el DOM directamente
  }
};
```

**React:**
```javascript
const editItem = useCallback((id) => {
  setEditingRowId(id); // Cambia el estado
  // React re-renderiza automáticamente con inputs
}, []);

// En TableRow
{isEditing ? (
  <input value={value} onChange={handleChange} />
) : (
  formatter(value, type)
)}
```

### Eliminación

**Vanilla JS:**
```javascript
const remove_item = (event) => {
  Swal.fire({...}).then((result) => {
    if (result.isConfirmed) {
      data = data.filter(i => i.id !== id);
      tr_row.remove(); // Elimina del DOM manualmente
      totalCount(); // Actualiza contador
    }
  });
};
```

**React:**
```javascript
const deleteItem = useCallback((id) => {
  Swal.fire({...}).then((result) => {
    if (result.isConfirmed) {
      setData(prev => prev.filter(item => item.id !== id));
      // React actualiza el DOM automáticamente
    }
  });
}, []);
```

## Ventajas de la Versión React

### 1. **Estado Predecible**
- El estado está centralizado en hooks
- React garantiza re-renderizado cuando cambia el estado
- No hay sincronización manual entre datos y UI

### 2. **Componentes Reutilizables**
- `TableRow` puede usarse independientemente
- `TrebecaTable` puede incluirse en cualquier app React
- Fácil mantener y testear

### 3. **Mejor Performance**
- Virtual DOM minimiza manipulaciones reales del DOM
- Re-renderizado selectivo de componentes
- Optimización con `useCallback` y `useMemo`

### 4. **Desarrollo Moderno**
- Hot reloading durante desarrollo
- Mejor debugging con React DevTools
- TypeScript ready
- Testing con Jest/React Testing Library

### 5. **Escalabilidad**
- Fácil añadir nuevas funcionalidades
- Separación clara de responsabilidades
- Código más mantenible

## Cuando Usar Cada Versión

### Usa Vanilla JS si:
- ✅ Necesitas una solución simple y rápida
- ✅ No tienes experiencia con React
- ✅ El proyecto es muy pequeño
- ✅ No necesitas compilar/build
- ✅ Quieres incluir directo en HTML

### Usa React si:
- ✅ El proyecto crecerá con el tiempo
- ✅ Necesitas reutilizar componentes
- ✅ Ya usas React en tu proyecto
- ✅ Quieres mejor testabilidad
- ✅ Necesitas integrar con otras librerías React

## Migración

Para migrar de Vanilla JS a React:

1. **Instala dependencias**
   ```bash
   cd react
   npm install
   ```

2. **Copia tu configuración**
   - Toma tu `config` de `articulos.html`
   - Pégalo en `src/App.js`

3. **Copia tus datos**
   - Toma tu array `data`
   - Pégalo en `src/App.js`

4. **Personaliza**
   - Ajusta estilos en componentes
   - Añade funciones personalizadas en config

5. **Ejecuta**
   ```bash
   npm start
   ```

## Funcionalidades Equivalentes

| Funcionalidad | Vanilla JS | React |
|--------------|------------|-------|
| Búsqueda | ✅ | ✅ |
| Edición inline | ✅ | ✅ |
| CRUD completo | ✅ | ✅ |
| Formateo de datos | ✅ | ✅ |
| Operadores | ✅ | ✅ |
| Carga de imágenes | ✅ | ✅ |
| Confirmaciones | ✅ | ✅ |
| Botones custom | ✅ | ✅ |
| Paginación | ⚠️ Parcial | 🔄 Por implementar |

## Conclusión

Ambas versiones son válidas y funcionales. La versión React ofrece mejor arquitectura y escalabilidad, mientras que la versión Vanilla JS es más directa y simple. Elige según las necesidades de tu proyecto.
