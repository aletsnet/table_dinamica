// Tabla dinámica y contador de clicks
let counter = 0;
let editingIndex = -1; // Índice del registro que se está editando (-1 si es nuevo)

// Referencias a elementos del DOM
const counterDisplay = document.getElementById('counter');
const incrementBtn = document.getElementById('incrementBtn');
const heroBtn = document.getElementById('heroBtn');
const contactForm = document.getElementById('contactForm');

// Referencias para la tabla dinámica
const addRowBtn = document.getElementById('addRowBtn');
const tableBody = document.getElementById('tableBody');
const totalCount = document.getElementById('totalCount');
const personModal = document.getElementById('personModal');
const personForm = document.getElementById('personForm');
const savePersonBtn = document.getElementById('savePersonBtn');
const modalTitle = document.getElementById('personModalLabel');

// Event listeners cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Proyecto con tabla dinámica cargado correctamente!');
    
    // Inicializar eventos
    initializeEvents();
    
    // Inicializar tabla dinámica
    initializeDynamicTable();
    
    // Animación de bienvenida
    animateHeroSection();
});

// Función para inicializar todos los eventos
function initializeEvents() {
    // Eventos existentes
    if (incrementBtn) incrementBtn.addEventListener('click', incrementCounter);
    if (heroBtn) heroBtn.addEventListener('click', heroButtonClick);
    if (contactForm) contactForm.addEventListener('submit', handleContactForm);
    
    // Eventos para tabla dinámica
    if (addRowBtn) addRowBtn.addEventListener('click', showAddPersonModal);
    if (savePersonBtn) savePersonBtn.addEventListener('click', savePerson);
    
    // Navegación suave
    initializeSmoothScrolling();
}

// Función para incrementar el contador
function incrementCounter() {
    counter++;
    counterDisplay.textContent = counter;
    
    // Añadir animación al contador
    counterDisplay.classList.add('animate-bounce');
    setTimeout(() => {
        counterDisplay.classList.remove('animate-bounce');
    }, 500);
    
    // Mostrar mensaje cada 10 clicks
    if (counter % 10 === 0) {
        showToast(`¡Has hecho ${counter} clicks!`, 'success');
    }
}

// Función para el botón hero
function heroButtonClick() {
    showToast('¡Bienvenido al proyecto!', 'info');
    
    // Scroll suave a la sección de características
    document.getElementById('sobre').scrollIntoView({
        behavior: 'smooth'
    });
}

// Función para manejar el formulario de contacto
function handleContactForm(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Validación básica
    if (!validateForm(nombre, email, mensaje)) {
        return;
    }
    
    // Simular envío del formulario
    simulateFormSubmission(nombre, email, mensaje);
}

