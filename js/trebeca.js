const trebeca = (config, data) => {
            const table_rebeca = document.querySelector('.trebeca');
            const tableHead = table_rebeca.querySelector('thead');
            const tableBody = table_rebeca.querySelector('tbody');
            const tableFoot = table_rebeca.querySelector('tfoot');

            const tmp = tableHead.innerHTML;
            tableHead.innerHTML = "";

            const add_item = () => {
                const newRow = document.createElement('tr');
                const columns = config_default.table.cols;
                let first_filed = "";
                for (const key in columns) {
                    const col = columns[key];
                    const td = document.createElement('td');
                    switch (col.type) {
                        case 'text':
                            td.textContent = "";
                            td.dataset.id = '';
                            td.dataset.field = col.field;
                            td.contentEditable = 'true';
                            if(first_filed==col.field){
                                td.focus();
                            }
                            first_filed = first_filed!=""?first_filed:col.field;
                            break;
                        case 'number':
                            td.textContent = "0";
                            td.dataset.id = '';
                            td.dataset.field = col.field;
                            td.contentEditable = 'true';
                            break;
                        case 'button':
                            if (col.buttons.includes("edit")) {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.className = 'btn btn-warning btn-sm me-1 edit-btn';
                                button.innerHTML = '<i class="fas fa-edit"></i>';
                                button.style = "display: none;";
                                button.addEventListener('click', function() {
                                    // Edit functionality here
                                    alert('Edit functionality not implemented yet.');
                                });
                                td.appendChild(button);
                            }

                            if (col.buttons.includes("delete")) {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.className = 'btn btn-danger btn-sm delete-btn';
                                button.innerHTML = '<i class="fas fa-trash"></i>';
                                button.style = "display: none;";
                                button.addEventListener('click', function() {
                                    // Delete functionality here
                                    alert('Delete functionality not implemented yet.');
                                });
                                td.appendChild(button);
                            }

                            if(col.buttons.includes("save")) {
                                const button = document.createElement('button');
                                button.type = 'button';
                                button.className = 'btn btn-success btn-sm save-btn';
                                button.innerHTML = '<i class="fas fa-save"></i>';
                                //button.style = "display: normal;";
                                button.addEventListener('click', (event) => {
                                    // Save functionality here
                                    const td_bts = event.target.closest('td');
                                    const tr_row = td_bts.closest('tr');
                                    //console.log(tr_row);
                                    for (const key in tr_row.children) {
                                        const td = tr_row.children[key];
                                        if(typeof td === "object" && td.nodeName === "TD"){
                                            td.contentEditable = 'false';
                                        }
                                        if(typeof td.dataset === "object"){
                                            if(typeof td.dataset.field === "string"){
                                                console.log(`${td.dataset.field}: ${td.textContent}`);
                                            }
                                        }
                                        if(typeof td === "object" && td.nodeName === "TD"){
                                            td.contentEditable = 'false';
                                        }
                                    }
                                    
                                     console.log(tr_row.dataset);
                                });
                                td.appendChild(button);
                            }
                            break;
                        default:
                            td.textContent = "";
                    }
                    newRow.appendChild(td);
                }
                tableBody.insertBefore(newRow, tableBody.firstChild);
            };

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
            /*
            btnadd.addEventListener('click', function() {
                const newRow = document.createElement('tr');
                console.log(tableHead.children[0]);
                for (const key in tableHead.) {
                    console.log(tableHead[key]);
                    
                }
                newRow.innerHTML = `
                    <td>Nuevo Nombre</td>
                    <td>Nuevo Edad</td>
                    <td>Nueva Ciudad</td>
                    <td>
                        <button type="button" class="btn btn-warning btn-sm me-1 edit-btn">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button type="button" class="btn btn-danger btn-sm delete-btn">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>`;
                
                newRow.style.opacity = '0';
                newRow.style.transform = 'translateY(-20px)';
                tableBody.insertBefore(newRow, tableBody.firstChild);

                setTimeout(() => {
                    newRow.style.transition = 'all 0.3s ease';
                    newRow.style.opacity = '1';
                    newRow.style.transform = 'translateY(0)';
                }, 50);
                
                updateTotalCount();
            });*/

            function updateTotalCount() {
                const totalCount = document.getElementById('totalCount');
                totalCount.textContent = tableBody.rows.length;
            }
        }