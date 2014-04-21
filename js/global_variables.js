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

/* Color values for correct/incorrect */
/* Correct does not need to be represented as a hex number */
var g_correct_color = "LightGreen";
/* incorrect must be represented as a hex number in order to do input verification properly */
/* lowercase letters, alter colorToHex in page_manipulation.hs if uppercase letters are preferable */
var g_incorrect_color = "#ffc0cb";

/* operator_enum indexes into g_category_score
 * for each incorrect answer, g_category_score[operator_enum.XX] is incremented
 * the index chosen depends on the current operator the student gets incorrect
 */
operator_enum = {
    NOT : 0,
    AND : 1,
    XOR : 2,
    OR  : 3,
    IMP : 4,
    EQ  : 5
};

