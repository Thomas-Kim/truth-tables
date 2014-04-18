/* get_initial_bindings(1)
 * synopsis:
 *    input: well formed boolean expression as a string
 *    behavior:
 *        creates a string of form "TTTT.." where the number of T's corresponds to the number of unique variables in expr
 *    output:
 *        returns the string of form "TTTT.."
 */
function get_initial_bindings(expr) {
    try {
        var i;
        var result = [];
        for(i = 0; i < g_var_array.length; i++)
            result[i] = "T";
        return result;
    }
    catch(err) {
        throw new Error("Failed to create initial bindings");
    }
}
/* get_next_bindings(1)
 * synopsis:
 *    input: set of bindings /[TF]+/ as a string
 *    behavior:
 *        creates successor to bindings
 *    output:
 *        returns a string of form /[TF]+/
 */
function get_next_bindings(bindings) {
    var i;
    var finished = true;
    for(i = 0; i < bindings.length; i++)
        if(bindings[i] == "T")
            finished = false;
    if(finished)
        return [];
    for(i = bindings.length - 1; i >= 0; i--) {
        if(bindings[i] == "T") {
            bindings[i] = "F";
            return bindings.slice();
        }
        else
            bindings[i] = "T";
    }
    return bindings.slice();
}

/* lookup_var(1)
 * synopsis:
 *    input:
 *        name of var as string
 *            see boolean_print.jison and boolean_evaluate.jison for tokens
 *    behavior:
 *        looks up the variable name in g_var_array
 *    output:
 *        returns the index of the variable name in g_var_array which is parallel to g_bindings_array[index]
 *        where index is the index of the bindings to the current subexpression
 *            see substitute_vars(1)
 *        returns -1 on error (should NOT happen)
 */
function lookup_var(var_name) {
    var i;
    for(i = 0; i < g_var_array.length; i++)
        if(g_var_array[i] == var_name)
            return i;
    return -1;
}

