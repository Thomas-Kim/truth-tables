var parser = boolean_print;
var input = "";
var ast_arr = [];
function get_ast(str) {
    //console.log(this.get("parser.ast"))
    try {
        console.log(str);
        var output = [];
        input = str;
        output = boolean_print.parse(input); //MyCustomJISONParser.parse(this.get(‘input’));
        ast_arr = output;
        return output;
    }
    catch(err) {
        console.log("Error getting input from textbox");
        return ast_arr;
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
              str.charAt(i) != 'f') {
                  output_arr.push(str.charAt(i));
            }
        }
        console.log(output_arr);
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
    var var_list = input_vars(expr);
    var amount = var_list.length;
    var container = document.getElementById('form_fields');
    var item, field, i;

    container.innerHTML = '';
        for (i = 0; i < amount; i++) {
            item = document.createElement('div');
            item.style.margin = '3px';

            field = document.createElement('span');
            field.innerHTML = 'Name of Design';
            field.style.marginRight = '10px';
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

            container.appendChild(item);
    }
}
