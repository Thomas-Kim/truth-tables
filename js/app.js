var input = "";
var ast_arr = [];
function get_ast(str) {
    try {
        var output = [];
        input = str;
        output = boolean_print.parse(input);
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
    var carry = true;
    for(i = 0; i < bindings.length; i++) {
        if(carry) {
            if(bindings[i] == "F") {
                bindings[i] = "T";
                carry = false;
            }
            else {
                bindings[i] = "F";
            }
        }
    }
    if(carry) {
        return [];
    }
    return bindings;
}

function build_form_fields(expr) {
    var var_list = input_vars(expr);
    var exp_list = get_ast(expr);
    var container = document.getElementById('form_fields');
    var item, field, i, num_rows;
    var num_expr, num_cols;
    var row_1, row_2;
    var row_1_col, row_2_col;
    var input_box;
    var bindings = get_initial_bindings(expr);
    container.innerHTML = '';
    i = 0;

    /* outer loop = enumerate bindings */
    while(bindings.length > 0) {
        num_rows = 0;
        item = document.createElement('table');
        item.style.width='60%';

        /* inner loop 1 = enumerate subexpressions */
        num_expr = 0;
        while(num_expr < exp_list.length) {
            row_1 = item.insertRow(num_rows);
            ++num_rows;
            row_2 = item.insertRow(num_rows);
            ++num_rows;

            num_cols = 0;
            while(num_cols < var_list.length) {
                row_1_col = row_1.insertCell(num_cols);
                row_1_col.innerHTML = var_list[num_cols];
                row_2_col = row_2.insertCell(num_cols);
                row_2_col.innerHTML = bindings[num_cols];
                ++num_cols;
            }

            input_box = document.createElement("input");
            input_box.type = "text";
            input_box.className = "result_input";
            input_box.name = 'subexpr_result[' + i + ']';
            ++i;

            row_1_col = row_1.insertCell(num_cols);
            row_1_col.innerHTML = exp_list[num_expr];
            row_1_col.className = "subexps";
            row_1_col.name = 'subexpr[' + i + ']';
            row_2_col = row_2.insertCell(num_cols);
            row_2_col.appendChild(input_box);
            ++num_expr;
        }
        bindings = get_next_bindings(bindings);
        console.log(bindings);
    }
    container.appendChild(item);
}
