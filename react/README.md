# tRebeca React - Tabla Dinamica

Versión React de tRebeca - Una herramienta para crear tablas dinámicas con funcionalidades de edición, búsqueda y gestión de datos.

## 🚀 Características

- **Búsquedas Blandas**: Permite hacer búsquedas rápidas en diferentes campos
- **Edición Dinámica**: Edita registros con doble click sobre la fila
- **Gestión de Datos**: Añade, edita y elimina registros
- **React Hooks**: Utiliza hooks personalizados para la lógica de negocio
- **Componentes Reutilizables**: Arquitectura de componentes modular
- **Bootstrap**: Interfaz responsiva con Bootstrap 5
- **SweetAlert2**: Notificaciones y confirmaciones elegantes

## 📁 Estructura del Proyecto

```
react/
├── public/
│   └── index.html          # HTML base
├── src/
│   ├── components/
│   │   ├── TrebecaTable.js  # Componente principal de tabla
│   │   ├── TableRow.js      # Componente de fila con edición
│   │   ├── Navigation.js    # Componente de navegación
│   │   └── Footer.js        # Componente de pie de página
│   ├── hooks/
│   │   └── useTrebeca.js    # Hook personalizado con lógica de trebeca.js
│   ├── App.js               # Componente principal de la aplicación
│   └── index.js             # Punto de entrada
├── package.json             # Dependencias del proyecto
└── README.md                # Este archivo
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. Navega al directorio del proyecto React:
```bash
cd react
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## 📋 Configuración

La configuración de la tabla se realiza mediante un objeto `config` que define:

### Búsqueda
```javascript
search: {
  value: '',
  fields: ['code', 'nombre', 'categoria']
}
```

### Columnas de la Tabla
```javascript
table: {
  cols: [
    {label: 'Code', field: 'code', type: 'text'},
    {label: 'Producto', field: 'nombre', type: 'text', valuedefault: 'Nuevo Producto'},
    {label: 'Precio', field: 'precio', type: 'money'},
    {label: 'Cantidad', field: 'cantidad', type: 'number'},
    {label: 'Total', field: 'total', type: 'money', operator: 'multiply', reference: ["cantidad", "precio"]},
    {label: 'Categoría', field: 'categoria', type: 'select', options: [...]},
    {label: 'Foto', field: 'foto', type: 'image'},
    {label: '*', field: 'actions', type: 'button', buttons: ["add", "edit", "delete", "save"]}
  ]
}
```

### Tipos de Campos Soportados
- `text`: Campo de texto
- `number`: Campo numérico
- `money`: Campo de moneda (formato mexicano)
- `email`: Campo de correo electrónico
- `date`: Campo de fecha
- `select`: Lista desplegable
- `textarea`: Área de texto
- `image`: Campo de imagen con carga de archivos
- `button`: Botones de acción

### Operadores
- `multiply`: Multiplica valores de campos referenciados
- `sum`: Suma valores de campos referenciados
- `rest`: Resta valores de campos referenciados
- `concat`: Concatena valores de campos

## 🎯 Uso

### Componente TrebecaTable

```javascript
import TrebecaTable from './components/TrebecaTable';

function App() {
  const data = [
    {id: 1, nombre: 'Producto 1', precio: 100, cantidad: 5},
    // ... más datos
  ];

  const config = {
    search: { fields: ['nombre'] },
    table: {
      cols: [
        {label: 'Nombre', field: 'nombre', type: 'text'},
        {label: 'Precio', field: 'precio', type: 'money'},
        {label: '*', field: 'actions', type: 'button', buttons: ["add", "edit", "delete", "save"]}
      ]
    },
    buttons: [
      { name: "add", label: '<i class="fas fa-plus"></i>', class: 'btn btn-success', modo: "new" },
      // ... más botones
    ]
  };

  return <TrebecaTable initialData={data} config={config} />;
}
```

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Crea una versión de producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de webpack

## 🌟 Funcionalidades Principales

### 1. Búsqueda
- Búsqueda en tiempo real
- Filtrado por múltiples campos
- Sin distinción de acentos

### 2. Edición
- Doble click para editar
- Validación de campos
- Guardado/Cancelación

### 3. Gestión
- Añadir nuevos registros
- Eliminar con confirmación
- Actualización en tiempo real

### 4. Imágenes
- Carga de imágenes local
- Vista previa inmediata
- Conversión a base64

## 📱 Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móviles

## 🔄 Migración desde Vanilla JS

Esta versión React mantiene la misma funcionalidad que `trebeca.js` pero con las siguientes mejoras:

- **Estado Reactivo**: Gestión automática del estado con React hooks
- **Componentes Reutilizables**: Arquitectura modular y mantenible
- **Mejor Rendimiento**: Re-renderizado optimizado
- **TypeScript Ready**: Fácil de migrar a TypeScript si es necesario

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia que se encuentra en el proyecto principal.

## 👥 Basado en

Este proyecto es la versión React de la implementación vanilla JavaScript original (`trebeca.js` y `articulos.html`).

---

**¡Gracias por usar tRebeca React!** Si te resulta útil, no olvides darle una ⭐.
