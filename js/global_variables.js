/* g_ast_arr holds the array of unqualified subexpressions */
var g_ast_arr = [];
/* g_sub_ast_arr holds the array of subexpressions qualified by CUR
 *    see get_ast(1)
 */
var g_sub_ast_arr = [];
/* g_bindings_array holds the list of T/F bindings */
var g_bindings_array = [];
/* g_var_array holds the list of variable names, ordered by the order of their appearance in the well-formed boolean expression */
var g_var_array = [];
var g_input_str = "";
var g_num_expr;
var g_test_mode;
var g_category_score = [];
var g_prev_focus = null;
var g_prev_input;
var g_prev_color = "white";

operator_enum = {
    NOT : 0,
    AND : 1,
    XOR : 2,
    OR  : 3,
    IMP : 4,
    EQ  : 5
};


