var g_ast_arr = [];
var g_sub_ast_arr = [];
var g_bindings_array = [];
var g_var_array = [];
var g_url_raw = "";
var g_input_str = "";
var g_num_expr;
var g_test_mode;
var g_score = -1.0;

function get_ast(str) {
    var i;
    var ast_arr = [];
    try {
        var output = [];
        output = boolean_print.parse(str);
        for(i = 0; i < output.length; i++) {
            if(g_ast_arr.indexOf(output[i]) == -1) {
                g_sub_ast_arr[g_sub_ast_arr.length] = output[i].slice();
                output[i] = output[i].replace(/CUR/g, '');
                g_ast_arr[g_ast_arr.length] = output[i].slice();
            }
        }
    }
    catch(err) {
        console.log("Error getting input from textbox");
        console.log(err);
        g_ast_arr = [];
    }
}

function get_URL_params() {
    g_url_raw = document.URL;
    var regex = /[?]([^?]*)[?].*=(.*)/g;
    var regex_result = regex.exec(g_url_raw);
    g_input_str = regex_result[1];
    g_test_mode = regex_result[2];
    g_input_str = g_input_str.replace(/%3E/g, '>');
    g_input_str = g_input_str.replace(/%3C/g, '<');
}

function input_vars(expr) {
    try {
        output_arr = [];
        str = expr;
        var i;
        for(i = 0; i < g_input_str.length; i++) {
            if(g_input_str.charAt(i) >= 'a' &&
              g_input_str.charAt(i) <= 'z' &&
              g_input_str.charAt(i) != 't' &&
              g_input_str.charAt(i) != 'f' &&
              output_arr.indexOf(g_input_str.charAt(i)) == -1) {
                  output_arr.push(g_input_str.charAt(i));
            }
        }
        g_var_array = output_arr;
        return output_arr;
    }
    catch(err) {
        console.log("Error creating var list");
        return [];
    }
}

function get_results(){
    try {
        return [];
    }
    catch(err) {
        console.log("Error getting input from form");
        return [];
    }
}

function get_initial_bindings(expr) {
    try {
        var var_list = input_vars(expr);
        var i;
        var result = [];
        for(i = 0; i < var_list.length; i++) {
            result[i] = "T";
        }
        return result;
    }
    catch(err) {
        throw new Error("Failed to create initial bindings");
    }
}

function get_next_bindings(bindings) {
    var i;
    var finished = true;
    for(i = 0; i < bindings.length; i++) {
        if(bindings[i] == "T") {
            finished = false;
        }
    }
    if(finished) {
        return [];
    }
    for(i = bindings.length - 1; i >= 0; i--) {
        if(bindings[i] == "T") {
            bindings[i] = "F";
            return bindings.slice();
        }
        else {
            bindings[i] = "T";
        }
    }
    return bindings.slice();
}

function lookup_var(var_name) {
    var i;
    for(i = 0; i < g_var_array.length; i++) {
        if(g_var_array[i] == var_name) {
            return i;
        }
    }
    return -1;
}

function substitute_vars(index) {
    var result = "";
    var exprs = document.getElementsByClassName("subexps");
    var subexpr = exprs[index].innerHTML;
    subexpr = subexpr.replace(/&amp;/g, '&');
    subexpr = subexpr.replace(/&lt;/g, '<');
    subexpr = subexpr.replace(/&gt;/g, '>');
    var i;
    for(i = 0; i < subexpr.length; i++) {
        if(subexpr.charAt(i) >= 'a' && subexpr.charAt(i) <= 'z' &&
           subexpr.charAt(i) != 't' && subexpr.charAt(i) != 'f') {
              result = result + g_bindings_array[index][lookup_var(subexpr.charAt(i))];
        }
        else {
            result = result + subexpr.charAt(i);
        }
    }
    return result;
}

