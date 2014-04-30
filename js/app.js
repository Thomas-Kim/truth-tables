window.App = Ember.Application.create()

App.Router.map(function() {
    this.resource('explain', { path: '/' })
    this.resource('feedback', { path: '/:feedback' }, function(){
        this.resource('truth', { path: '/:exp' })
    });
    this.resource('evaluation');
})

App.TruthRoute = Ember.Route.extend ({
    model: function(params) {
        var table = App.Table.create()
        table.feedback = this.modelFor("feedback")
        table.expression = params.exp
        return table
    }
})

App.ExplainRoute = Ember.Route.extend({
    model: function(){
        return new App.ExplainModel
    },
    actions: {
      hitEnter: function(expression){
        this.transitionTo('truth', this.modelFor("explain").feedback, expression)
      }
    }
})

App.FeedbackRoute = Ember.Route.extend ({
    model: function(params) {
        return params.feedback
    }
})

App.ExplainModel = Ember.Object.extend({
    feedback: true,
    expression: 'a|b&c',
    invalidExpression: function(){
      parser = boolean_print
      try{
         testParse = parser.parse(this.get("expression"))
         return false
      }
      catch(err){
        return true
      }
    }.property("expression")
})

App.EvaluationRoute = Ember.Route.extend({
  model: function(){
    if(this.modelFor("truth") === undefined){
      //console.log("test")
      return false
    }
    return this.modelFor("truth")
  }
})

App.Table = Ember.Object.extend ({
    expression: '',
    parser: boolean_print,
    ast_value: '',
    feedback: '',
    mistakes: 0,
    answered: 0,
    percentage_result: function(){
      var correct = this.get("answered") - this.get("mistakes")
      return (correct / this.get("total")) * 100
    }.property('answered', 'mistakes', 'total'),
    feedback_bool: function(){
      if(this.get("feedback") == "true"){
        return true
      }
      else {
        return false
      }
    }.property("feedback"),
    ast: function() {
        try {
            var output = new Array()
            output = this.get("parser").parse(this.get("expression"))
            this.set("ast_value", output)
            this.get("ast_value").foreach
            //for(i = 0; i < this.get("ast_value").length; i++){
                //this.get("ast_value")[i] = this.get("ast_value")[i].replace("CUR","");
            //}

            this.set("ast_value", _.uniq(this.get("ast_value")));
            return this.get("ast_value")
        }
        catch(err) {
            return this.get("ast_value")
        }
        return output;
    }.property('expression', 'parser', 'ast_value'),
    ast_clean: function(){
        var output = Ember.A([]);
        for(i = 0; i < this.get("ast").length; i++){
            output.pushObject(this.get("ast")[i].replace("CUR",""));
        }
        return output;
    }.property('ast'),
        
    variables: function(){
        if(this.get("expression").match(/[a-z]{2,}/)){
            return ''
        }
        variable_list = _.uniq(this.get("expression").split(/[^a-eg-su-z]+/)).sort()
        if(variable_list[0] === "")
            variable_list.splice(0, 1)
        return variable_list
    }.property('expression'),
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
        if(this.get("model").expression.match(/[a-z|&]{2,}/)){
            return ''
        }
        variable_list = _.uniq(this.get("model").expression.split(/[^a-eg-su-z]+/)).sort()
        if(variable_list[0] === "")
            variable_list.splice(0, 1)
        this.set('model.variables', variable_list)
        return variable_list
    }.observes('model.expression')
})

