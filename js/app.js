var g_ast_arr = [];
var g_bindings_array = [];
var g_var_array = [];
var g_url_raw = "";
var g_input_str = "";
var g_num_expr;
function get_ast(str) {
    try {
        var output = [];
        output = boolean_print.parse(str);
        ast_arr = output;
        return output;
    }
    catch(err) {
        console.log("Error getting input from textbox");
        return [];
    }
}

function get_URL_params() {
    g_url_raw = document.URL;
    var regex = /[?](.*)/g;
    g_input_str = regex.exec(g_url_raw)[1];
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
        var_array = output_arr;
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
    for(i = 0; i < var_array.length; i++) {
        if(var_array[i] == var_name) {
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
    for(i = 0; i < inputs.length; i++) {
        formula = substitute_vars(i);
        correct = boolean_evaluate.parse(formula);
        /* verification section */
        if (inputs[i].value.toUpperCase() == "T" | inputs[i].value.toUpperCase() == "F"){
            inputCell = inputs[i];
            user_input = (inputs[i].value.toUpperCase() == "T");
            if (boolean_evaluate.parse(formula) != user_input){
                inputCell.style.backgroundColor = "red";
            }
            else {
                inputCell.style.backgroundColor = "green";
            }
        }
    }
}

/* Highlight the entire column
   TODO: Remove highlight if user has no input box in focus. */
function highlight_column() {
    var inputs = document.getElementsByClassName("result_input");
    var col_no = this.getAttribute("col_no");
    var cell_col_no;
    var currentCell;
    var i;

    for(i = 0; i < inputs.length; i++) {
        currentCell = inputs[i];

        cell_col_no = currentCell.getAttribute("col_no");

        if(cell_col_no == col_no) {
            currentCell.style.borderColor = '#330000';
        }
        else {
            currentCell.style.borderColor = 'initial';
        }
    }
}

function build_form_fields() {
    /* Get parameters from the URL */
    get_URL_params();
    /* Get input variable list extracted from the URL parameters */
    var var_list = input_vars(g_input_str);
    /* Get the subexpression list extracted from the URL parameters */
    var exp_list = get_ast(g_input_str);
    /* get the form defined in html */
    var container = document.getElementById('form_fields');
    /* item is the outermost table */
    var item;
    /* sub_item holds the inner table in each iteration of the loop */
    var sub_item;
    /* binding_index holds the index of the corresponding binding */
    var row_1_binding_index;
    var row_2_binding_index;
    var binding_index;
    /* row_1_num_cols holds the current number of columns in the subtable row 1 */
    var row_1_num_cols;
    /* row_2_num_cols holds the current number of columns in the subtable row 2 */
    var row_2_num_cols;
    /* row_1 holds the first row in the subtable */
    var row_1;
    /* row_2 holds the second row in the subtable */
    var row_2;
    /* row_1_col holds the current column in the first row of the subtable */
    var row_1_col;
    /* row_2_col holds the current column in the second row of the subtable */
    var row_2_col;
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
        console.log(bindings);
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
        while(row_1_num_expr < exp_list.length) {
            row_1_col = row_1.insertCell(row_1_num_cols);
            row_1_col.innerHTML = exp_list[row_1_num_expr];
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
        while(row_2_num_expr < exp_list.length) {
            /* declare input box */
            input_box = document.createElement("input");
            input_box.type = "text";
            input_box.className = "result_input";
            input_box.name = 'subexpr_result[' + row_2_binding_index + ']'; // wrong
            input_box.setAttribute("col_no", row_2_num_expr);
            input_box.onkeyup = verify_input;
            input_box.onfocus = highlight_column;
            /* end declare input box */

            row_2_col = row_2.insertCell(row_2_num_cols);
            row_2_col.appendChild(input_box);
            ++row_2_num_expr;
            ++row_2_num_cols;
        }
        /* create bindings */
        var temp = 0;
        while(temp < exp_list.length) {
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
    console.log(g_bindings_array);
    container.appendChild(item);
}
