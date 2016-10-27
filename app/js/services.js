app.service('RandRService', function($http){
    this.sendRequest = function(sentence){
        return $http.get("/api/recipes?q=" + sentence);
    }
});

app.service('ClassifyService', function($http){
    this.classifyRequest = function(sentence){
        return $http.get("/api/classify?q=" + sentence);
    }
});


app.service('RecipeService', function(){

    var selectedRecipe = {};
    var recipes = [];
    var recipeRows = [];
    var filter = {};
    filter.isActive = false;
    filter.exclude = {};
    filter.exclude.sentence = "";
    filter.include = {};
    filter.include.sentence = "";

    this.getFilter = function(){
        return filter
    }

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

app.service('InstructionService', function(){
    var instruction = {};
    instruction.currentInstruction = "";
    instruction.stepNumber = 0;

    this.getInstruction = function(){
        return instruction;
    }

    this.setCurrentInstruction = function(instr){
        instruction.currentInstruction = instr;
    }

    this.setCurrentInstructionStep = function(step){
        instruction.stepNumber = step;
    }

    this.incrementStep = function(){
        instruction.stepNumber++;
    }

    this.decrementStep = function(){
        instruction.stepNumber--;
    }

});

app.service('TextToSpeechService', function($http) {

    var utterance = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    // utterance.voice = voices[2]; // Note: some voices don't support altering params
    utterance.voice = voices.filter(function(voice) { return voice.name === 'Google UK English Female'; })[0];

    utterance.voiceURI = 'native';
    utterance.volume = 1; // 0 to 1
    utterance.rate = 1; // 0.1 to 10
    utterance.pitch = 7;

    this.speak = function(text){
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    }

});


app.service('ConversionService', function(){

    var converter = {}
    converter.sentence = ""
    converter.result = "";
    converter.show = false;

    this.getConverter = function(){
        return converter;
    }

    this.resetConverter = function(){
        converter.sentence = ""
        converter.result = "";
    }
    this.showConverter = function(){
        converter.show = true;
    };

    this.hideConverter = function(){
        converter.show = false;
    };
});


app.service('UnitConversionParser', function() {

    var sourceValue = 0;
    var sourceType = "";
    var targetType = "";


    this.getSourceValue = function(){
        return sourceValue;
    }

    this.getSourceType = function(){
        return sourceType;
    }

    this.getTargetType = function(){
        return targetType;
    }

    this.parseSentenceConvertUnits = function(sentence){
        parseSentence(sentence);
        targetValue = convert(sourceValue, sourceType, targetType);
		targetType = abbrev(targetType);

        return targetValue + " " + targetType;
    }

    var parseSentence = function(sentence){
        var words = sentence.split(' ');
        var TargID;
		var srcID;
		var ones = ["zero","one","two","three","four","five","six","seven","eight","nine"];
		var teens = ["null","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"]
		var tens = ["null","ten","twenty","thirty","forty","fifty","sixty","seven","eight","nine"];
		var mag = ["a","point","minus","negative","hundred","thousand"];
		var units = ["celsius","fahrenheit","degree","teaspoon","tablespoon","fluid ounce","cup","pint","quart","gallon","milliliter","liter","ounce","pound","gram","kilogram","celsius","fahrenheit","degrees","teaspoons","tablespoons","fluid","cups","pints","quarts","gallons","milliliters","liters","ounces","pounds","grams","kilograms"]

		currentWord = 0;
		if(words[0] === ("how") && words[1] === ("many")){
			currentWord = 2;
			targID = units.indexOf(words[currentWord]);
			if(targID > 15){
				targID = targID - 16;
			}
			targetType = units[targID];
			if(targetType === ("degree") || targetType === ("degrees")){
				targetType = words[currentWord + 1];
				currentWord++;
			}
			currentWord = words.indexOf("in");
			if (words.indexOf("in") === -1){
					currentWord = words.indexOf("per");
				}
			currentWord++;

			numStart = currentWord;
			while(units.indexOf(words[currentWord]) == -1 && currentWord < words.length){
				currentWord++;
			}
			sourceValue = numParse(words.slice(numStart,currentWord));
			srcID = units.indexOf(words[currentWord]);
			if(srcID > 15){
				srcID = srcID - 16;
			}
			sourceType = units[srcID];
			if(sourceType === ("degree") || sourceType === ("degrees")){
				sourceType = words[currentWord + 1];
				currentWord++;
			}
		}
		else if(units.indexOf(words[0]) != -1){
			if(words[1] === ("in") || words[2] === ("in") || words[1] === ("per") || words[2] === ("per")){
				currentWord = 0;
				targID = units.indexOf(words[currentWord]);
				if(targID > 15){
					targID = targID - 16;
				}
				targetType = units[targID];
				if(targetType === ("degree") || targetType === ("degrees")){
				targetType = words[currentWord + 1];
				currentWord++;
				}
				currentWord = words.indexOf("in")+1;
				if (words.indexOf("in") === -1){
					currentWord = words.indexOf("per")+1;
				}

				numStart = currentWord;
				while(units.indexOf(words[currentWord]) == -1){
					currentWord++;
				}
				sourceValue = numParse(words.slice(numStart,currentWord));
				srcID = units.indexOf(words[currentWord]);
				if(srcID > 15){
					srcID = srcID - 16;
				}
				sourceType = units[srcID];
				if(sourceType === ("degree") || sourceType === ("degrees")){
					sourceType = words[currentWord + 1];
					currentWord++;
				}
			}
			else if(words[1] === ("to")){
				srcID = units.indexOf(words[currentWord]);
				if(srcID > 15){
					srcID = srcID - 16;
				}
				sourceType = units[srcID];
				if(sourceType === ("degree") || sourceType === ("degrees")){
					sourceType = words[currentWord + 1];
					currentWord++;
				}
				sourceValue = 1;
				currentWord = 2;
				targID = units.indexOf(words[currentWord]);
				if(targID > 15){
					targID = targID - 16;
				}
				targetType = units[targID];
				if(targetType === ("degree") || targetType === ("degrees")){
					targetType = words[currentWord + 1];
					currentWord++;
				}
			}
			
			else{
				targetType = "ERROR";
				sourceType = "ERROR";
				sourceValue = -1;
			}

		}
		else if(ones.indexOf(words[0]) != -1  || tens.indexOf(words[0]) != -1  || teens.indexOf(words[0]) != -1 || mag.indexOf(words[0]) != -1 || !isNaN(words[0])){
			numStart = currentWord;
			while(units.indexOf(words[currentWord]) == -1){
				currentWord++;
			}
			sourceValue = numParse(words.slice(numStart,currentWord));
			srcID = units.indexOf(words[currentWord]);
			if(srcID > 15){
				srcID = srcID - 16;
			}
			sourceType = units[srcID];
			if(sourceType === ("degree") || sourceType === ("degrees")){
				sourceType = words[currentWord + 1];
				currentWord++;
			}
			currentWord = words.indexOf("to");
			currentWord++;
			targID = units.indexOf(words[currentWord]);
			if(targID > 15){
				targID = targID - 16;
			}
			targetType = units[targID];
			if(targetType === ("degree") || targetType === ("degrees")){
				targetType = words[currentWord + 1];
				currentWord++;
				}

		}
		
		else{
				targetType = "ERROR";
				sourceType = "ERROR";
				sourceValue = -1;
			}


    }

	function numParse(textArray){
		var ones = ["zero","one","two","three","four","five","six","seven","eight","nine"];
		var teens = ["null","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"]
		var tens = ["null","ten","twenty","thirty","forty","fifty","sixty","seven","eight","nine"];
		var mag = ["null","null","hundred"];
		var misc = ["a","point","minus","negative","and"];

		var word = 0;
		var number = 0;
		var value;
		var place;
		var sign = 1;


		if(textArray.length == 0 || (textArray.length == 1 && (textArray[0] === ("a") || textArray[0] === ("an")))){
			number = 1;
		}

		else if(textArray.length == 1 && !isNaN(textArray[0])){
			number = parseFloat(textArray[0]);
		}

		else if(textArray.indexOf("half") != -1){
			number = 0.5
		}

		else if(textArray.indexOf("quarter") != -1){
			number = 0.25
		}

		else if(textArray.indexOf("eighth") != -1){
			number = 0.125
		}

		else{
			while(word < textArray.length){
				value = 0;
				place = 0;
				if(ones.indexOf(textArray[word]) != -1){
					value = ones.indexOf(textArray[word]);
					word++;
					if(mag.indexOf(textArray[word]) != -1){
						place = Math.pow(10, mag.indexOf(textArray[word]));
					}
					else{
						place = 1;
					}
					word++;
					if(word < textArray.length && textArray[word] === ("and")){
					word++;
					}

				}
				else if(teens.indexOf(textArray[word]) != -1){
					value = teens.indexOf(textArray[word]) + 10;
					word++;
					if(mag.indexOf(textArray[word]) != -1){
						place = Math.pow(10, mag.indexOf(textArray[word]));
					}
					else{
						place = 1;
					}
					word++;
				}
				else if(tens.indexOf(textArray[word]) != -1){
					value = tens.indexOf(textArray[word]);
					place = 10;
					word++;
				}
				else if(textArray[word] === ("a")){
					value = 1;
					if(mag.indexOf(textArray[word]) != -1){
						place = Math.pow(10, mag.indexOf(textArray[word]));
					}
					else{
						place = 1;
					}
					word++;
				}
				else if(textArray[word] === ("minus") || textArray[word] === ("negative")){
					sign = -1;
					word++;
				}
				
				else{
					word++;
				}

				number += sign*value*place;
			}
		}

		return number;
	}

    var abbrev = function(targType){
		var typeIDs = ["teaspoon", "tablespoon", "fluid ounce", "cup", "pint", "quart", "gallon", "milliliter", "liter", "ounce", "pound", "gram", "kilogram","fahrenheit","celsius"];
		var typeAbbrev = ["tspn","tblspn","fl oz","c","pnt","qrt","gal","ml","l","oz","lb","g","kg","°F","°C"]
		var id = typeIDs.indexOf(targType);
		return typeAbbrev[id];
	}

    var convert = function(srcVal, srcType, targType) {
        var volume = [1, 3, 6, 48, 96, 192, 768, 0.202884, 202.884]; //teaspooon, tblspoon, ounce, cup, pint, quart, gallon, milliliter, liter
        var weight = [1, 16, 0.035274, 35.274]; //ounce, pound, gram, kilogram
		var temp = [] //Fahrenheit, Celsius
        var typeIDs = ["teaspoon", "tablespoon", "fluid ounce", "cup", "pint", "quart", "gallon", "milliliter", "liter", "ounce", "pound", "gram", "kilogram","fahrenheit","celsius"];
        var srcUnit = 0; //volume, weight, temp
        var targUnit = 0;

        var targVal;

		srcID = typeIDs.indexOf(srcType);
		targID = typeIDs.indexOf(targType);

		if(targID > 8 && targID <= 12){
			targID = targID - 9;
			targUnit = 1;}
		else if(targID <= 8)
			targUnit = 0;
		else if(targID > 12){
			targID = targID - 13;
			targUnit = 2;}

		if(srcID > 8 && srcID <= 12){
			srcID = srcID - 9;
			srcUnit = 1;}
		else if(srcID <= 8)
			srcUnit = 0;
		else if(srcID > 12){
			srcID = srcID - 13;
			srcUnit = 2;}


		var srcSize = 0;

        if (srcUnit == 0) {
            srcSize = srcVal * volume[srcID];
            targSize = srcSize / volume[targID];
        }
        if (srcUnit == 1) {
            srcSize = srcVal * weight[srcID];
            targSize = srcSize / weight[targID];
        }
		if(srcUnit == 2){
			console.log(srcID);
			console.log(targID);
			if(srcID == 0 && targID == 1){ //Fahrenheit to Celsius
				targSize = (srcVal - 32)* 5.0/9;
			}
			else if(srcID == 1 && targID == 0){	//Celsius to Fahrenheit
				targSize = srcVal * 1.8 +32;
			}
			else{
				targSize = srcVal;
			}
		}
        if (Math.trunc(targSize) == (targSize).toFixed(2)){
            return Math.trunc(targSize)
        } else {
            return (targSize).toFixed(2);
        }
    }
});



app.service('TimerService', function(){

    var timer = {};
    timer.show = false;
    timer.showTitlePage = false;
    timer.showTimePage = false;
    timer.title = "";
    timer.time = {};
    timer.time.hours = "";
    timer.time.minutes = "";
    timer.time.seconds = "";
    timer.time.totalSeconds = 0;

    var padWithZeros = function(t){
        if (t < 10){
            return "0" + t;
        } else {
            return "" + t;
        }
    }

    var refreshTimeFields = function(){
        timer.time.seconds = timer.time.totalSeconds % 60;
        timer.time.minutes = Math.floor(timer.time.totalSeconds / 60) % 60;
        timer.time.hours = Math.floor(timer.time.totalSeconds / 3600);
    }

    this.getTimer = function(){
        return timer;
    }

    this.prettyPrintTime = function(){
        var strHours = padWithZeros(timer.time.hours);
        var strMinutes = padWithZeros(timer.time.minutes);
        var strSeconds = padWithZeros(timer.time.seconds);
        return strHours + ":" + strMinutes + ":" + strSeconds;
    }

    this.setTotalSeconds = function(){
        timer.time.totalSeconds = timer.time.hours*3600 + timer.time.minutes*60 + timer.time.seconds
        return timer.time.totalSeconds;
    }

    this.decrementTime = function(){
        if(timer.time.totalSeconds == 1){
            timer.time.seconds = 0;
            timer.time.totalSeconds = 0;
            return true;
        } else {
            timer.time.totalSeconds--;
            refreshTimeFields();
        }
    }

    this.resetTimer = function(){
        timer.show = false;
        timer.showTitlePage = false;
        timer.showTimePage = false;
        timer.title = "";
        timer.time = {};
        timer.time.hours = 0;
        timer.time.minutes = 0;
        timer.time.seconds = 0;
        timer.time.totalSeconds = 0;

        return timer;
    }

});

app.service('ListenerService', function(){

    var listener = {};
    listener.isActive = true;
    listener.showText = false;

    this.getListener = function(){
        return listener;
    }

    this.setActive = function(){
        listener.isActive = true;
    }

    this.setInactive = function(){
        listener.isActive = false;
    }

    this.showText = function(){
        listener.showText = true;
    }

    this.hideText = function(){
        listener.showText = false;
    }



});