App.TruthNodeComponent = Ember.Component.extend({
    classNameBindings: ['isSubexpressionOfSelected'],
    variable: '',
    node: '',
    last_truth_value: null,
    answered: '',
    row: null,
    guess: '',
    feedback: "false",
    expression: function(){
        return this.get("node").replace("CUR","");
    }.property("node"),
    validAnswer: function(){
        return ["T", "t", "f", "F", "true", "false", "True", "False"].indexOf(this.get("guess")) != -1
    }.property("guess"),
actions: {
    updateSelectedExpression: function(){
        this.set('selectedExpression', this.get('node'))
    },
    clearSelectedExpression: function(){
        this.set('selectedExpression', null);
    }
},
    correctAnswer: function(){
        if(this.get("truthAssignment")){
            return (["T", "t", "true", "True"].indexOf(this.get("guess")) != -1)
        }
        else{
            return (["F", "f", "false", "False"].indexOf(this.get("guess")) != -1)
        }
    }.property("truthAssignment", "guess"),
    isSubexpressionOfSelected: function(){
        if(this.get('selectedExpression')){
            subexpressions = this.get('selectedExpression').split(/\s?CUR!?[^a-z()\s!]*\s?/)
            for(i = 0; subexpressions[i] != null && i < 2; i++) {
              subexpressions[i+2] = subexpressions[i].replace(/^\s*\(/m, '')
              subexpressions[i+2] = subexpressions[i+2].replace(/\)\s*$/m, '')
            }
            return subexpressions.indexOf(this.get("expression")) != -1
        }
    }.property('selectedExpression', "expression"),
    colorCheck: function() {
        if(this.get("validAnswer")){
            if(this.get("correctAnswer")){
              if(this.get("last_truth_value") == false && this.get("feedback") === "false"){
                this.set("mistakes", this.get("mistakes") - 1)
              }
              if(this.get("last_truth_value") == null){
                this.set("answered", this.get("answered") + 1)
                //console.log(this.get("answered"))
              }
              this.set("last_truth_value", true);

              if(this.get("feedback") === "false")
                return "#EEEEEE"

              return "99FF66"
            }
            else{
              if(this.get("last_truth_value") != false){
                this.set("mistakes", this.get("mistakes") + 1);
              }
              if(this.get("last_truth_value") == null){
                this.set("answered", this.get("answered") + 1)
                //console.log(this.get("answered"))
              }
              this.set("last_truth_value", false);
              if(this.get("feedback") === "false")
                return "#EEEEEE"

              return "#FF3333"
            }
        }
        else {
            if(this.get("last_truth_value") == false && this.get("feedback") === "false"){
              this.set("mistakes", this.get("mistakes") - 1)
            }
            if(this.get("last_truth_value") != null){
              this.set("answered", this.get("answered") - 1)
            }
            this.set("last_truth_value", null);
            return "#EEEEEE"
        }
    }.property('validAnswer', 'correctAnswer', 'feedback', 'mistakes', 'last_truth_value', 'answered'),
    parser: boolean_evaluate,
    truthArray: function(){
        var output = Ember.A([])
        for(i = 0; i < this.get("variable").length; i++){
            if((Math.pow(2, i)&this.get("row"))!= 0)
                output.pushObject("F")
            else
                output.pushObject("T")
        }
        return output
    }.property('row'),
    truthAssignment: function(){
        var outputString = this.get("expression")
        var variables = this.get("variable")
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
    }.property('truthArray', 'expression', 'variable', 'parser')
})

App.TruthVariableComponent = Ember.Component.extend({
    variable: '',
    classNameBindings: ['isSubexpressionOfSelected'],
    index: '',
    variables: '',
    isSubexpressionOfSelected: function(){
        if(this.get('selectedExpression')){
            subexpressions = this.get('selectedExpression').split(/\s?CUR!?[^a-z()\s!]*\s?/)
            for(i = 0; subexpressions[i] != null && i < 2; i++) {
              subexpressions[i+2] = subexpressions[i].replace(/^\s*\(/m, '')
              subexpressions[i+2] = subexpressions[i+2].replace(/\)\s*$/m, '')
            }
            return subexpressions.indexOf(this.get("variable")) != -1
        }
    }.property('selectedExpression', "variable"),
    truthValue: function(){
        if((Math.pow(2, this.get("variables").indexOf(this.get("variable")))&this.get("index"))!= 0)
            return "F"
        else
            return "T"
    }.property('ast', 'variable', 'index')
})

App.TruthRowComponent = Ember.Component.extend({
    selectedExpression: null
})

App.TruthChecker = Ember.TextField.extend({
    attributeBindings: ["style"],
    color: null,
    classNames: ['guess-input'],
    style: function(){
        return "background-color:" + this.get("color") + ';'
    }.property('color')
})

App.ExpressionChecker = Ember.TextField.extend({
    attributeBindings: ["style"],
    invalidExpression: false,
    style: function(){
      //console.log(this.get("invalidExpression"))
      if(this.get("invalidExpression") == true){
        //console.log("Got here")
        return "background-color:#FF3333;"
      }
      else {
        return ""
      }
    }.property("invalidExpression")
})
