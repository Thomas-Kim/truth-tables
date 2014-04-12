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
    ast: function() {
        //console.log(this.get("parser.ast"))
        try {
            var output = new Array()
            console.log(output)
            output = this.get("parser").parse(this.get("input")) //MyCustomJISONParser.parse(this.get(‘input’))
            return output
        }
        catch(err) {
            console.log("error")
            return new Array("Error")
        }
        return output;
    }.property('input', 'parser')
})
