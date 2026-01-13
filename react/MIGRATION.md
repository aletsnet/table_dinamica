# Guía de Migración - De Vanilla JS a React

Esta guía te ayudará a migrar tu implementación existente de tRebeca (Vanilla JS) a la nueva versión React.

## 📋 Antes de Empezar

### Requisitos Previos
- Node.js 14+ instalado
- npm o yarn
- Tu configuración y datos actuales de trebeca.js

### Tiempo Estimado
- 15-30 minutos para migración básica
- 1-2 horas para personalización completa

## 🔄 Proceso de Migración

### Paso 1: Preparar el Proyecto React

```bash
# Navega a la carpeta react
cd react

# Instala las dependencias
npm install
```

### Paso 2: Localiza tu Configuración Actual

En tu archivo HTML actual (ej: `articulos.html`), busca:

```javascript
const data = [
    // Tus datos actuales
];

const config_default = {
    search: { /* ... */ },
    table: { /* ... */ },
    buttons: [ /* ... */ ]
};
```

**Copia todo el contenido de `data` y `config_default`**

### Paso 3: Pega en App.js

Abre `react/src/App.js` y reemplaza:

```javascript
// ANTES (datos de ejemplo)
const data = [
    {id: 1, code: "...", nombre: 'Pan Blanco...', ...},
    // ...
];

// DESPUÉS (tus datos)
const data = [
    // PEGA AQUÍ TUS DATOS
];
```

```javascript
// ANTES (config de ejemplo)
const config = {
    search: { ... },
    // ...
};

// DESPUÉS (tu config)
const config = {
    // PEGA AQUÍ TU CONFIGURACIÓN
};
```

### Paso 4: Ajustar Funciones Personalizadas

Si tienes funciones personalizadas en tu implementación original:

**Original:**
```javascript
const search_code = (event) => {
    // Tu lógica
};

const upfile = (event) => {
    // Tu lógica
};
```

**En React (App.js):**
```javascript
function App() {
    // ... data y config ...
    
    const searchCode = (event) => {
        // PEGA AQUÍ TU LÓGICA
    };
    
    const upfile = (event) => {
        // PEGA AQUÍ TU LÓGICA
    };
    
    // Actualiza config.table.cols para usar estas funciones
    const config = {
        table: {
            cols: [
                {
                    label: 'Code', 
                    field: 'code', 
                    type: 'text', 
                    function: searchCode,  // Usa la función sin ()
                    typefunc: 'keyup'
                },
                // ...
            ]
        }
    };
}
```

### Paso 5: Migrar Estilos Personalizados

Si tienes CSS personalizado:

**Opción A: Crear archivo CSS**
```bash
# Crea un archivo de estilos
touch react/src/App.css
```

```javascript
// En App.js, importa el CSS
import './App.css';
```

**Opción B: Inline styles**
```javascript
<div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
    <TrebecaTable ... />
</div>
```

### Paso 6: Probar la Aplicación

```bash
# Inicia el servidor de desarrollo
npm start
```

La aplicación se abrirá en `http://localhost:3000`

## 🔍 Verificación

Verifica que todo funcione correctamente:

- [ ] Los datos se muestran en la tabla
- [ ] La búsqueda funciona
- [ ] Puedes editar registros (doble click)
- [ ] Puedes añadir nuevos registros
- [ ] Puedes eliminar registros
- [ ] Los botones personalizados funcionan
- [ ] Las imágenes se cargan correctamente
- [ ] Los campos calculados (total) se actualizan

## 🐛 Problemas Comunes

### Problema 1: Los datos no se muestran

**Causa**: Formato de datos incorrecto

**Solución**: Verifica que cada objeto tenga un campo `id` único:
```javascript
const data = [
    { id: 1, nombre: 'Item 1', ... },  // ✅ Correcto
    { nombre: 'Item 2', ... },          // ❌ Falta id
];
```

### Problema 2: Error "Cannot find module 'bootstrap'"

**Solución**:
```bash
npm install bootstrap sweetalert2
```

### Problema 3: Funciones personalizadas no funcionan

**Causa**: Sintaxis de funciones incorrecta

**Solución**: Asegúrate de pasar la referencia a la función, no invocarla:
```javascript
// ❌ Incorrecto
function: searchCode()

// ✅ Correcto
function: searchCode
```

### Problema 4: Estilos no se ven

**Solución**: Verifica que importaste Bootstrap en App.js:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

