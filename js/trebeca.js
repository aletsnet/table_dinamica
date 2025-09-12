const trebeca = (config, data) => {
    const table_rebeca = document.querySelector('.trebeca');
    const tableHead = table_rebeca.querySelector('thead');
    const tableBody = table_rebeca.querySelector('tbody');
    const tableFoot = table_rebeca.querySelector('tfoot');
    let data_show = data;
    let page_show = 0;

    const search_data = (search) => {
        if(typeof config.search === "object"){
            const fields = config.search.fields || [];
            if(typeof data === "object" && Array.isArray(data)){
                data_show = data.filter(item => {
                    return fields.some(field => {
                        return item[field] && item[field].toString().toLowerCase().includes(search.toLowerCase());
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
            for(let row of data_show){
                const newRow = document.createElement('tr');
                const columns = config.table.cols;
                for (const key in columns) {
                    const col = columns[key];
                    const td = document.createElement('td');
                    td.dataset.type = col.type;
                    switch (col.type) {
                        case 'text':
                            td.textContent = row[col.field] || "";
                            td.dataset.id = row.id || '';
                            td.dataset.field = col.field;
                            break;
                        case 'number':
                            td.textContent = row[col.field] || "0";
                            td.dataset.id = row.id || '';
                            td.dataset.field = col.field;
                            break;
                        case 'phone':
                            td.textContent = format_phone(row[col.field]) || "";
                            td.dataset.id = row.id || '';
                            td.dataset.field = col.field;
                            break;
                        case 'email':
                            td.textContent = format_email(row[col.field]) || "";
                            td.dataset.id = row.id || '';
                            td.dataset.field = col.field;
                            break;
                        case 'money':
                            td.textContent = format_money(row[col.field]) || "";
                            td.dataset.id = row.id || '';
                            td.dataset.field = col.field;
                            break;
                        case 'button':
                            td.dataset.buttons = true;
                            if (col.buttons.includes("edit")) {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.dataset.type = "edit";
                                button.className = 'btn btn-warning btn-sm me-1 edit-btn';
                                button.innerHTML = '<i class="fas fa-edit"></i>';
                                //button.style = "display: none;";
                                button.addEventListener('click', (event) => { edit_item(event); });
                                td.appendChild(button);
                            }

                            if (col.buttons.includes("delete")) {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.dataset.type = "delete";
                                button.className = 'btn btn-danger btn-sm delete-btn';
                                button.innerHTML = '<i class="fas fa-trash"></i>';
                                //button.style = "display: none;";
                                button.addEventListener('click', (event) => { remove_item(event); });
                                td.appendChild(button);
                            }

                            if(col.buttons.includes("save")) {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.dataset.type = "save";
                                button.className = 'btn btn-success btn-sm me-1 save-btn';
                                button.innerHTML = '<i class="fas fa-save"></i>';
                                button.style = "display: none;";
                                button.addEventListener('click', (event) => { save_item(event); });
                                td.appendChild(button);

                                const button_cancel = document.createElement('button');
                                button_cancel.type = 'button';
                                button_cancel.dataset.type = "cancel";
                                button_cancel.className = 'btn btn-secondary btn-sm cancel-btn';
                                button_cancel.innerHTML = '<i class="fas fa-times"></i>';
                                button_cancel.style = "display: none;";
                                button_cancel.addEventListener('click', (event) => { cancel_item(event); });
                                td.appendChild(button_cancel);
                            }
                            break;
                        default:
                            td.textContent = row[col.field];
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
                noDataCell.colSpan = columns.length;
                noDataCell.textContent = 'No hay datos disponibles';
                noDataRow.appendChild(noDataCell);
                tableBody.appendChild(noDataRow);
            }
        }
    }

    const add_item = () => {
        const newRow = document.createElement('tr');
        const columns = config.table.cols;
        let first_field = "";
        let firstEditableElement = null;
        for (const key in columns) {
            const col = columns[key];
            const td = document.createElement('td');
            switch (col.type) {
                case 'text':
                    td.textContent = "";
                    td.dataset.id = '';
                    td.dataset.field = col.field;
                    td.contentEditable = 'true';
                    td.classList.add('td_editable');
                    // Guardar referencia al primer elemento editable
                    if(first_field === ""){
                        first_field = col.field;
                        firstEditableElement = td;
                    }
                    break;
                case 'number':
                    td.textContent = "0";
                    td.dataset.id = '';
                    td.dataset.field = col.field;
                    td.contentEditable = 'true';
                    td.classList.add('td_editable');
                    break;
                case 'button':
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
                    break;
                default:
                    td.textContent = "";
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
            console.log("Add action executed");
        }
    }

    const save_item = (event) => {
        const td_bts = event.target.closest('td');
        const tr_row = td_bts.closest('tr');
        for (const key in tr_row.children) {
            const td = tr_row.children[key];
            if(typeof td === "object" && td.nodeName === "TD"){
                td.contentEditable = 'false';
                td.classList.remove('td_editable');
            }
            if(typeof td.dataset === "object"){
                if(typeof td.dataset.field === "string"){
                    console.log(`${td.dataset.field}: ${td.textContent}`);
                }
            }
            if(typeof td === "object" && td.nodeName === "TD"){
                td.contentEditable = 'false';
            }

            if(typeof td.dataset === "object" && typeof td.dataset.buttons === "string"){
                const buttons = td.querySelectorAll('button');
                buttons.forEach(button => {
                    if(typeof button.dataset === "object" && typeof button.dataset.type === "string"){
                        switch (button.dataset.type) {
                            case 'edit':
                                button.style = '';
                                break;
                            case 'delete':
                                button.style = '';
                                break;
                            case 'save':
                                button.style.display = 'none';
                                break;
                            default:
                                button.style.display = 'none';
                                break;
                        }
                    }
                });
            }
        }

        if(typeof config.save === "function"){
            config.save(event);
        }
    }

    const remove_item = (event) => {
        if(!confirm("Está seguro de eliminar este elemento?")){
            return;
        }
        const td_bts = event.target.closest('td');
        const tr_row = td_bts.closest('tr');
        tr_row.remove();
        if(typeof config.delete === "function"){
            config.delete(event);
        }
        updateTotalCount();
    }

    const edit_item = (event) => {
        const td_bts = event.target.closest('td');
        const tr_row = td_bts.closest('tr');
        let first_field = "";
        let firstEditableElement = null;

        for (const key in tr_row.children) {
            const td = tr_row.children[key];
            if(typeof td === "object" && td.nodeName === "TD"){
                td.contentEditable = 'true';
                td.classList.add('td_editable');
                //td.classList.add('form-control');
                if(first_field === ""){
                    first_field = td.dataset.field || "";
                    firstEditableElement = td;
                }
            }

            if(typeof td.dataset === "object" && typeof td.dataset.buttons === "string"){
                const buttons = td.querySelectorAll('button');
                buttons.forEach(button => {
                    console.log(`Button type: ${button.dataset.type}`);
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
                td.contentEditable = 'false';
                td.classList.remove('td_editable');
            }

            if(typeof td.dataset === "object" && typeof td.dataset.buttons === "string"){
                const buttons = td.querySelectorAll('button');
                buttons.forEach(button => {
                    console.log(`Button type: ${button.dataset.type}`);
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
                                button.style = 'display: none;';
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