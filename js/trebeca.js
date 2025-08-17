const trebeca = (config, data) => {
            const table_rebeca = document.querySelector('.trebeca');
            const tableHead = table_rebeca.querySelector('thead');
            const tableBody = table_rebeca.querySelector('tbody');
            const tableFoot = table_rebeca.querySelector('tfoot');

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
                            console.log(`Button type: ${button.dataset.type}`);
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

            const updateTotalCount = () => {
                const totalCount = document.getElementById('totalCount');
                totalCount.textContent = tableBody.rows.length;
            }

            //const tmp = tableHead.innerHTML;
            if(typeof config.table.cols === "object"){
                //head
                tableHead.innerHTML = "";
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
                if(typeof data === "object" && Array.isArray(data)){
                    tableBody.innerHTML = "";
                    for(let row of data){
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
                }

                //foot
                updateTotalCount();
            }
            


            
        }