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
    parser: boolean_evaluate,
    ast: function() {
        //console.log(this.get("parser.ast"))
        try {
            output = this.get("parser").parse(this.get("input")) //MyCustomJISONParser.parse(this.get(‘input’))
        }
        catch(err) {
            return "Error"
        }
        return output;
    }.property('input', 'parser')
})