## 📝 Ejemplos de Migración

### Ejemplo 1: Tabla Simple

**Original (HTML):**
```html
<script>
const data = [
    {id: 1, nombre: 'Producto A', precio: 100},
    {id: 2, nombre: 'Producto B', precio: 200}
];

const config = {
    table: {
        cols: [
            {label: 'Nombre', field: 'nombre', type: 'text'},
            {label: 'Precio', field: 'precio', type: 'money'},
            {label: '*', field: 'actions', type: 'button', buttons: ['add', 'edit', 'delete', 'save']}
        ]
    }
};

trebeca(config, data);
</script>
```

**React (App.js):**
```javascript
function App() {
    const data = [
        {id: 1, nombre: 'Producto A', precio: 100},
        {id: 2, nombre: 'Producto B', precio: 200}
    ];

    const config = {
        table: {
            cols: [
                {label: 'Nombre', field: 'nombre', type: 'text'},
                {label: 'Precio', field: 'precio', type: 'money'},
                {label: '*', field: 'actions', type: 'button', buttons: ['add', 'edit', 'delete', 'save']}
            ]
        },
        buttons: [
            { name: 'add', label: '<i class="fas fa-plus"></i>', class: 'btn btn-success', modo: 'new' },
            { name: 'edit', label: '<i class="fas fa-edit"></i>', class: 'btn btn-warning', modo: 'row' },
            { name: 'delete', label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger', modo: 'row' },
            { name: 'save', label: '<i class="fas fa-save"></i>', class: 'btn btn-success', modo: 'row' }
        ]
    };

    return (
        <div className="container mt-4">
            <TrebecaTable initialData={data} config={config} />
        </div>
    );
}
```

### Ejemplo 2: Con Función Personalizada

**Original:**
```javascript
const btn_info = (event) => {
    const td = event.target.closest('td');
    const id = td.dataset.id;
    Swal.fire('Info', `ID del registro: ${id}`, 'info');
};

const config = {
    buttons: [
        // ... otros botones
        { 
            name: 'info', 
            label: '<i class="fas fa-info"></i>', 
            class: 'btn btn-info', 
            modo: 'row_extra',
            function: btn_info
        }
    ]
};
```

**React:**
```javascript
function App() {
    const btnInfo = (event) => {
        Swal.fire('Info', 'Información del registro', 'info');
    };

    const config = {
        buttons: [
            // ... otros botones
            { 
                name: 'info', 
                label: '<i class="fas fa-info"></i>', 
                class: 'btn btn-info', 
                modo: 'row_extra',
                function: btnInfo  // Sin ()
            }
        ]
    };

    return <TrebecaTable initialData={data} config={config} />;
}
```

## 🎯 Consejos de Migración

### 1. Migra Gradualmente
- Primero migra solo datos y config básico
- Luego añade funciones personalizadas
- Finalmente personaliza estilos

### 2. Usa Console.log para Debugging
```javascript
const btnInfo = (event) => {
    console.log('Event:', event);
    console.log('Config:', config);
    // Tu lógica aquí
};
```

### 3. Mantén Backup
Guarda tu implementación original hasta verificar que todo funciona en React.

### 4. Aprovecha React DevTools
Instala React DevTools en tu navegador para inspeccionar componentes.

## 📚 Recursos Adicionales

- **QUICKSTART.md** - Inicio rápido
- **README.md** - Documentación completa
- **COMPARISON.md** - Diferencias detalladas

## 🆘 Soporte

Si encuentras problemas durante la migración:

1. Revisa el archivo COMPARISON.md
2. Compara tu código con los ejemplos en App.js
3. Verifica la consola del navegador para errores
4. Asegúrate de que todas las dependencias estén instaladas

## ✅ Checklist de Migración

- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Datos copiados a App.js
- [ ] Configuración copiada a App.js
- [ ] Funciones personalizadas migradas
- [ ] Estilos personalizados aplicados
- [ ] Aplicación probada en desarrollo
- [ ] Todas las funcionalidades verificadas
- [ ] Build de producción creado (`npm run build`)

## 🎉 ¡Migración Completa!

Una vez completados todos los pasos, tu aplicación React está lista para:
- Desarrollo con hot reload
- Build optimizado para producción
- Fácil mantenimiento y escalabilidad
- Mejor rendimiento

---

**¿Tienes preguntas?** Consulta la documentación adicional o revisa los ejemplos en el código.
