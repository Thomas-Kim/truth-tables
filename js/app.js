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
    exp_result: [],
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
            console.log("Error getting input from textbox")
            return this.get("ast_value")
        }
        return output;
    }.property('input', 'parser', 'ast_value'),

    input_vars: function() {
        try {
            output_arr = [];
            str = this.get("input");
            for(var i = 0; i < str.length; i++) {
                if(str.charAt(i) >= 'a' && str.charAt(i) <= 'z' && str.charAt(i) != 't' && str.charAt(i) != 'f') {
                    output_arr.push(str.charAt(i));
                }
            }
            console.log(output_arr);
            return output_arr;
        }
        catch(err) {
            console.log("error creating var list");
            return [];
        }
    }.property('input'),

    echo_results: function() {
        try {
            console.log(this.get("exp_result"));
            return exp_result;
        }
        catch(err) {
            console.log("Error getting input from form");
            return [];
        }
    }.property('exp_result')
    /*
    form: function BuildFormFields()
    {
        var $amount = 10;
        var $container = document.getElementById('FormFields'),
        $item, $field, $i;

        $container.innerHTML = '';
            for ($i = 0; $i < $amount; $i++) {
                $item = document.createElement('div');
                $item.style.margin = '3px';

                $field = document.createElement('span');
                $field.innerHTML = 'Name of Design';
                $field.style.marginRight = '10px';
                $item.appendChild($field);

                $field = document.createElement('input');
                $field.name = 'Design[' + $i + ']';
                $field.type = 'text';
                $item.appendChild($field);

                $field = document.createElement('span');
                $field.innerHTML = 'Quantity of Design';
                $field.style.margin = '0px 10px';
                $item.appendChild($field);

                $field = document.createElement('input');
                $field.name = 'Quantity[' + $i + ']';
                $field.type = 'text';
                $item.appendChild($field);

                $container.appendChild($item);
            }
    }*/

})
