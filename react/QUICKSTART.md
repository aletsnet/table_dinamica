# Guía Rápida - tRebeca React

## Inicio Rápido (Quick Start)

### 1. Instalación

```bash
cd react
npm install
```

### 2. Ejecutar en Desarrollo

```bash
npm start
```

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

### 3. Compilar para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `build/`

## Diferencias con la Versión Vanilla JS

### Estructura de Archivos

**Versión Original:**
- `articulos.html` - Página HTML completa
- `js/trebeca.js` - Lógica JavaScript

**Versión React:**
- `src/App.js` - Componente principal (equivalente a articulos.html)
- `src/hooks/useTrebeca.js` - Lógica de negocio (equivalente a trebeca.js)
- `src/components/` - Componentes reutilizables

### Uso de la Lógica

**Versión Original (trebeca.js):**
```javascript
const config = { /* configuración */ };
const data = [ /* datos */ ];
trebeca(config, data);
```

**Versión React:**
```javascript
import TrebecaTable from './components/TrebecaTable';

function App() {
  const config = { /* configuración */ };
  const data = [ /* datos */ };
  
  return <TrebecaTable initialData={data} config={config} />;
}
```

## Características Implementadas

✅ **Búsqueda en tiempo real** - Busca en múltiples campos sin distinción de acentos
✅ **Edición inline** - Doble click en una fila para editar
✅ **CRUD completo** - Crear, leer, actualizar y eliminar registros
✅ **Tipos de campo** - text, number, money, select, image, etc.
✅ **Operadores** - multiply, sum, rest para campos calculados
✅ **Formateo** - Formato de moneda, teléfono, email, fechas
✅ **Carga de imágenes** - Soporte para subir imágenes localmente
✅ **Confirmaciones** - SweetAlert2 para eliminar registros
✅ **Botones personalizados** - Añade botones extra con funciones personalizadas

## Ejemplo Mínimo

```javascript
import React from 'react';
import TrebecaTable from './components/TrebecaTable';

function SimpleExample() {
  const data = [
    { id: 1, nombre: 'Producto 1', precio: 100 },
    { id: 2, nombre: 'Producto 2', precio: 200 }
  ];

  const config = {
    search: {
      fields: ['nombre']
    },
    table: {
      cols: [
        { label: 'ID', field: 'id', type: 'number' },
        { label: 'Nombre', field: 'nombre', type: 'text' },
        { label: 'Precio', field: 'precio', type: 'money' },
        { label: '*', field: 'actions', type: 'button', buttons: ['add', 'edit', 'delete', 'save'] }
      ]
    },
    buttons: [
      { name: 'add', label: '<i class="fas fa-plus"></i>', class: 'btn btn-success', modo: 'new' },
      { name: 'edit', label: '<i class="fas fa-edit"></i>', class: 'btn btn-warning', modo: 'row' },
      { name: 'delete', label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger', modo: 'row' },
      { name: 'save', label: '<i class="fas fa-save"></i>', class: 'btn btn-success', modo: 'row' }
    ],
    tableClass: 'trebeca'
  };

  return <TrebecaTable initialData={data} config={config} />;
}
```

## Solución de Problemas

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 ya en uso
```bash
# Cambiar puerto
PORT=3001 npm start
```

### No se ven los estilos de Bootstrap
- Verifica que `bootstrap` esté en package.json
- Verifica el import en App.js: `import 'bootstrap/dist/css/bootstrap.min.css';`

## Próximos Pasos

1. Personaliza la configuración en `src/App.js`
2. Añade tus propios datos
3. Modifica los estilos en componentes según necesites
4. Implementa funcionalidades adicionales usando el hook `useTrebeca`

## Recursos

- [Documentación de React](https://reactjs.org/)
- [Bootstrap 5](https://getbootstrap.com/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [Font Awesome](https://fontawesome.com/)

---

**¿Necesitas ayuda?** Consulta el README.md completo para más detalles.