function verify_input() {
    var inputs = document.getElementsByClassName("result_input");
    var exprs = document.getElementsByClassName("subexps");
    var correct;
    var formula;
    var inputCell;
    var user_input;
    var num_correct = 0;
    for(i = 0; i < inputs.length; i++) {
        formula = substitute_vars(i);
        correct = boolean_evaluate.parse(formula);
        /* verification section */
        inputCell = inputs[i];
        if (inputs[i].value.toUpperCase() == "T" | inputs[i].value.toUpperCase() == "F"){
            user_input = (inputs[i].value.toUpperCase() == "T");
            if (boolean_evaluate.parse(formula) != user_input){
                inputCell.style.backgroundColor = "red";
            }
            else {
                inputCell.style.backgroundColor = "green";
                ++num_correct;
            }
        }
        else {
            inputCell.style.backgroundColor = "white";
        }
    }
    g_score = num_correct / inputs.length;
    // console.log(g_score * 100 + "%");
}

function change_highlight() {
    var inputs = document.getElementsByClassName("result_input");
    var sub_exps = document.getElementsByClassName("subexps");
    var col_num = this.getAttribute("col_num");
    var cell_col_num;
    var current_cell;
    var i;
    var split_expression;
    var left_side, right_side;

    /* sub_exps[index] holds the current subexpression with CUR separator */
    split_expression = g_sub_ast_arr[col_num].split("CUR");
    left_side = split_expression[0].replace(/^\s*\(?/m, '');
    left_side = left_side.replace(/\)?\s*$/m, '');
    right_side = split_expression[1].substring(2);
    right_side = right_side.replace(/^\s*\(/m, '');
    right_side = right_side.replace(/\)\s*$/m, '');
    // console.log(g_sub_ast_arr[index]);
    // console.log(left_side + " SEP " + right_side);
    for(i = 0; i < inputs.length; i++) {
        current_cell = inputs[i];
        cell_col_num = current_cell.getAttribute("col_num");
        if(g_ast_arr[cell_col_num] == left_side || g_ast_arr[cell_col_num] == right_side) {
            highlight_column(cell_col_num);
        }
        else {
            unhighlight_column(cell_col_num);
        }
    }
}


function highlight_column(index) {
    var inputs = document.getElementsByClassName("result_input");
    var col_num = inputs[index].getAttribute("col_num");
    var cell_col_num;
    var current_cell;
    var i;

    for(i = 0; i < inputs.length; i++) {
        current_cell = inputs[i];

        cell_col_num = current_cell.getAttribute("col_num");

        if(cell_col_num == col_num) {
            current_cell.style.borderColor = '#330000';
        }
    }
}

function unhighlight_column(index) {
    var inputs = document.getElementsByClassName("result_input");
    var col_num = inputs[index].getAttribute("col_num");
    var cell_col_num;
    var current_cell;
    var i;

    for(i = 0; i < inputs.length; i++) {
        current_cell = inputs[i];
        cell_col_num = current_cell.getAttribute("col_num");

        if(cell_col_num == col_num) {
            current_cell.style.borderColor = 'initial';
        }
    }
}

function build_form_fields() {
    get_URL_params();
    get_ast(g_input_str);
    /* Get input variable list extracted from the URL parameters */
    var var_list = input_vars(g_input_str);
    /* Get the subexpression list extracted from the URL parameters */
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
        while(row_1_num_cols < var_list.length) {
            row_1_col = row_1.insertCell(row_1_num_cols);
            row_1_col.innerHTML = var_list[row_1_num_cols];
            ++row_1_num_cols;
        }

        /* put expressions in row 1 */
        while(row_1_num_expr < g_ast_arr.length) {
            row_1_col = row_1.insertCell(row_1_num_cols);
            row_1_col.innerHTML = g_ast_arr[row_1_num_expr];
            row_1_col.className = "subexps";
            row_1_col.name = 'subexpr[' + row_1_binding_index + ']';
            ++row_1_binding_index;
            ++row_1_num_cols;
            ++row_1_num_expr;
        }

        /* Put variable bindings in row 2 */
        bindings_set = false;
        while(row_2_num_cols < var_list.length) {
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
            input_box.name = 'subexpr_result[' + row_2_binding_index + ']'; // wrong
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
