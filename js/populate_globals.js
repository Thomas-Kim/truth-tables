/* get_ast(1)
 * synopsis:
 *    input: well-formed boolean expression 
 *    behavior:
 *        breaks down expression into array of subexpressions for printing
 *            see boolean_print.jison
 *        breaks down expression into array of subexpressions with the 'main' operator qualified by a preceding CUR (This is for column highlighting)
 *            see boolean_print.jison
 */
function get_ast(str) {
    var i;
    var ast_arr = [];
    try {
        var output = [];
        output = boolean_print.parse(str);
        for(i = 0; i < output.length; i++)
            if(g_sub_ast_arr.indexOf(output[i]) == -1) {
                g_sub_ast_arr[g_sub_ast_arr.length] = output[i].slice();
                output[i] = output[i].replace(/CUR/g, '');
                g_ast_arr[g_ast_arr.length] = output[i].slice();
            }
    }
    catch(err) {
        console.log("Error getting input from textbox");
        console.log(err);
        g_ast_arr = [];
    }
}

/* get_URL_params(0)
 * synopsis:
 *    input: none
 *    behavior:
 *        extracts URL parameters from URL
 *        URL form:
 *            domain.page.html?<ARG1>?<ARG2>
 *        ARG1:
 *            well formed boolean expression with no spaces
 *                see boolean_print.jison and boolean_evaluate.jison for grammar and tokens
 *        ARG2:
 *            boolean value for test mode
 *            options:
 *                test=true
 *                test=false
 */
function get_URL_params() {
    var url_raw = document.URL;
    var regex = /[?]([^?]*)[?].*=(.*)/g;
    var regex_result = regex.exec(url_raw);
    g_input_str = regex_result[1];
    g_test_mode = regex_result[2];
    g_input_str = g_input_str.replace(/%3E/g, '>');
    g_input_str = g_input_str.replace(/%3C/g, '<');
}

/* input_vars(1)
 * synopsis:
 *    input: well formed boolean expression as a string
 *    behavior:
 *        extracts variable names from expr
 *            see boolean_print.jison and boolean_evaluate.jison for grammar and tokens
 */
function input_vars(expr) {
    try {
        var output_arr = [];
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

