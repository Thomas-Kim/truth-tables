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

App.Table = Ember.Object.extend ({
    expression: '',
    parser: boolean_print,
    ast_value: '',
    feedback: '',
    mistakes: 0,
    pluralizeMistakes: function(){
      return this.get("mistakes") != 1
    }.property("mistakes"),
    answered: 0,
    evaluation: false,
    total: function(){
        return this.get("ast").length * Math.pow(2, this.get("variables").length)
    }.property('ast', 'variables'),
    correct: function(){
        return this.get("answered") - this.get("mistakes")
    }.property('answered', 'mistakes'),
    formatted_expression: function(){
      output = this.get("expression").replace(/&/g, "&and;");
      output = output.replace(/\s?\|\s?/g, " &or; ", 'g');
      output = output.replace(/\s?->\s?/g, " &rarr; ");
      output = output.replace(/\s?<-\s?/g, " &larr; ");
      output = output.replace(/\s?!\s?/g, " &not; ");
      output = output.replace(/\s?=\s?/g, " &equiv; ");
      output = output.replace(/\s?NAND\s?/g, " NAND ");
      output = output.replace(/\s?NOR\s?/g, " NOR ");
      output = output.replace(/\s?X\s?/g, " XOR ");
      return output
    }.property("expression"),
    percentageResult: function(){
      return (this.get("correct") / this.get("total")) * 100
    }.property('correct', 'total'),
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
            expression = this.get("ast")[i].replace("CUR", "");
            expression = expression.replace(/&/g, "&and;");
            expression = expression.replace(/\s?\|\s?/g, " &or; ", 'g');
            expression = expression.replace(/\s?->\s?/g, " &rarr; ");
            expression = expression.replace(/\s?<-\s?/g, " &larr; ");
            expression = expression.replace(/\s?!\s?/g, " &not; ");
            expression = expression.replace(/\s?=\s?/g, " &equiv; ");
            expression = expression.replace(/\s?NAND\s?/g, " NAND ");
            expression = expression.replace(/\s?NOR\s?/g, " NOR ");
            expression = expression.replace(/\s?X\s?/g, " XOR ");
            output.pushObject(expression);
        }
        return output;
    }.property('ast'),
        
    variables: function(){
        if(this.get("expression").match(/[a-zA-WYZ]{2,}/)){
            return ''
        }
        variable_list = _.uniq(this.get("expression").split(/[^a-eg-su-zA-EG-SU-WYZ]+/)).sort()
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
        if(this.get("model").expression.match(/[a-zA-WYZ|&]{2,}/)){
            return ''
        }
        variable_list = _.uniq(this.get("model").expression.split(/[^a-eg-su-zA-EG-SU-WYZ]+/)).sort()
        if(variable_list[0] === "")
            variable_list.splice(0, 1)
        this.set('model.variables', variable_list)
        return variable_list
    }.observes('model.expression'),
    actions: {
        evaluate: function(){
            this.set('model.evaluation', true)
        }
    }

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
    column_split: boolean_split,
    column_split_2: boolean_split_2,
    evaluation: null,
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
            try{
                subexpressions = this.get("column_split").parse(this.get('selectedExpression'))
                subexpressions.concat(this.get("column_split_2").parse(this.get('selectedExpression')))
            }
            catch(err) {
                subexpressions = this.get("column_split_2").parse(this.get('selectedExpression'))
            }
            console.log(this.get("selectedExpression"))
            console.log(subexpressions)
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
              }
              this.set("last_truth_value", true);

              if(this.get("feedback") === "false" && this.get("evaluation") === false)
                return "#EEEEEE"

              return "99FF66"
            }
            else{
              if(this.get("last_truth_value") != false){
                this.set("mistakes", this.get("mistakes") + 1);
              }
              if(this.get("last_truth_value") == null){
                this.set("answered", this.get("answered") + 1)
              }
              this.set("last_truth_value", false);
              if(this.get("feedback") === "false" && this.get("evaluation") === false)
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
    }.property('validAnswer', 'correctAnswer', 'feedback', 'mistakes', 'last_truth_value', 'answered', 'evaluation'),
    parser: boolean_evaluate,
    truthArray: function(){
        var output = Ember.A([])
        for(i = this.get("variable").length; i > 0; i--){
            if((Math.pow(2, this.get("variable").length - i)&this.get("row"))!= 0)
                output.pushObject("F")
            else
                output.pushObject("T")
        }
        return output.reverse();
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
    }.property('truthArray', 'expression', 'variable', 'parser'),
})

App.TruthVariableComponent = Ember.Component.extend({
    variable: '',
    classNameBindings: ['isSubexpressionOfSelected'],
    index: '',
    variables: '',
    column_split: boolean_split,
    column_split_2: boolean_split_2,
    isSubexpressionOfSelected: function(){
        if(this.get('selectedExpression')){
            try{
                subexpressions = this.get("column_split").parse(this.get('selectedExpression'))
                subexpressions.concat(this.get("column_split_2").parse(this.get('selectedExpression')))
            }
            catch(err) {
                subexpressions = this.get("column_split_2").parse(this.get('selectedExpression'))
            }
            return subexpressions.indexOf(this.get("variable")) != -1
        }
    }.property('selectedExpression', "variable"),
    truthValue: function(){
        if((Math.pow(2, this.get("variables").length - 1 - this.get("variables").indexOf(this.get("variable")))&this.get("index"))!= 0)
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
    answer: null,
    value: null,
    keyDown: function(e){
      if(e.ctrlKey && e.keyCode === 191){
        if(this.get("answer")){
          this.set("value", 'T')
        }
        else{
          this.set("value", 'F')
        }
      }
    },
    classNames: ['guess-input'],
    style: function(){
        return "background-color:" + this.get("color") + ';'
    }.property('color')
})

App.ExpressionChecker = Ember.TextField.extend({
    attributeBindings: ["style"],
    invalidExpression: false,
    style: function(){
      if(this.get("invalidExpression") == true){
        return "background-color:#FF3333;"
      }
      else {
        return ""
      }
    }.property("invalidExpression")
})
