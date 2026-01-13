import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import TrebecaTable from './components/TrebecaTable';
import Swal from 'sweetalert2';

function App() {
  // Sample data from articulos.html
  const data = [
    {id: 1, code: "7500810031872", nombre: 'Pan Blanco Bimbo Grande', precio: 45.0, cantidad: 5, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Panaderia', foto: 'img/bread.png'},
    {id: 2, code: "7500810020920", nombre: 'Leche Entera Santa Clara 1L', precio: 32, cantidad: 1, unidad:"litro", total:["cantidad", "precio"], categoria: 'Lacteos', foto: 'img/milk.png'},
    {id: 3, code: "7501055307906", nombre: 'Huevos Bachoco', precio: 32, cantidad: 12, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Huevos', foto: 'img/eggs.png'},
    {id: 4, code: "7501017362950", nombre: 'Queso Manchego 250g', precio: 41, cantidad: 1, unidad:"kg", total:["cantidad", "precio"], categoria: 'Lacteos', foto: 'img/cheese.png'},
    {id: 5, code: "041789001956", nombre: 'Yogur Natural 24oz', precio: 25, cantidad: 24, unidad:"onza", total:["cantidad", "precio"], categoria: 'Lacteos', foto: 'img/yogurt.png'},
    {id: 6, code: "7500810031877", nombre: 'Mantequilla 200g', precio: 2.20, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Lacteos', foto: 'img/butter.png'},
    {id: 7, code: "7500810031878", nombre: 'Jamón Cocido 200g', precio: 2.85, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Embutidos', foto: 'img/ham.png'},
    {id: 8, code: "7500810031879", nombre: 'Pan Integral Bimbo 500g', precio: 1.30, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Panaderia', foto: 'img/bread.png'},
    {id: 9, code: "7500810031880", nombre: 'Leche Condensada 397g', precio: 1.10, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Lacteos', foto: 'img/heavycream.png'},
    {id: 10, code: "7500810031881", nombre: 'Papas', precio: 0.80, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Verduras', foto: 'img/potatoes.png'},
    {id: 11, code: "7500810031882", nombre: 'Manzanas', precio: 1.50, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Frutas', foto: 'img/apple.png'},
    {id: 12, code: "7500810031883", nombre: 'Pollo Entero', precio: 5.00, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Carnes', foto: 'img/chicken.png'},
    {id: 13, code: "7500810031884", nombre: 'Arroz 1kg', precio: 1.20, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Cereales', foto: 'img/rice.png'},
    {id: 14, code: "7500810031885", nombre: 'Pasta 500g', precio: 0.90, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Cereales', foto: 'img/pasta.png'},
    {id: 15, code: "7500810031886", nombre: 'Aceite de Oliva 1L', precio: 4.50, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Aceites', foto: 'img/sunfloweroil.png'},
    {id: 16, code: "7500810031887", nombre: 'Azúcar 1kg', precio: 1.10, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Dulces', foto: 'img/sugar.png'},
    {id: 17, code: "7500810031888", nombre: 'Sal 1kg', precio: 0.50, cantidad: 1, unidad:"pieza", total:["cantidad", "precio"], categoria: 'Condimentos', foto: 'img/salt.png'},
  ];

  // Configuration from articulos.html
  const config = {
    search: {
      value: '',
      fields: ['code','nombre', 'categoria'],
      buttons: [
        { label: '<i class="fas fa-search"></i> Buscar', class: 'btn btn-primary btn-sm me-1', function: (event) => { console.log('Buscar'); } },
        { label: '<i class="fas fa-eraser"></i> Limpiar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Limpiar búsqueda'); } },
        { label: '<i class="fas fa-file-xls"></i> Exportar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Exportar'); } }
      ]
    },
    table: {
      cols: [
        {label: 'Code', field: 'code', type: 'text', function: (event) => { searchCode(event); }, typefunc: 'keyup'},
        {label: 'Producto', field: 'nombre', type : 'text', valuedefault: 'Nuevo Producto'},
        {label: 'Precio', field: 'precio', type: 'money'},
        {label: 'Unidad', field: 'unidad', type: 'text'},
        {label: 'Cantidad', field: 'cantidad', type: 'number', edit: false},
        {label: 'Total', field: 'total', type: 'money', operator: 'multiply', add: false, edit: false, reference: ["cantidad", "precio"]},
        {label: 'Categoría', field: 'categoria', type: 'select', 
          options:["Abarrotes","Panaderia", "Lacteos", "Huevos", "Embutidos", "Verduras", "Frutas", "Carnes", "Cereales", "Aceites", "Dulces",
            "Condimentos"], valuedefault: 'Abarrotes'},
        {label: 'Foto', field: 'foto', type: 'image', valuedefault: 'img/ghost.png', function: (event) => { upfile(event); }, typefunc: 'change'},
        {label: '*', field: 'actions', type: 'button', buttons: ["add", "edit", "delete", "save", "btn_extra"]}
      ],
      footer: {
        label: 'Total de registros:',
        field: 'count',
        type: 'text'
      }
    },
    buttons: [
      { name: "add", label: '<i class="fas fa-plus"></i>', class: 'btn btn-success btn-sm me-1', modo: "new"  },
      { name: "edit", label: '<i class="fas fa-edit"></i>', class: 'btn btn-warning btn-sm me-1', modo: "row" },
      { name: "delete", label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger btn-sm me-1', modo: "row" },
      { name: "save", label: '<i class="fas fa-save"></i>', class: 'btn btn-success btn-sm me-1', modo: "row" },
      { name: "btn_extra", label: '<i class="fas fa-info-circle"></i>', class: 'btn btn-info btn-sm m-1', 
        modo: "row_extra", function: (event) => { otherFunction(event); } },
    ],
    tableClass: 'trebeca',
    add: (event) => {btnAdd(event)},
    edit: (event) => {btnEdit(event)},
    delete: (event) => {btnDelete(event)},   
    save: (event) => {btnSave(event)},
  };

  // Event handlers from articulos.html
  const btnAdd = () => {
    console.log("Agregar nuevo registro");
  };
  
  const btnEdit = (event) => {
    const id = event.target.id;
    console.log("Editar registro id:", id);
  };

  const btnDelete = (event) => {
    const id = event.target.id;
    console.log("Eliminar registro id:", id);
  };

  const btnSave = (event) => {
    console.log(event);
  };

  const otherFunction = (event) => {
    Swal.fire({
      title: 'Otra función',
      text: 'Esta es otra función de ejemplo.',
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  };

  const upfile = (event) => {
    console.log('Upload file function called');
  };

  const searchCode = (event) => {
    console.log('Search code function called');
  };

  return (
    <div className="App">
      <Navigation />
      
      <section id="inicio" className="hero-section bg-light py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <h3>Mi tabla dinamica</h3>
              <TrebecaTable initialData={data} config={config} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
