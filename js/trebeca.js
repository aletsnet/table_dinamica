const trebeca = (config, data) => {
    const table_rebeca = document.querySelector('.trebeca');
    const tableHead = table_rebeca.querySelector('thead');
    const tableBody = table_rebeca.querySelector('tbody');
    const tableFoot = table_rebeca.querySelector('tfoot');
    let data_show = data;
    let page_show = 0;
    let count_row = 0;

    const create_input = (td) => {
        if(typeof td.dataset === "object" && typeof td.dataset.type === "string" && td.dataset.type !== "button"){
            const input = document.createElement('input');
            input.type = td.dataset.type || 'text';
            input.value = unformatter(td.textContent || '', td.dataset.type) || '';
            input.className = 'form-control form-control-sm';
            input.dataset.id = td.dataset.id || Date.now().toString();
            input.dataset.field = td.dataset.field || '';
            td.innerHTML = '';
            if(td.dataset.field === "id" && input.value === ""){
                input.value = Date.now().toString();
            }
            td.appendChild(input);
            td.classList.add('td_editable');
        }
    }

    const search_data = (search) => {
        if(typeof config.search === "object"){
            const fields = config.search.fields || [];
            if(typeof data === "object" && Array.isArray(data)){
                const removeAccents = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                data_show = data.filter(item => {
                    return fields.some(field => {
                        const value = item[field] ? removeAccents(item[field].toString().toLowerCase()) : "";
                        const searchNorm = removeAccents(search.toLowerCase());
                        return value.includes(searchNorm);
                    });
                });

                show_data();
                totalCount();
            }
        }
    }

    const show_data = () => {
        if(typeof data_show === "object" && Array.isArray(data_show)){
            tableBody.innerHTML = "";
            if(typeof config.pagination === "object"){
                const limit = config.pageSize || 10;
                const start = page_show * limit;
                const end = start + limit;
                data_show = data_show.slice(start, end);
            }
            const columns = config.table.cols;
            const action = columns.filter(col => col.field === 'actions')[0];
            const actions = action.buttons.reduce((acc, btn) => {acc[btn] = true; return acc;}, {});

            for(let row of data_show){
                const newRow = document.createElement('tr');
                newRow.dataset.id = row.id || '';
                if(typeof actions.edit !== "undefined"){
                    newRow.addEventListener('dblclick', (event) => { edit_item(event); });
                }
                for (const key in columns) {
                    const col = columns[key];
                    const td = document.createElement('td');
                    td.dataset.type = col.type;
                    let value = row[col.field] || '';
                    if(typeof col.operator !== "undefined" && col.operator !== ""){
                        value = operators(row, col.operator, value) || value;
                    }
                    const buttons = config.buttons || {};
                    switch (col.type) {
                        case 'button':
                            td.dataset.buttons = true;
                            if (col.buttons.includes("edit")) {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.dataset.type = "edit";
                                button.className = buttons.edit?.class || 'btn btn-warning btn-sm me-1 edit-btn';
                                button.innerHTML = buttons.edit?.label || '<i class="fas fa-edit"></i>';
                                //button.style = "display: none;";
                                button.addEventListener('click', (event) => { edit_item(event); });
                                td.appendChild(button);
                            }

                            if (col.buttons.includes("delete")) {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.dataset.type = "delete";
                                button.className = buttons.delete?.class || 'btn btn-danger btn-sm delete-btn';
                                button.innerHTML = buttons.delete?.label || '<i class="fas fa-trash"></i>';
                                //button.style = "display: none;";
                                button.addEventListener('click', (event) => { remove_item(event); });
                                td.appendChild(button);
                            }

                            if(col.buttons.includes("save")) {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.dataset.type = "save";
                                button.className = buttons.save?.class || 'btn btn-success btn-sm me-1 save-btn';
                                button.innerHTML = buttons.save?.label || '<i class="fas fa-save"></i>';
                                button.style = "display: none;";
                                button.addEventListener('click', (event) => { save_item(event); });
                                td.appendChild(button);

                                const button_cancel = document.createElement('button');
                                button_cancel.type = 'button';
                                button_cancel.dataset.type = "cancel";
                                button_cancel.className = buttons.cancel?.class || 'btn btn-secondary btn-sm cancel-btn';
                                button_cancel.innerHTML = buttons.cancel?.label || '<i class="fas fa-times"></i>';
                                button_cancel.style = "display: none;";
                                button_cancel.addEventListener('click', (event) => { cancel_item(event); });
                                td.appendChild(button_cancel);
                            }

                            //console.log(buttons);
                            
                            for (const btn of buttons) {
                                if(btn.modo == "row_extra") {
                                    const button = document.createElement('button');
                                    button.type = 'button';
                                    button.dataset.type = btn.type;
                                    button.className = btn.class;
                                    button.innerHTML = btn.label;
                                    button.addEventListener('click', (event) => { btn.function(); });
                                    td.appendChild(button);
                                }   
                            }

                            break;
                        default:
                            td.textContent = formatter(value, col.type) || '';
                            td.dataset.id = row.id || '';
                            td.dataset.field = col.field;
                            break;
                    }
                    newRow.appendChild(td);
                }
                tableBody.appendChild(newRow);
            }

            if(typeof config.pagination !== 'undefined') {
                const newRow = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = config.table.cols.length;
                td.className = 'text-center';
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn btn-primary btn-sm';
                btn.innerHTML = '<i class="fas fa-eye"></i> Ver mas';
                td.appendChild(btn);
                newRow.appendChild(td);
                tableBody.appendChild(newRow);
            }

            if (data_show.length === 0) {
                const noDataRow = document.createElement('tr');
                const noDataCell = document.createElement('td');
                noDataCell.colSpan = config.table.cols.length;
                noDataCell.textContent = 'No hay datos disponibles';
                noDataRow.appendChild(noDataCell);
                tableBody.appendChild(noDataRow);
            }
        }
    }

    const add_item = () => {
        const newRow = document.createElement('tr');
        newRow.dataset.id = "_new";
        const columns = config.table.cols;
        let first_field = "";
        let firstEditableElement = null;
        for (const key in columns) {
            const col = columns[key];
            const td = document.createElement('td');
            td.dataset.type = col.type;
            if(col.type === 'button'){
                td.dataset.buttons = true;
                if (col.buttons.includes("edit")) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.dataset.type = "edit";
                    button.className = 'btn btn-warning btn-sm me-1 edit-btn';
                    button.innerHTML = '<i class="fas fa-edit"></i>';
                    button.style = "display: none;";
                    button.addEventListener('click', (event) => { edit_item(event); });
                    td.appendChild(button);
                }

                if (col.buttons.includes("delete")) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.dataset.type = "delete";
                    button.className = 'btn btn-danger btn-sm delete-btn';
                    button.innerHTML = '<i class="fas fa-trash"></i>';
                    button.style = "display: none;";
                    button.addEventListener('click', (event) => { remove_item(event); });
                    td.appendChild(button);
                }

                if(col.buttons.includes("save")) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.dataset.type = "save";
                    button.className = 'btn btn-success btn-sm me-1 save-btn';
                    button.innerHTML = '<i class="fas fa-save"></i>';
                    //button.style = "display: normal;";
                    button.addEventListener('click', (event) => { save_item(event); });
                    td.appendChild(button);

                    const button_cancel = document.createElement('button');
                    button_cancel.type = 'button';
                    button_cancel.dataset.type = "cancel";
                    button_cancel.className = 'btn btn-secondary btn-sm cancel-btn';
                    button_cancel.innerHTML = '<i class="fas fa-times"></i>';
                    //button_cancel.style = "display: none;";
                    button_cancel.addEventListener('click', (event) => { cancel_item(event); });
                    td.appendChild(button_cancel);
                }
            }else{
                td.dataset.id = "_new";
                td.dataset.field = col.field;
                if(typeof col.add === "undefined" && col.add !== false){
                    create_input(td);
                }
            }

            newRow.appendChild(td);

            
        }
        tableBody.insertBefore(newRow, tableBody.firstChild);
        
        // Hacer focus en el primer elemento editable después de añadir al DOM
        if(firstEditableElement) {
            setTimeout(() => {
                firstEditableElement.focus();
            }, 10);
        }
        
        if(typeof config.add === "function"){
            config.add();
            //console.log("Add action executed");
        }
    }

    const save_item = (event) => {
        const td_bts = event.target.closest('td');
        const tr_row = td_bts.closest('tr');
        const columns = config.table.cols;
        
        if(tr_row.dataset.id === "_new"){
            const newItem = {};
            for (const key in columns) {
                const col = columns[key];
                if(col.type !== "button"){
                    newItem[col.field] = "";
                }
            }
            newItem.id = Date.now().toString(); // Genera un ID único basado en la marca de tiempo
            tr_row.dataset.id = newItem.id;
            for (const td of tr_row.children) {
                const col = columns.find(element => element.field === td.dataset.field);
                if (td.nodeName === "TD" && td.dataset.type !== "button") {
                    const input = td.querySelector('input');
                    if (input) {
                        valor = input.value || "";
                        newItem[td.dataset.field] = valor;
                        td.textContent = formatter(valor, col.type) || '';
                        td.classList.remove('td_editable');
                        
                    }else{
                        //console.log(`Operador: ${col.operator} en campo ${col.field}`, valor);
                        valor = 0;
                        if(typeof col.operator !== "undefined" && col.operator !== ""){
                            valor = operators(newItem, col.operator, col.reference);
                        }
                        td.textContent = formatter(valor, col.type) || '';
                    }
                }else{
                    const buttons = td.querySelectorAll('button');
                    buttons.forEach(button => {
                        if(typeof button.dataset === "object" && typeof button.dataset.type === "string"){
                            switch (button.dataset.type) {
                                case 'edit':
                                    button.style = 'display: normal;';
                                    break;
                                case 'delete':
                                    button.style = 'display: normal;';
                                    break;
                                case 'save':
                                    button.style = 'display: none;';
                                    break;
                                case 'cancel':
                                    button.style = 'display: none;';
                                    break;
                                default:
                                    button.style = 'display: normal;';
                                    break;
                            }
                        }
                    });
                }
            }
            data_show.push(newItem);
        }else{
            let id_ = tr_row.dataset.id;
            let data_show_item = data_show.find(item => { return item.id == id_; });
            if(typeof data_show_item.id !== "undefined"){
                for (const td of tr_row.children) {
                    if (td.nodeName === "TD" && td.dataset.type !== "button") {
                        const col = columns.find(element => element.field === td.dataset.field);
                        const input = td.querySelector('input');
                        if (input) {
                            valor = input.value || "";
                            data_show_item[td.dataset.field] = valor;
                            td.textContent = formatter(valor, col.type) || '';
                            td.classList.remove('td_editable');
                        }else{
                            if(typeof col.operator !== "undefined" && col.operator !== ""){
                                valor = 0;
                                valor = operators(data_show_item, col.operator, col.reference);
                                data_show_item[td.dataset.field] = valor;
                                td.textContent = formatter(valor, col.type) || '';
                            }
                        }
                    }else{
                        const buttons = td.querySelectorAll('button');
                        buttons.forEach(button => {
                            if(typeof button.dataset === "object" && typeof button.dataset.type === "string"){
                                switch (button.dataset.type) {
                                    case 'edit':
                                        button.style = 'display: normal;';
                                        break;
                                    case 'delete':
                                        button.style = 'display: normal;';
                                        break;
                                    case 'save':
                                        button.style = 'display: none;';
                                        break;
                                    case 'cancel':
                                        button.style = 'display: none;';
                                        break;
                                    default:
                                        button.style = 'display: normal;';
                                        break;
                                }
                            }
                        });
                    }
                }
            }
        }
        
        

        if(typeof config.save === "function"){
            config.save(event);
        }
        //show_data();
        totalCount();
    }

    const remove_item = (event) => {
        if (typeof Swal !== 'undefined') {
            Swal.fire(
                {
                    title: '¿Estás seguro de eliminar este registro?',
                    text: "Esta acción no se puede deshacer.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }
            ).then((result) => {
                if (result.isConfirmed) {
                    const td_bts = event.target.closest('td');
                    const tr_row = td_bts.closest('tr');
                    for (const td of tr_row.children) {
                        if (td.nodeName === "TD") {
                            if(td.dataset.field == "id"){
                                console.log(`Eliminar ID: ${td.dataset.id}`);

                                data_show = data_show.filter(i => { console.log(i.id, td.dataset.id);
                                 return i.id !== td.dataset.id });
                                break;
                            }
                        }
                    }

                    if(typeof config.delete === "function"){
                        config.delete(event);
                    }
                }
            });
        }else{
            if(confirm("¿Estás seguro de eliminar este registro?")){
                const td_bts = event.target.closest('td');
                const tr_row = td_bts.closest('tr');
                if(typeof config.delete === "function"){
                    config.delete(event);
                }
            }
        }
    }

    const edit_item = (event) => {
        const td_bts = event.target.closest('td');
        const tr_row = td_bts.closest('tr');
        const columns = config.table.cols;
        const item_id = tr_row.dataset.id || "";
        const item_data = data_show.find(item => item.id == item_id) || {};
        let first_field = "";
        let firstEditableElement = null;

        for (const key in tr_row.children) {
            const td = tr_row.children[key];
            const col = columns[key];
            if(typeof td === "object" && td.nodeName === "TD"){
                if(td.className === "td_editable"){
                    continue;
                }

                if(typeof col.edit === "undefined" && col.edit !== false){
                    create_input(td);
                }else{
                    if(item_data[col.field] == 0 || item_data[col.field] == "0" || item_data[col.field] == "" || item_data[col.field] == null){
                        create_input(td);
                    }
                }

                if(typeof col.operator !== "undefined" && col.operator !== ""){
                    td.innerHTML = operators(item_data, col.operator, item_data[col.field]) || "";
                }

                if(first_field === ""){
                    first_field = td.dataset.field || "";
                    firstEditableElement = td;
                }
            }

            if(typeof td.dataset === "object" && typeof td.dataset.buttons === "string"){
                const buttons = td.querySelectorAll('button');
                buttons.forEach(button => {
                    if(typeof button.dataset === "object" && typeof button.dataset.type === "string"){
                        switch (button.dataset.type) {
                            case 'edit':
                                button.style = 'display: none;';
                                break;
                            case 'delete':
                                button.style = 'display: none;';
                                break;
                            case 'save':
                                button.style = 'display: normal;';
                                break;
                            case 'cancel':
                                button.style = 'display: normal;';
                                break;
                            default:
                                button.style = 'display: normal;';
                                break;
                        }
                    }
                });
            }
        }

        if(typeof config.edit === "function"){
            config.edit(event);
        }

        if(firstEditableElement) {
            setTimeout(() => {
                firstEditableElement.focus();
            }, 10);
        }
    }

    const cancel_item = (event) => {
        const td_bts = event.target.closest('td');
        const tr_row = td_bts.closest('tr');
        for (const key in tr_row.children) {
            const td = tr_row.children[key];
            if(typeof td === "object" && td.nodeName === "TD"){
                td.classList.remove('td_editable');
            }

            if (td.nodeName === "TD" && td.dataset.type !== "button") {
                const input = td.querySelector('input');
                if (input) {
                    td.textContent = input.value;
                    td.classList.remove('td_editable');
                }
            }

            if(typeof td.dataset === "object" && typeof td.dataset.buttons === "string"){
                const buttons = td.querySelectorAll('button');
                buttons.forEach(button => {
                    if(typeof button.dataset === "object" && typeof button.dataset.type === "string"){
                        switch (button.dataset.type) {
                            case 'edit':
                                button.style = 'display: normal;';
                                break;
                            case 'delete':
                                button.style = 'display: normal;';
                                break;
                            case 'save':
                                button.style = 'display: none;';
                                break;
                            case 'cancel':
                                button.style = 'display: none;';
                                break;
                            default:
                                button.style = 'display: normal;';
                                break;
                        }
                    }
                });
            }
        }

        if(typeof config.cancel === "function"){
            config.cancel(event);
        }
    }

    const format_phone = (phone) => {
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length === 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
        }
        return phone;
    }

    const format_email = (email) => {
        //const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //return emailPattern.test(email) ? email : 'Email inválido';
        return email.toLowerCase();
    }

    const format_money = (amount) => {
        const number = parseFloat(amount);
        return isNaN(number) ? amount : number.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    }

    const totalCount = () => {
        tableFoot.innerHTML = "";
        let c = data_show.length || 0;
        count_row = c;
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.colSpan = config.table.cols.length ;
        const span = document.createElement('span');
        th.className = 'text-end';
        span.innerHTML = `Total: <span>${c}</span>`;
        th.appendChild(span);
        tr.appendChild(th);
        tableFoot.appendChild(tr);
    }

    const showmore = () => {
        const pageSize = config.pagination.pageSize || 10;
        const totalPages = Math.ceil(data_show.length / pageSize);
        const pagination = document.createElement('div');
        pagination.className = 'pagination';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-link';
            button.innerHTML = i;
            button.addEventListener('click', () => {
                show_data(i);
            });
            pagination.appendChild(button);
        }

        tableFoot.appendChild(pagination);
    }

    const paste = (event) => {
        /*event.preventDefault();
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('Text');

        // Procesa la tabla pegada (asumiendo formato tabular: filas separadas por \n y columnas por \t)
        const rows = pastedData.trim().split('\n');
        const newData = rows.map((row, idx) => {
            const cols = row.split('\t');
            return {
                id: data.length + idx + 1,
                name: cols[0] || '',
                age: Number(cols[1]) || '',
                city: cols[2] || '',
                phone: cols[3] || '',
                email: cols[4] || '',
                salary: Number(cols[5]) || ''
            };
        });

        // Agrega los nuevos registros a la variable data
        data.push(...newData);

        // Opcional: recarga la tabla si tienes una función para ello
        if (typeof trebeca === 'function') {
            trebeca(config_default, data);
        }

        // Opcional: muestra alerta de éxito
        if (typeof Swal !== 'undefined') {
            Swal.fire('¡Tabla pegada!', 'Los datos se han añadido correctamente.', 'success');
        }*/
        
    }

    const operators = (item, operator, value) => {
        let result = null;
        if(typeof value === "object" && Array.isArray(value) && typeof item.id !== "undefined"){
            switch (operator) {
                case 'rest':
                    result = 0;
                    for (const v of value) { result -= item[v] || 0;}
                    break;
                case 'sum':
                    result = 0;
                    for (const v of value) { result += item[v] || 0;}
                    break;
                case 'multiply':
                    result = 1;
                    for (const v of value) { result *= item[v] || 1;}
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
    }

    const formatter = (value, type) => {
        let result = value;
        switch (type) {
            case 'money':
                result = format_money(value);
                break;
            case 'phone':
                result = format_phone(value);
                break;
            case 'email':
                result = format_email(value);
                break;
            default:
                result = value;
                break;
        }
        return result;
    }

    const unformatter = (value, type) => {
        let result = value;
        switch (type) {
            case 'money':
                // Elimina símbolo de moneda y separadores
                result = value.replace(/[^\d.-]/g, '');
                break;
            case 'phone':
                // Elimina espacios y caracteres no numéricos
                result = value.replace(/\D/g, '');
                break;
            case 'email':
                // Devuelve el email tal cual
                result = value.trim();
                break;
            default:
                result = value;
                break;
        }
        return result;
    }

    const init = () => {
        if(typeof config.table.cols === "object"){
            //head
            tableHead.innerHTML = "";
            if(typeof config.search === "object"){
                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.placeholder = 'Buscar...';
                searchInput.className = 'form-control';
                searchInput.value = config.search.value || '';
                searchInput.addEventListener('input', (event) => {
                    const query = event.target.value.toLowerCase();
                    search_data(query);
                });

                const tr = document.createElement('tr');
                const th = document.createElement('th');
                th.colSpan = config.table.cols.length -1;
                th.appendChild(searchInput);
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn btn-primary';
                button.innerHTML = '<i class="fas fa-search"></i>';
                button.addEventListener('click', () => {
                    const query = searchInput.value.toLowerCase();
                    search_data(query);
                });
                const th2 = document.createElement('th');
                th2.appendChild(button);
                tr.appendChild(th);
                tr.appendChild(th2);
                tableHead.appendChild(tr);
            }
            
            if(typeof config.table === "object"){
                const table = config.table;
                if(typeof table.cols === "object"){
                    const cols = table.cols;
                    const ncols = cols.length;
                    const tr_h = document.createElement('tr');
                    for(let col in cols){
                        const th = document.createElement('th');
                        if(cols[col].type === 'button'){
                            if(cols[col].buttons.includes("add")){
                                const addButton = document.createElement('button');
                                addButton.type = 'button';
                                addButton.className = 'btn btn-success';
                                addButton.innerHTML = '<i class="fas fa-plus"></i>';
                                addButton.addEventListener('click', function() {
                                    add_item();
                                });
                                th.appendChild(addButton);
                            }
                        }else{
                            th.textContent = cols[col].label;
                        }
                        tr_h.appendChild(th);
                    }
                    tableHead.appendChild(tr_h);
                }
            }

            //body
            show_data();

            //foot
            totalCount();
        }
    }

    init();
}