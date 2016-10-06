// const NLP_SERVICE_CREDENTIAL = "";
// const NLP_SERVICE_PASSWORD = "";
// const TEXT_TO_SPEECH_UN = "dbedbd53-5ac1-4f44-a97b-d682c856acc6"
// const TEXT_TO_SPEECH_PASS = "X47ysWgxe4mD"
// const TEXT_TO_SPEECH_URL = "https://stream.watsonplatform.net/text-to-speech/api";
// const VOICE = "en-GB_KateVoice";
console.log("Initializing Services...");

app.service('NLPService', function($http) {
    this.processText = function( text ){
        $http.get("http://www.httpbin.org/get?sample=" + text)
        .success(function(data){
            console.log(data);
            return JSON.stringify(data);
        }).error(function(data){
            return "Shit";
        });
    };
});

app.service('RandRService', function($http){
    this.sendRequest = function(sentence){
        return $http.get("/api/search?q=" + sentence);
    }
});


app.service('RecipeService', function(){

    var selectedRecipe = {};
    var recipes = [];
    var recipeRows = [];

    this.addRecipe = function(json){
        recipe = {};

        recipe.id = json.id;
        recipe.title = json.title[0];
        recipe.ingredients = [];
        recipe.instructions = [];
        recipe.tags = [];
        recipe.pictureUrl = json.picture[0];
        recipe.yield = json.yield[0];
        recipe.about = json.about[0];
        var ingredients = json.ingredients[0].split(';');
        for (var i = 0; i < ingredients.length ; i++){
            var ingr = ingredients[i].trim();
            recipe.ingredients[i] = ingr.charAt(0).toUpperCase() + ingr.slice(1);
        };
        var instructions = json.instructions[0].split(';');
        for (var i = 0; i < instructions.length ; i++){
            var inst = instructions[i].trim();
            if (/^([1-9]\d*)$/.test(inst) == false){
                recipe.instructions.push(inst.charAt(0).toUpperCase() + inst.slice(1));
            }
        };
        var tags = json.tags[0].split(';');
        for (var i = 0; i < tags.length ; i++){
            var tag = tags[i].trim();
            recipe.tags[i] = tag.charAt(0).toUpperCase() + tag.slice(1);
        };
        recipes.push(recipe);

    }

    this.removeRecipe = function(params){
        //TODO: remove recipes by any parameter(s)
    };


    this.getRecipes = function(){
        return recipes;
    }


    this.getRecipeRows = function(){
        recipeRows = [];
        for(var i = 0; i < recipes.length - 3; i += 3){
            row = [];
            row.push(recipes[i]);
            row.push(recipes[i+1]);
            row.push(recipes[i+2]);
            recipeRows.push(row);
        }
        return recipeRows
    }

    this.clearRecipes = function(){
        recipes = [];
    }

    this.setSelectedRecipe = function(recipe){
        selectedRecipe = recipe;
    }

    this.getSelectedRecipe = function(){
        return selectedRecipe;
    }

});



app.service('TextToSpeechService', function($http) {

    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[2]; // Note: some voices don't support altering params
        msg.voiceURI = 'native';
        msg.volume = 1; // 0 to 1
        msg.rate = 1; // 0.1 to 10
        msg.pitch = 2;

    this.speak = function(text){
        msg.text = text;
        window.speechSynthesis.speak(msg);
    }

});


app.service('UnitConversionParser', function() {

    var sourceValue = 0;
    var sourceType = "";
    var targetValue = 0;
    var targetType = "";

    this.parseSentence = function(sentence){

        //TODO: Jackson create a parser to get and set sourceValue, sourceType, targetValue, targetType

    }

    this.getSourceValue = function(){
        return sourceValue;
    }

    this.getSourceType = function(){
        return sourceType;
    }

    this.getTargetValue = function(){
        return targetValue;
    }

    this.getTargetType = function(){
        return targetType;
    }


});