// Función para validar el formulario
function validateForm(nombre, email, mensaje) {
    if (nombre.trim().length < 2) {
        showToast('El nombre debe tener al menos 2 caracteres', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showToast('Por favor ingresa un email válido', 'error');
        return false;
    }
    
    if (mensaje.trim().length < 10) {
        showToast('El mensaje debe tener al menos 10 caracteres', 'error');
        return false;
    }
    
    return true;
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para simular envío del formulario
function simulateFormSubmission(nombre, email, mensaje) {
    // Mostrar indicador de carga
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular delay de red
    setTimeout(() => {
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Limpiar formulario
        contactForm.reset();
        
        // Mostrar mensaje de éxito
        showToast(`¡Gracias ${nombre}! Tu mensaje ha sido enviado.`, 'success');
        
        console.log('Formulario enviado:', { nombre, email, mensaje });
    }, 2000);
}

// Función para mostrar notificaciones toast
function showToast(message, type = 'info') {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${getBootstrapColor(type)} border-0`;
    toast.setAttribute('role', 'alert');
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Añadir al body
    document.body.appendChild(toast);
    
    // Inicializar toast de Bootstrap
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Eliminar elemento después de que se oculte
    toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toast);
    });
}

// Función helper para obtener colores de Bootstrap
function getBootstrapColor(type) {
    const colors = {
        'success': 'success',
        'error': 'danger',
        'warning': 'warning',
        'info': 'info'
    };
    return colors[type] || 'primary';
}

// Función para navegación suave
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Actualizar navegación activa
                updateActiveNavLink(this);
            }
        });
    });
}

// Función para actualizar enlace activo en navegación
function updateActiveNavLink(clickedLink) {
    // Remover clase active de todos los enlaces
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Añadir clase active al enlace clickeado
    clickedLink.classList.add('active');
}

// Función para animar la sección hero
function animateHeroSection() {
    const heroSection = document.querySelector('.hero-section');
    heroSection.style.opacity = '0';
    heroSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
    }, 100);
}

// Detectar scroll para efectos adicionales
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Función utilitaria para debug
function logProjectInfo() {
    console.log('=== Información del Proyecto ===');
    console.log('Tecnologías: HTML5, Bootstrap 5, JavaScript Vanilla');
    console.log('Contador actual:', counter);
    console.log('Elementos DOM cargados:', {
        counter: !!counterDisplay,
        incrementBtn: !!incrementBtn,
        heroBtn: !!heroBtn,
        contactForm: !!contactForm,
        dynamicTable: !!tableBody
    });
}

// === FUNCIONES PARA TABLA DINÁMICA ===

// Inicializar tabla dinámica
function initializeDynamicTable() {
    // Añadir event listeners a botones existentes
    updateTableEventListeners();
    
    // Actualizar contador inicial
    updateTotalCount();
}

// Mostrar modal para añadir persona
function showAddPersonModal() {
    editingIndex = -1;
    modalTitle.textContent = 'Añadir Persona';
    personForm.reset();
    
    const bsModal = new bootstrap.Modal(personModal);
    bsModal.show();
}

// Mostrar modal para editar persona
function showEditPersonModal(index) {
    editingIndex = index;
    modalTitle.textContent = 'Editar Persona';
    
    // Obtener datos de la fila
    const row = tableBody.children[index];
    const cells = row.children;
    
    // Llenar el formulario con los datos existentes
    document.getElementById('personName').value = cells[0].textContent;
    document.getElementById('personAge').value = cells[1].textContent;
    document.getElementById('personCity').value = cells[2].textContent;
    
    const bsModal = new bootstrap.Modal(personModal);
    bsModal.show();
}

// Guardar persona (añadir o editar)
function savePerson() {
    const name = document.getElementById('personName').value.trim();
    const age = document.getElementById('personAge').value;
    const city = document.getElementById('personCity').value.trim();
    
    // Validación
    if (!validatePersonData(name, age, city)) {
        return;
    }
    
    if (editingIndex === -1) {
        // Añadir nueva persona
        addPersonToTable(name, age, city);
        showToast(`${name} ha sido añadido a la tabla`, 'success');
    } else {
        // Editar persona existente
        editPersonInTable(editingIndex, name, age, city);
        showToast(`Los datos de ${name} han sido actualizados`, 'info');
    }
    
    // Cerrar modal
    const bsModal = bootstrap.Modal.getInstance(personModal);
    bsModal.hide();
    
    // Actualizar contador y eventos
    updateTotalCount();
    updateTableEventListeners();
}

// Validar datos de persona
function validatePersonData(name, age, city) {
    if (name.length < 2) {
        showToast('El nombre debe tener al menos 2 caracteres', 'error');
        return false;
    }
    
    if (!age || age < 1 || age > 120) {
        showToast('La edad debe estar entre 1 y 120 años', 'error');
        return false;
    }
    
    if (city.length < 2) {
        showToast('La ciudad debe tener al menos 2 caracteres', 'error');
        return false;
    }
    
    return true;
}

// Añadir persona a la tabla
function addPersonToTable(name, age, city) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${age}</td>
        <td>${city}</td>
        <td>
            <button type="button" class="btn btn-warning btn-sm me-1 edit-btn">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button type="button" class="btn btn-danger btn-sm delete-btn">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </td>
    `;
    
    // Añadir animación de entrada
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(20px)';
    
    tableBody.appendChild(newRow);
    
    // Animar entrada
    setTimeout(() => {
        newRow.style.transition = 'all 0.3s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 50);
}

// Editar persona en la tabla
function editPersonInTable(index, name, age, city) {
    const row = tableBody.children[index];
    const cells = row.children;
    
    // Actualizar contenido de las celdas
    cells[0].textContent = name;
    cells[1].textContent = age;
    cells[2].textContent = city;
    
    // Añadir efecto visual de actualización
    row.classList.add('table-warning');
    setTimeout(() => {
        row.classList.remove('table-warning');
    }, 1000);
}

// Eliminar persona de la tabla
function deletePerson(index) {
    const row = tableBody.children[index];
    const name = row.children[0].textContent;
    
    // Confirmar eliminación
    if (confirm(`¿Estás seguro de que quieres eliminar a ${name}?`)) {
        // Animación de salida
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            tableBody.removeChild(row);
            updateTotalCount();
            updateTableEventListeners();
            showToast(`${name} ha sido eliminado de la tabla`, 'warning');
        }, 300);
    }
}

// Actualizar event listeners de la tabla
function updateTableEventListeners() {
    // Botones de editar
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach((btn, index) => {
        btn.onclick = () => showEditPersonModal(index);
    });
    
    // Botones de eliminar
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach((btn, index) => {
        btn.onclick = () => deletePerson(index);
    });
}

// Actualizar contador total
function updateTotalCount() {
    const rowCount = tableBody.children.length;
    if (totalCount) {
        totalCount.textContent = rowCount;
        
        // Añadir animación al número
        totalCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            totalCount.style.transform = 'scale(1)';
        }, 200);
    }
}

// Función para buscar en la tabla (funcionalidad extra)
function searchTable(searchTerm) {
    const rows = tableBody.children;
    
    Array.from(rows).forEach(row => {
        const cells = Array.from(row.children).slice(0, 3); // Solo las primeras 3 columnas
        const rowText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');
        
        if (rowText.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Función para exportar datos de la tabla (funcionalidad extra)
function exportTableData() {
    const rows = Array.from(tableBody.children);
    const data = rows.map(row => {
        const cells = Array.from(row.children).slice(0, 3);
        return {
            nombre: cells[0].textContent,
            edad: parseInt(cells[1].textContent),
            ciudad: cells[2].textContent
        };
    });
    
    console.log('Datos de la tabla:', data);
    showToast(`${data.length} registros exportados a la consola`, 'info');
    
    return data;
}
