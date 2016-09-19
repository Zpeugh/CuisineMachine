const NLP_SERVICE_CREDENTIAL = "";
const NLP_SERVICE_PASSWORD = "";
const TEXT_TO_SPEECH_UN = "dbedbd53-5ac1-4f44-a97b-d682c856acc6"
const TEXT_TO_SPEECH_PASS = "X47ysWgxe4mD"
const TEXT_TO_SPEECH_URL = "https://stream.watsonplatform.net/text-to-speech/api";
const VOICE = "en-GB_KateVoice";
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

    var recipes = [];

    this.addRecipe = function(json){
        recipe = {};
        recipe.id = json.id[0];
        recipe.title = json.title[0];
        recipe.ingredients = [];
        recipe.instructions = [];
        recipe.tags = [];
        recipe.pictureUrl = json.picture[0];
        recipe.yield = json.yield[0];
        recipe.tags = json.tags[0];
        recipe.about = json.about[0];
        var ingredients = json.ingredients[0].split(';');
        for (var i = 0; i < ingredients.length ; i++){
            var ingr = ingredients[i].trim();
            recipe.ingredients[i] = ingr.charAt(0).toUpperCase() + ingr.slice(1);
        };
        var instructions = json.instructions[0].split(';');
        for (var i = 0; i < instructions.length ; i++){
            var inst = instructions[i].trim();
            recipe.instructions[i] = inst.charAt(0).toUpperCase() + inst.slice(1);
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

    this.clearRecipes = function(){
        recipes = [];
    }

});




app.service('TextToSpeechService', function($http) {
    this.speakText = function( text ){
        $.ajax({
            crossOrigin: true,
            url: TEXT_TO_SPEECH_URL,
            headers: {
                "Content-Type": "application/json",
                "Accept": "audio/wav"
            },
            method: "POST",
            dataType: "jsonp",
            data: {"username": TEXT_TO_SPEECH_UN,
                    "password": TEXT_TO_SPEECH_PASS,
                    "voice" : VOICE,
                    "text" : text},
            success: function(response) {
                console.log("success");
                console.log(response);
                return response;
            },
            error: function(response) {
                console.log("error");
                console.log(response);
                return response;
            }
        });
    };
});
