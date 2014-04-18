function build_form_fields() {
    /* The following functions initialize global constants */
    get_URL_params();
    get_ast(g_input_str);
    input_vars(g_input_str);
    for(i = 0; i < operator_enum.EQ; i++)
        g_category_score[i] = 0;
    /* End global constant initialization */
    /* get the form defined in html */
    var container = document.getElementById('form_fields');
    /* item is the outermost table */
    var item;
    /* sub_item holds the inner table in each iteration of the loop */
    var sub_item;
    /* binding_index holds the index of the corresponding binding */
    var row_1_binding_index, row_2_binding_index;
    var binding_index;
    var row_1_num_cols, row_2_num_cols;
    var row_1, row_2;
    var row_1_col, row_2_col;
    var row_1_num_expr, row_2_num_expr;
    var item_row, item_row_cell;
    var input_box, expand_button;
    var bindings = get_initial_bindings(g_input_str);

    container.innerHTML = '';

    /* outer loop = enumerate bindings */
    /* Create the outermost table */
    item = document.createElement('table');
    item.style.width='60%';
    num_tbls = 0;

    row_1_binding_index = 0;
    row_2_binding_index = 0;
    binding_index = 0;

    while(bindings.length > 0) {
        row_1_num_cols = 0;
        row_2_num_cols = 0;
        row_1_num_expr = 0;
        row_2_num_expr = 0;

        sub_item = document.createElement('table');
        sub_item.style.width='100%';
        row_1 = sub_item.insertRow(0);
        row_2 = sub_item.insertRow(1);

        /* Put variable names in row 1 */
        while(row_1_num_cols < g_var_array.length) {
            row_1_col = row_1.insertCell(row_1_num_cols);
            row_1_col.innerHTML = g_var_array[row_1_num_cols];
            ++row_1_num_cols;
        }

        /* put expressions in row 1 */
        while(row_1_num_expr < g_ast_arr.length) {
            row_1_col = row_1.insertCell(row_1_num_cols);
            row_1_col.innerHTML = g_ast_arr[row_1_num_expr];
            row_1_col.className = "subexps";
            ++row_1_binding_index;
            ++row_1_num_cols;
            ++row_1_num_expr;
        }

        /* Put variable bindings in row 2 */
        bindings_set = false;
        while(row_2_num_cols < g_var_array.length) {
            row_2_col = row_2.insertCell(row_2_num_cols);
            row_2_col.innerHTML = bindings[row_2_num_cols];
            ++row_2_num_cols;
        }

        /* put expression input boxes in row 2 */
        while(row_2_num_expr < g_ast_arr.length) {
            /* declare input box */
            input_box = document.createElement("input");
            input_box.type = "text";
            input_box.className = "result_input";
            input_box.setAttribute("col_num", row_2_num_expr);
            input_box.onfocus = change_highlight;
            if(g_test_mode != "true") {
              input_box.onkeyup = verify_input;
            }
            /* end declare input box */

            row_2_col = row_2.insertCell(row_2_num_cols);
            row_2_col.appendChild(input_box);
            ++row_2_num_expr;
            ++row_2_num_cols;
        }
        /* create bindings */
        var temp = 0;
        while(temp < g_ast_arr.length) {
            g_bindings_array[binding_index] = bindings.slice();
            ++binding_index;
            ++temp;
        }
        /* insert the subtable as a row in the parent table */
        item_row = item.insertRow(num_tbls);
        item_row_cell = item_row.insertCell(0);
        item_row_cell.appendChild(sub_item);
        /* increment the number of tables */
        ++num_tbls;

        bindings = get_next_bindings(bindings);
    }
    container.appendChild(item);
    if(g_test_mode == "true") {
        var submit_button = document.createElement("button");
        submit_button.innerHTML = "Submit";
        submit_button.onclick = verify_input;
        document.body.appendChild(submit_button);
    }
}
