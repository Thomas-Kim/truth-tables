function get_current_operator(exp) {
    var current_operator;
    if(exp.indexOf("CUR!") > -1)
        current_operator = operator_enum.NOT;
    if(exp.indexOf("CUR&") > -1)
        current_operator = operator_enum.AND;
    if(exp.indexOf("CURX") > -1)
        current_operator = operator_enum.XOR;
    if(exp.indexOf("CUR|") > -1)
        current_operator = operator_enum.OR;
    if(exp.indexOf("CUR->") > -1)
        current_operator = operator_enum.IMP;
    if(exp.indexOf("CUR<-") > -1)
        current_operator = operator_enum.IMP;
    if(exp.indexOf("CUR=") > -1)
        current_operator = operator_enum.EQ;
    return current_operator;
}


function update_test_score() {
    var inputs = document.getElementsByClassName("result_input");
    var col_num;
    var current_operator;
    var exp;
    for(i = 0; i < inputs.length; i++) {
        col_num = inputs[i].attributes.col_num.value;
        exp = g_sub_ast_arr[col_num];
        current_operator = get_current_operator(exp);
        console.log(current_operator);
        if(inputs[i].style.backgroundColor == "red")
            g_category_score[current_operator] += 1;
    }
    console.log(g_category_score);
}
function update_score() {
    /* Case practice mode */
    try {
        var current_focus = document.activeElement;
        var current_input = document.activeElement.value.toUpperCase();
        var current_color = document.activeElement.style.backgroundColor;
        if(current_color === "")
            current_color = "white";
        var col_num = document.activeElement.attributes.col_num.value;
        var exp = g_sub_ast_arr[col_num];
        var current_operator = get_current_operator(exp);
        // switch focus -> wait for input
        if(current_focus != g_prev_focus && g_prev_focus !== null) {
            g_prev_focus = current_focus;
            g_prev_input = current_input;
            g_prev_color = current_color;
        }

        else if(g_prev_input != current_input || g_prev_focus === null) {
            g_prev_focus = current_focus;
            g_prev_input = current_input;
            if(current_color == "red" && g_prev_color == "white")
                g_category_score[current_operator] += 1;
            g_prev_color = current_color;
            console.log(g_category_score);
        }
    }
    catch(err) {
        console.log("Error getting input from form" + err);
    }
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
        else
            result = result + subexpr.charAt(i);
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
        inputCell = inputs[i];
        if (inputs[i].value.toUpperCase() == "T" | inputs[i].value.toUpperCase() == "F"){
            user_input = (inputs[i].value.toUpperCase() == "T");
            if (boolean_evaluate.parse(formula) != user_input)
                inputCell.style.backgroundColor = "red";
            else
                inputCell.style.backgroundColor = "green";
        }
        else
            inputCell.style.backgroundColor = "white";
    }
    if(g_test_mode == "true")
      update_test_score();
    else
      update_score();
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
        if(cell_col_num == col_num)
            current_cell.style.borderColor = 'black';
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
        if(cell_col_num == col_num)
            current_cell.style.borderColor = 'initial';
    }
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
    for(i = 0; i < inputs.length; i++) {
        current_cell = inputs[i];
        cell_col_num = current_cell.getAttribute("col_num");
        if(g_ast_arr[cell_col_num] == left_side || g_ast_arr[cell_col_num] == right_side)
            highlight_column(cell_col_num);
        else
            unhighlight_column(cell_col_num);
    }
    update_score();
}


