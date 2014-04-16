window.App = Ember.Application.create();

App.Router.map(function() {
    this.resource('truth', { path: '/' });
});

App.TruthRoute = Ember.Route.extend ({
    model: function() {
        return App.Table.create()
    }
})

App.Table = Ember.Object.extend ({
    input: '',
    parser: boolean_print,
    ast_value: '',
    ast: function() {
        //console.log(this.get("parser.ast"))
        try {
            var output = new Array()
            output = this.get("parser").parse(this.get("input"))
            this.set("ast_value", output)
            return this.get("ast_value")
        }
        catch(err) {
            return this.get("ast_value")
        }
        return output;
    }.property('input', 'parser', 'ast_value'),
    variables: '',
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
        variable_list = _.uniq(this.get("model").input.split(/[|&()\s]+/)).sort()
        if(variable_list[0] === "")
            variable_list.splice(0, 1)
        this.set('model.variables', variable_list)
        return variable_list
    }.observes('model.input')
})

App.TruthRowComponent = Ember.Component.extend({
    variable_stuff: '',
    ast_stuff: '',
    row: null
})

App.TruthVariableComponent = Ember.Component.extend({
    variable_stuff: '',
    index: '',
    variables_stuff: '',
    truthValue: function(){
        var index = this.get("variables_stuff").indexOf(this.get("variable"))
        var poweroftwo=Math.pow(2, this.get("variables_stuff").indexOf(this.get("variable")))
        if((Math.pow(2, this.get("variables_stuff").indexOf(this.get("variable_stuff")))&this.get("index"))!= 0)
            return "T"
        else
            return "F"
    }.property('ast_stuff', 'variable', 'index')
})
