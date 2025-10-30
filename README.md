# tRebeca - Tabla Dinamica

Es una herramienta que permite crear tablas dinamicas en un proyecto sencillo de html/html5

## 🚀 Características

- **Busquedas Blandas**: Permite hacer busquedas rapidas a diferentes campos
- **Multitablas**: Permite tener varias tablas dinamicas en el mismo page
- **Edicion Dinamica**: Permite Editar un registro con un doble click sobre el registro
- **JavaScript Vanilla**: Se usa JS Vainilla

## 📁 Estructura del Proyecto

```
proyecto/
├── index.html          # Page donde se va implementar
├── css/
│   └── style.css      # Estilos personalizados
├── js/
    └── trebeca.js      # Funcionalidad tRebeca JavaScript
```

## Configuracion

```
const config_default = {
        search: {
            value: '',
            fields: ['campo1', 'campo2', 'campo...']
        },
        table: {
            cols: [
                //label: #titulo
                //field: #campo
                //type: #tipo de dato: text, number, phone, date, money, button
                {label: 'ID', field: 'id', type: 'number', min: 1},
                {label: 'Nombre', field: 'name', type : 'text'},
                {label: 'Edad', field: 'age', type: 'number'},
                {label: 'Ciudad', field: 'city', type: 'text'},
                {label: 'Telefono', field: 'phone', type: 'phone'},
                {label: 'Email', field: 'email', type: 'email'},
                {label: 'Sueldo', field: 'salary', type: 'money'},
                //recomedamos siempre incluir el campo id y conservar el un campo con los botones
                {label: '*', field: 'actions', type: 'button', buttons: ["add", "edit", "delete", "save"]}
            ],
            footer: {
                label: 'Total de registros:',
                field: 'count',
                type: 'text'
            }
        },
        //Personalizar botones
        //modo: "row_extra" permite añadir botones personalizados
        buttons: [
                    { name: "add", label: '<i class="fas fa-plus"></i>', class: 'btn btn-success btn-sm me-1', modo: "new"  },
                    { name: "edit", label: '<i class="fas fa-edit"></i>', class: 'btn btn-warning btn-sm me-1', modo: "row" },
                    { name: "delete", label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger btn-sm me-1', modo: "row" },
                    { name: "save", label: '<i class="fas fa-save"></i>', class: 'btn btn-success btn-sm me-1', modo: "row" },
                    { name: "btn_extra", label: '<i class="fas fa-info-circle"></i>', class: 'btn btn-info btn-sm m-1', modo: "row_extra", function: (event) => { show_data(event) } },
                ],
        tableClass: 'miTabla',
        // Usando referencias a funciones (más seguro que eval)
        add: (event) => {btn_add(event)},
        edit: (event) => {btn_edit(event)},
        delete: (event) => {btn_delete(event)},   
        save: (event) => {btn_save(event)},
    };
```


## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos y animaciones personalizadas
- **Bootstrap 5.3.0**: Framework CSS responsivo
- **JavaScript ES6+**: Lógica de aplicación

### CDN Externos
- Bootstrap CSS/JS
- Font Awesome (iconos)

## 📋 Funcionalidades

### 1. Navegación
- Menú responsivo con Bootstrap
- Navegación suave entre secciones
- Indicadores visuales de sección activa

### 2. Contador Interactivo
- Incremento de contador con animaciones
- Notificaciones cada 10 clicks
- Efectos visuales en tiempo real

### 3. Formulario de Contacto
- Validación en tiempo real
- Simulación de envío con feedback
- Campos requeridos con validación

### 4. Diseño Responsivo
- Adaptable a móviles, tablets y desktop
- Grid system de Bootstrap
- Componentes flexibles

## 🚀 Cómo Usar

### Opción 1: Abrir Directamente
1. Abre el archivo `index.html` en tu navegador
2. ¡Listo! La página se cargará con todas las funcionalidades

### Funcionalidades JavaScript
El archivo `js/trebeca.js` incluye:

- Contador interactivo
- Validación de formularios
- Sistema de notificaciones
- Navegación suave
- Animaciones

## 📱 Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móviles

**¡Gracias por usar este proyecto!** Si te resulta útil, no olvides darle una ⭐.
