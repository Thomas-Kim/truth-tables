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

function build_form_fields(expr) {
    /* var_list holds the list of unique variables */
    var var_list = input_vars(expr);
    /* exp_list holds the list of subexpressions */
    var exp_list = get_ast(expr);
    /* container holds the div from index.html */
    var container = document.getElementById('form_fields');
    /* misc local vars */
    var item, field, i, j, k;

    container.innerHTML = '';
    /* outer loop = enumerate bindings */
    var num_rows = 0;
    var finished = false;
    i = 0;
    while(!finished) {
        item = document.createElement('table');
        item.style.width='60%';

        /* inner loop 1 = enumerate subexpressions */
        var num_expr = 0;
        while(num_expr < exp_list.length) {
            var row_1 = item.insertRow(num_rows);
            ++num_rows;
            var row_2 = item.insertRow(num_rows);
            ++num_rows;

            var num_cols = 0;
            while(num_cols < var_list.length) {
                row_1.insertCell(num_cols).innerHTML = var_list[num_cols];
                row_2.insertCell(num_cols).innerHTML = "T";
                ++num_cols;
            }

            var input_box = document.createElement("input");
            input_box.type = "text";
            input_box.name = "subexpr_" + i.toString();
            ++i;

            row_1.insertCell(num_cols).innerHTML = exp_list[num_expr];
            row_2.insertCell(num_cols).appendChild(input_box);
            ++num_expr;
        }
        finished = true;
    }
    container.appendChild(item);

            /*
            field = document.createElement('text');
            field.innerHTML = 'Name of Design';
            item.appendChild(field);

            field = document.createElement('input');
            field.name = 'Design[' + i + ']';
            field.type = 'text';
            item.appendChild(field);

            field = document.createElement('span');
            field.innerHTML = 'Quantity of Design';
            field.style.margin = '0px 10px';
            item.appendChild(field);

            field = document.createElement('input');
            field.name = 'Quantity[' + i + ']';
            field.type = 'text';
            item.appendChild(field);
            */
}
