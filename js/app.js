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
    ast: function() {
        //console.log(this.get("parser.ast"))
        return this.get("input") //MyCustomJISONParser.parse(this.get(‘input’))
    }.property('input')
})
