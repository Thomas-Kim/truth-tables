window.App = Ember.Application.create()

App.Router.map(function() {
    this.resource('explain', { path: '/' })
    this.resource('feedback', { path: '/:feedback' }, function(){
        this.resource('truth', { path: '/:exp' })
    });
})

App.TruthRoute = Ember.Route.extend ({
    model: function(params) {
        var table = App.Table.create()
        table.feedback = this.modelFor("feedback")
        table.input = params.exp
        return table
    }
})

App.FeedbackRoute = Ember.Route.extend ({
    model: function(params) {
        return params.feedback
    }
})

App.Table = Ember.Object.extend ({
    input: '',
    parser: boolean_print,
    ast_value: '',
    feedback: '',
    ast: function() {
        try {
            var output = new Array()
            output = this.get("parser").parse(this.get("input"))
            this.set("ast_value", output)
            this.get("ast_value").foreach
            for(i = 0; i < this.get("ast_value").length; i++){
                this.get("ast_value")[i] = this.get("ast_value")[i].replace("CUR","");
            }

            this.set("ast_value", _.uniq(this.get("ast_value")));
            return this.get("ast_value")
        }
        catch(err) {
            return this.get("ast_value")
        }
        return output;
    }.property('input', 'parser', 'ast_value'),
    variables: function(){
        if(this.get("input").match(/[a-z]{2,}/)){
            console.log("I got here")
            return ''
        }
        variable_list = _.uniq(this.get("input").split(/[^a-eg-su-z]+/)).sort()
        if(variable_list[0] === "")
            variable_list.splice(0, 1)
        return variable_list
    }.property('input'),
    number_list: function(){
        var output = Ember.A([])
        for(i = 0; i < Math.pow(2, (this.get("variables").length)); i++){
            output.pushObject(i)
        }
        return output
    }.property('variables')
})

App.TruthController = Ember.ObjectController.extend({
    variable_array: function(){
        if(this.get("model").input.match(/[a-z|&]{2,}/)){
            return ''
        }
        variable_list = _.uniq(this.get("model").input.split(/[^a-eg-su-z]+/)).sort()
        if(variable_list[0] === "")
            variable_list.splice(0, 1)
        this.set('model.variables', variable_list)
        return variable_list
    }.observes('model.input')
})

App.TruthNodeComponent = Ember.Component.extend({
    variable_stuff: '',
    node_stuff: '',
    row: null,
    guess: '',
    feedback_stuff: "false",
    validAnswer: function(){
        return ["T", "F", "true", "false", "True", "False"].indexOf(this.get("guess")) != -1
    }.property("guess"),
actions: {
    updateSelectedExpression: function(){
        this.set('selectedExpression', this.get('node_stuff'))
    }
},
    correctAnswer: function(){
        if(this.get("truthAssignment")){
            return (["T", "true", "True"].indexOf(this.get("guess")) != -1)
        }
        else{
            return (["F", "false", "False"].indexOf(this.get("guess")) != -1)
        }
    }.property("truthAssignment", "guess"),
    isSubexpressionOfSelected: function(){
        console.log(this.get("selectedExpression"));
        if(this.get('selectedExpression')){
            subexpressions = this.get('selectedExpression').split(/cur./i)
            return subexpressions.indexOf(this.get("node_stuff")) != -1
        }
    }.property('selectedExpression', "node_stuff"),
    colorCheck: function() {
        if(this.get("feedback_stuff") === "false")
            return "white"

        if(this.get("validAnswer")){
            if(this.get("correctAnswer")){
                return "99FF66"
            }
            else{
                return "#FF3333"
            }
        }
        else {
            return "white"
        }
    }.property('validAnswer', 'correctAnswer', 'feedback_stuff'),
    parser: boolean_evaluate,
    truthArray: function(){
        var output = Ember.A([])
        for(i = 0; i < this.get("variable_stuff").length; i++){
            if((Math.pow(2, i)&this.get("row"))!= 0)
                output.pushObject("T")
            else
                output.pushObject("F")
        }
        return output
    }.property('row'),
    truthAssignment: function(){
        var outputString = this.get("node_stuff")
        var variables = this.get("variable_stuff")
        var truths = this.get("truthArray")
        var length = variables.length
        for(i = 0; i < length; i++){
            variable = variables[i]
            truth = truths[i]
            var regex = new RegExp(variable, 'g')
            outputString = outputString.replace(regex, truth)
            subexpressions = this.get('selectedExpression').split(/cur./i)
        }
        try{
            output = this.get("parser").parse(outputString)
            return output
        }
        catch(err){
            console.log(err)
            return "Error"
        }
        //return this.get("parser").parse(outputString)
    }.property('truthArray', 'node_stuff', 'variable_stuff', 'parser')
})

App.TruthVariableComponent = Ember.Component.extend({
    variable_stuff: '',
    index: '',
    variables_stuff: '',
    truthValue: function(){
        if((Math.pow(2, this.get("variables_stuff").indexOf(this.get("variable_stuff")))&this.get("index"))!= 0)
            return "T"
        else
            return "F"
    }.property('ast_stuff', 'variable', 'index')
})

App.TruthRowComponent = Ember.Component.extend({
    selectedExpression: null
})

App.TruthChecker = Ember.TextField.extend({
    attributeBindings: ["style"],
    color: null,
    style: function(){
        return "background-color:" + this.get("color") + ';'
    }.property('color')
})
