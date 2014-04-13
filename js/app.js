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
            output = this.get("parser").parse(this.get("input")) //MyCustomJISONParser.parse(this.get(‘input’))
            this.set("ast_value", output)
            console.log(this.get("ast_value"))
            return this.get("ast_value")
        }
        catch(err) {
            console.log("error")
            return this.get("ast_value")
        }
        return output;
    }.property('input', 'parser', 'ast_value')
})
