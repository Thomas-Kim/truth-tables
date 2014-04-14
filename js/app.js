var ast_arr = [];
var bindings_array = [];
var var_array = [];
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

function input_vars(expr) {
    try {
        output_arr = [];
        str = expr;
        var i;
        for(i = 0; i < str.length; i++) {
            if(str.charAt(i) >= 'a' &&
              str.charAt(i) <= 'z' &&
              str.charAt(i) != 't' &&
              str.charAt(i) != 'f' &&
              output_arr.indexOf(str.charAt(i)) == -1) {
                  output_arr.push(str.charAt(i));
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
            result[i] = "F";
        }
        return result;
    }
    catch(err) {
        throw new Error("Failed to create initial bindings");
    }
}
function get_next_bindings(bindings) {
    var i;
    for(i = bindings.length - 1; i >= 0; i--) {
        if(bindings[i] == "F") {
            bindings[i] = "T";
            return bindings;
        }
        else {
            bindings[i] = "F";
        }
    }
    return [];
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

/* TODO: debug */
function substitute_vars(index) {
    var result = "";
    var exprs = document.getElementsByClassName("subexps");
    var subexpr = exprs[index];
    var i;
    for(i = 0; i < subexpr.length; i++) {
        if(subexpr.charAt(i) >= 'a' && subexpr.charAt(i) <= 'z' &&
           subexpr.charAt(i) != 't' && subexpr.charAt(i) != 'f') {
              result = result + bindings[index][lookup_var(subexpr.charAt(i))];
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
    for(i = 0; i < inputs.length; i++) {
        formula = substitute_vars[i];
        correct = boolean_evaluate.parse(formula);
        console.log(exprs[i].innerHTML);
        console.log(inputs[i].value);
        console.log(correct);
    }
}

function toggle_table() {
    // var my_button = document.getElementById(id);
    console.log("Hi");
}

function build_form_fields(expr) {
    var var_list = input_vars(expr);
    var exp_list = get_ast(expr);
    var container = document.getElementById('form_fields');
    var item, field, i, num_rows, sub_item;
    var num_expr, num_cols;
    var row_1, row_2;
    var row_1_col, row_2_col;
    var item_row, item_row_cell;
    var input_box, expand_button;
    var bindings = get_initial_bindings(expr);
    container.innerHTML = '';
    i = 0;

    /* outer loop = enumerate bindings */
    item = document.createElement('table');
    item.style.width='60%';
    num_tbls = 0;
    while(bindings.length > 0) {
        sub_item = document.createElement('table');
        sub_item.style.width='60%';
        /* inner loop 1 = enumerate subexpressions */

        row_1 = sub_item.insertRow(0);
        row_2 = sub_item.insertRow(1);
        /* Put variable names in row 1 */
        num_cols = 0;
        while(num_cols < var_list.length) {
            row_1_col = row_1.insertCell(num_cols);
            row_1_col.innerHTML = var_list[num_cols];
            ++num_cols;
        }

        /* put expressions in row 1 */
        num_expr = 0;
        while(num_expr < exp_list.length) {
            row_1_col = row_1.insertCell(num_cols);
            row_1_col.innerHTML = exp_list[num_expr];
            row_1_col.className = "subexps";
            row_1_col.name = 'subexpr[' + i + ']';
            ++num_cols;
            ++num_expr;
        }

        /* Put variable bindings in row 2 */
        num_cols = 0;
        while(num_cols < var_list.length) {
            row_2_col = row_2.insertCell(num_cols);
            row_2_col.innerHTML = bindings[num_cols];
            bindings_array[i] = bindings;
            ++i;
            ++num_cols;
        }

        /* put expression input boxes in row 2 */
        num_expr = 0;
        while(num_expr < exp_list.length) {
            input_box = document.createElement("input");
            input_box.type = "text";
            input_box.className = "result.input";
            input_box.name = 'subexpr_result[' + i + ']';
            input_box.onkeyup = verify_input;
            row_2_col = row_2.insertCell(num_cols);
            row_2_col.appendChild(input_box);
            ++num_expr;
            ++num_cols;
        }
        console.log("Hi");
        item_row = item.insertRow(num_tbls);
        item_row_cell = item_row.insertCell(0);
        item_row_cell.appendChild(sub_item);
        ++num_tbls;

        bindings = get_next_bindings(bindings);
    }
    container.appendChild(item);
}
