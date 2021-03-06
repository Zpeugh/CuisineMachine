app.service('RandRService', function($http) {
    this.sendRequest = function(sentence) {
        return $http.get("/api/recipes?q=" + sentence);
    }
});

app.service('ClassifyService', function($http) {
    this.classifyRequest = function(sentence) {
        return $http.get("/api/classify?q=" + sentence);
    }
});


app.service('RecipeService', function() {

    var recipeService = {};
    recipeService.selectedRecipe = {};
    recipeService.recipes = [];
    recipeService.recipeRows = [];
    recipeService.filter = {};
    recipeService.filter.isActive = false;
    recipeService.filter.exclude = {};
    recipeService.filter.exclude.sentence = "";
    recipeService.filter.include = {};
    recipeService.filter.include.sentence = "";
    recipeService.filter.category = {};
    recipeService.filter.category.vegan = {};
    recipeService.filter.category.vegetarian = {};
    recipeService.filter.category.dairy = {};
    recipeService.filter.category.nut = {};

    recipeService.filter.category.vegan.include = ["soy milk", "rice milk", "almond milk", "coconut milk"];
    recipeService.filter.category.vegan.exclude = ["chicken", "duck", "turkey", "bison", "beef", "calf", "goat", "ham", "pork", "bacon", "goose", "fish", "anchovy", "basa", "bass", "black cod/sablefish", "blowfish", "bluefish", "bombay duck", "bream", "brill", "butter fish", "catfish", "cod", "dogfish", "dorade", "eel", "flounder", "grouper", "haddock", "hake", "halibut", "herring", "ilish", "john dory", "kingfish", "lamprey", "lingcod", "mackerel", "mahi mahi", "monkfish", "mullet", "orange roughy", "parrott fish", "patagonian toothfish", "pike", "pilchard", "pollock", "pomfret", "pompano", "sablefish", "salmon", "sanddab", "particularly pacific sanddab", "sardine", "sea bass", "shad", "shark", "skate", "smelt", "snakehead", "snapper", "sole", "sprat", "sturgeon", "surimi", "swordfish", "tilapia", "tilefish", "trout", "tuna", "turbot", "wahoo", "whitefish", "whiting", "cockle", "cuttlefish", "loco", "mussel", "octopus", "oyster", "periwinkle", "scallop", "squid", "crab", "crayfish", "prawn", "lobster", "shrimp butter", "buttermilk", "cheese", "milk", "crème", "creme", "yogurt", "yoghurt", "custard", "cream", "crema"];
    recipeService.filter.category.vegetarian.include = [];
    recipeService.filter.category.vegetarian.exclude = ["chicken", "duck", "turkey", "bison", "beef", "calf", "goat", "ham", "pork", "bacon", "goose", "fish", "anchovy", "basa", "bass", "black cod/sablefish", "blowfish", "bluefish", "bombay duck", "bream", "brill", "butter fish", "catfish", "cod", "dogfish", "dorade", "eel", "flounder", "grouper", "haddock", "hake", "halibut", "herring", "ilish", "john dory", "kingfish", "lamprey", "lingcod", "mackerel", "mahi mahi", "monkfish", "mullet", "orange roughy", "parrott fish", "patagonian toothfish", "pike", "pilchard", "pollock", "pomfret", "pompano", "sablefish", "salmon", "sanddab", "particularly pacific sanddab", "sardine", "sea bass", "shad", "shark", "skate", "smelt", "snakehead", "snapper", "sole", "sprat", "sturgeon", "surimi", "swordfish", "tilapia", "tilefish", "trout", "tuna", "turbot", "wahoo", "whitefish", "whiting", "cockle", "cuttlefish", "loco", "mussel", "octopus", "oyster", "periwinkle", "scallop", "squid", "crab", "crayfish", "prawn", "lobster", "shrimp"];
    recipeService.filter.category.dairy.include = ["soy milk", "rice milk", "almond milk", "coconut milk"];
    recipeService.filter.category.dairy.exclude = ["butter", "buttermilk", "cheese", "milk", "crème", "creme", "yogurt", "yoghurt", "custard", "cream", "crema"];
    recipeService.filter.category.nut.include = [];
    recipeService.filter.category.nut.exclude = ["nut", "peanut", "walnut", "pecan", "almond", "cashew", "chestnut", "coconut", "hazelnut", "pistachio"];

    this.getFilter = function() {
        return recipeService.filter
    }

    this.addRecipe = function(json) {
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
        for (var i = 0; i < ingredients.length; i++) {
            var ingr = ingredients[i].trim();
            recipe.ingredients[i] = ingr.charAt(0).toUpperCase() + ingr.slice(1);
        };
        var instructions = json.instructions[0].split(';');
        for (var i = 0; i < instructions.length; i++) {
            var inst = instructions[i].trim();
            if (/^([1-9]\d*)$/.test(inst) == false) {
                recipe.instructions.push(inst.charAt(0).toUpperCase() + inst.slice(1));
            }
        };
        var tags = json.tags[0].split(';');
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i].trim();
            recipe.tags[i] = tag.charAt(0).toUpperCase() + tag.slice(1);
        };
        recipeService.recipes.push(recipe);

    }

    this.getRecipeService = function() {
        return recipeService;
    }

    //removes recipe by index in recipes
    var removeRecipe = function(index) {
        recipeService.recipes.splice(index, 1);
    };

    this.setRecipeRows = function() {
        recipeService.recipeRows = [];
        if (recipeService.recipes.length <= 3) {
            row = [];
            for (var i = 0; i < recipeService.recipes.length; i++) {
                row.push(recipeService.recipes[i]);
            }
            recipeService.recipeRows.push(row);
        } else {
            for (var i = 0; i < recipeService.recipes.length - 3; i += 3) {
                row = [];
                row.push(recipeService.recipes[i]);
                row.push(recipeService.recipes[i + 1]);
                row.push(recipeService.recipes[i + 2]);
                recipeService.recipeRows.push(row);
            }
        }
    }

    this.clearRecipes = function() {
        recipeService.selectedRecipe = {};
        recipeService.recipes = [];
        recipeService.recipeRows = [];
    }

    this.setSelectedRecipe = function(recipe) {
        recipeService.selectedRecipe = recipe;
    }

    this.getSelectedRecipe = function() {
        return recipeService.selectedRecipe;
    }

    this.clearExclusionFilter = function() {
        recipeService.filter.exclude.sentence = "";
    }

    this.clearInclusionFilter = function() {
        recipeService.filter.include.sentence = "";
    }


    this.includeIngredients = function() {
        filteredRecipes = [];
        for (var i = 0; i < recipeService.recipes.length - 1; i++) {
            recipe = recipeService.recipes[i];
            included = false;
            for (var j = 0; j < recipe.ingredients.length; j++) {
                ingredient = recipe.ingredients[j].toLowerCase();
                if (ingredient.indexOf(recipeService.filter.include.sentence) != -1) {
                    included = true;
                    console.log("" + i + "has ingredient");
                }
            }
            if (included) {
                console.log("pushing ");
                console.log(recipe);
                filteredRecipes.push(recipe);
            }
        }
        recipeService.recipes = filteredRecipes;
        this.setRecipeRows();
    }

    this.excludeIngredients = function() {
        filteredRecipes = [];
        var excludeList;
        var isCategory;
        switch (recipeService.filter.exclude.sentence.toLowerCase()) {
            case "vegan":
            case "animal products":
                excludeList = recipeService.filter.category.vegan.exclude;
                isCategory = true;
                break;
            case "vegetarian":
            case "meat":
                excludeList = recipeService.filter.category.vegetarian.exclude;
                isCategory = true;
                break;
            case "dairy":
                excludeList = recipeService.filter.category.dairy.exclude;
                isCategory = true;
                break;
            case "nut":
            case "nuts":
                excludeList = recipeService.filter.category.nut.exclude;
                isCategory = true;
                break;
            default:
                excludeList = recipeService.filter.exclude.sentence;
                isCategory = false;
        }

        for (var i = 0; i < recipeService.recipes.length; i++) {
            recipe = recipeService.recipes[i];
            ingredientNotFound = true;
            for (var j = 0; ingredientNotFound && j < recipe.ingredients.length; j++) {
                ingredient = recipe.ingredients[j].toLowerCase();
                if (!isCategory) {
                    if (ingredient.indexOf(excludeList) != -1) {
                        ingredientNotFound = false;
                    }
                } else {
                    for (var k = 0; k < excludeList.length; k++) {
                        if (ingredient.indexOf(excludeList[k]) != -1) {
                            ingredientNotFound = false;
                            break;
                        }
                    }

                }
            }
            if (ingredientNotFound) {
                filteredRecipes.push(recipe)
            }
        }
        recipeService.recipes = filteredRecipes;
        this.setRecipeRows();
    }
});

app.service('InstructionService', function() {
    var instruction = {};
    instruction.currentInstruction = "";
    instruction.stepNumber = 0;

    this.getInstruction = function() {
        return instruction;
    }

    this.setCurrentInstruction = function(instr) {
        instruction.currentInstruction = instr;
    }

    this.setCurrentInstructionStep = function(step) {
        instruction.stepNumber = step;
    }

    this.incrementStep = function() {
        instruction.stepNumber++;
    }

    this.decrementStep = function() {
        instruction.stepNumber--;
    }

});

app.service('TextToSpeechService', function($http) {

    var utterance = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    // utterance.voice = voices[2]; // Note: some voices don't support altering params
    utterance.voice = voices.filter(function(voice) {
        return voice.name === 'Google UK English Female';
    })[0];

    utterance.voiceURI = 'native';
    utterance.volume = 1; // 0 to 1
    utterance.rate = 1; // 0.1 to 10
    utterance.pitch = 7;

    this.speak = function(text) {
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    }

});

app.service('ConversionService', function() {

    var converter = {}
    converter.sentence = ""
    converter.result = "";
    converter.show = false;

    this.getConverter = function() {
        return converter;
    }

    this.resetConverter = function() {
        converter.sentence = ""
        converter.result = "";
    }
    this.showConverter = function() {
        converter.show = true;
    };

    this.hideConverter = function() {
        converter.show = false;
    };
});

app.service('UnitConversionParser', function() {

    var sourceValue = 0;
    var sourceType = "";
    var targetType = "";


    this.getSourceValue = function() {
        return sourceValue;
    }

    this.getSourceType = function() {
        return sourceType;
    }

    this.getTargetType = function() {
        return targetType;
    }

    this.parseSentenceConvertUnits = function(sentence) {
        parseSentence(sentence);
        targetValue = convert(sourceValue, sourceType, targetType);
        targetType = abbrev(targetType);
        var ret = "";
        if (isNaN(targetValue) || targetType == null) {
            ret = "Try asking that a different way";
        } else {
            ret = targetValue + " " + targetType;
        }

        return ret;
    }

    var parseSentence = function(sentence) {

        sentence = sentence.toLowerCase();
        if (sentence.length > 0 && sentence.includes(" ")) {
            var words = sentence.split(' ');
            var TargID;
        } else {
            var words = "ERROR";
        }


        var srcID;
        var ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        var teens = ["null", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
        var tens = ["null", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seven", "eight", "nine"];
        var mag = ["a", "point", "minus", "negative", "hundred", "thousand"];
        var units = ["celsius", "fahrenheit", "degree", "teaspoon", "tablespoon", "fluid ounce", "cup", "pint", "quart", "gallon", "milliliter", "liter", "ounce", "pound", "gram", "kilogram", "celsius", "fahrenheit", "degrees", "teaspoons", "tablespoons", "fluid", "cups", "pints", "quarts", "gallons", "milliliters", "liters", "ounces", "pounds", "grams", "kilograms"]

        currentWord = 0;
        if (words[0] === ("how") && words[1] === ("many")) {
            currentWord = 2;
            targID = units.indexOf(words[currentWord]);
            if (targID > 15) {
                targID = targID - 16;
            }
            targetType = units[targID];
            if (targetType === ("degree") || targetType === ("degrees")) {
                targetType = words[currentWord + 1];
                currentWord++;
            }
            currentWord = words.indexOf("in");
            if (words.indexOf("in") === -1) {
                currentWord = words.indexOf("per");
            }
            currentWord++;

            numStart = currentWord;
            while (units.indexOf(words[currentWord]) == -1 && currentWord < words.length) {
                currentWord++;
            }
            sourceValue = numParse(words.slice(numStart, currentWord));
            srcID = units.indexOf(words[currentWord]);
            if (srcID > 15) {
                srcID = srcID - 16;
            }
            sourceType = units[srcID];
            if (sourceType === ("degree") || sourceType === ("degrees")) {
                sourceType = words[currentWord + 1];
                currentWord++;
            }
        } else if (units.indexOf(words[0]) != -1) {
            if (words[1] === ("in") || words[2] === ("in") || words[1] === ("per") || words[2] === ("per")) {
                currentWord = 0;
                targID = units.indexOf(words[currentWord]);
                if (targID > 15) {
                    targID = targID - 16;
                }
                targetType = units[targID];
                if (targetType === ("degree") || targetType === ("degrees")) {
                    targetType = words[currentWord + 1];
                    currentWord++;
                }
                currentWord = words.indexOf("in") + 1;
                if (words.indexOf("in") === -1) {
                    currentWord = words.indexOf("per") + 1;
                }

                numStart = currentWord;
                while (units.indexOf(words[currentWord]) == -1) {
                    currentWord++;
                }
                sourceValue = numParse(words.slice(numStart, currentWord));
                srcID = units.indexOf(words[currentWord]);
                if (srcID > 15) {
                    srcID = srcID - 16;
                }
                sourceType = units[srcID];
                if (sourceType === ("degree") || sourceType === ("degrees")) {
                    sourceType = words[currentWord + 1];
                    currentWord++;
                }
            } else if (words[1] === ("to")) {
                srcID = units.indexOf(words[currentWord]);
                if (srcID > 15) {
                    srcID = srcID - 16;
                }
                sourceType = units[srcID];
                if (sourceType === ("degree") || sourceType === ("degrees")) {
                    sourceType = words[currentWord + 1];
                    currentWord++;
                }
                sourceValue = 1;
                currentWord = 2;
                targID = units.indexOf(words[currentWord]);
                if (targID > 15) {
                    targID = targID - 16;
                }
                targetType = units[targID];
                if (targetType === ("degree") || targetType === ("degrees")) {
                    targetType = words[currentWord + 1];
                    currentWord++;
                }
            } else {
                targetType = "ERROR";
                sourceType = "ERROR";
                sourceValue = -1;
            }

        } else if (ones.indexOf(words[0]) != -1 || tens.indexOf(words[0]) != -1 || teens.indexOf(words[0]) != -1 || mag.indexOf(words[0]) != -1 || !isNaN(words[0])) {
            numStart = currentWord;
            while (units.indexOf(words[currentWord]) == -1) {
                currentWord++;
            }
            sourceValue = numParse(words.slice(numStart, currentWord));
            srcID = units.indexOf(words[currentWord]);
            if (srcID > 15) {
                srcID = srcID - 16;
            }
            sourceType = units[srcID];
            if (sourceType === ("degree") || sourceType === ("degrees")) {
                sourceType = words[currentWord + 1];
                currentWord++;
            }
            currentWord = words.indexOf("to");
            currentWord++;
            targID = units.indexOf(words[currentWord]);
            if (targID > 15) {
                targID = targID - 16;
            }
            targetType = units[targID];
            if (targetType === ("degree") || targetType === ("degrees")) {
                targetType = words[currentWord + 1];
                currentWord++;
            }

        } else {
            targetType = "ERROR";
            sourceType = "ERROR";
            sourceValue = -1;
        }


    }

    function numParse(textArray) {
        var ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        var teens = ["null", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
        var tens = ["null", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        var mag = ["null", "null", "hundred"];
        var misc = ["a", "point", "minus", "negative", "and"];

        var word = 0;
        var number = 0;
        var value;
        var place;
        var sign = 1;


        if (textArray.length == 0 || (textArray.length == 1 && (textArray[0] === ("a") || textArray[0] === ("an")))) {
            number = 1;
        } else if (textArray.length == 1 && !isNaN(textArray[0])) {
            number = parseFloat(textArray[0]);
        } else if (textArray.indexOf("half") != -1) {
            number = 0.5
        } else if (textArray.indexOf("quarter") != -1) {
            number = 0.25
        } else if (textArray.indexOf("eighth") != -1) {
            number = 0.125
        } else {
            while (word < textArray.length) {
                value = 0;
                place = 0;
                if (ones.indexOf(textArray[word]) != -1) {
                    value = ones.indexOf(textArray[word]);
                    word++;
                    if (mag.indexOf(textArray[word]) != -1) {
                        place = Math.pow(10, mag.indexOf(textArray[word]));
                    } else {
                        place = 1;
                    }
                    word++;
                    if (word < textArray.length && textArray[word] === ("and")) {
                        word++;
                    }

                } else if (teens.indexOf(textArray[word]) != -1) {
                    value = teens.indexOf(textArray[word]) + 10;
                    word++;
                    if (mag.indexOf(textArray[word]) != -1) {
                        place = Math.pow(10, mag.indexOf(textArray[word]));
                    } else {
                        place = 1;
                    }
                    word++;
                } else if (tens.indexOf(textArray[word]) != -1) {
                    value = tens.indexOf(textArray[word]);
                    place = 10;
                    word++;
                } else if (textArray[word] === ("a")) {
                    value = 1;
                    if (mag.indexOf(textArray[word]) != -1) {
                        place = Math.pow(10, mag.indexOf(textArray[word]));
                    } else {
                        place = 1;
                    }
                    word++;
                } else if (textArray[word] === ("minus") || textArray[word] === ("negative")) {
                    sign = -1;
                    word++;
                } else {
                    word++;
                }

                number += sign * value * place;
            }
        }

        return number;
    }

    var abbrev = function(targType) {
        var typeIDs = ["teaspoon", "tablespoon", "fluid ounce", "cup", "pint", "quart", "gallon", "milliliter", "liter", "ounce", "pound", "gram", "kilogram", "fahrenheit", "celsius"];
        var typeAbbrev = ["tspn", "tblspn", "fl oz", "c", "pnt", "qrt", "gal", "ml", "l", "oz", "lb", "g", "kg", "°F", "°C"]
        var id = typeIDs.indexOf(targType);
        return typeAbbrev[id];
    }

    var convert = function(srcVal, srcType, targType) {
        var volume = [1, 3, 6, 48, 96, 192, 768, 0.202884, 202.884]; //teaspooon, tblspoon, ounce, cup, pint, quart, gallon, milliliter, liter
        var weight = [1, 16, 0.035274, 35.274]; //ounce, pound, gram, kilogram
        var temp = [] //Fahrenheit, Celsius
        var typeIDs = ["teaspoon", "tablespoon", "fluid ounce", "cup", "pint", "quart", "gallon", "milliliter", "liter", "ounce", "pound", "gram", "kilogram", "fahrenheit", "celsius"];
        var srcUnit = 0; //volume, weight, temp
        var targUnit = 0;

        var targVal;

        srcID = typeIDs.indexOf(srcType);
        targID = typeIDs.indexOf(targType);

        if (targID > 8 && targID <= 12) {
            targID = targID - 9;
            targUnit = 1;
        } else if (targID <= 8)
            targUnit = 0;
        else if (targID > 12) {
            targID = targID - 13;
            targUnit = 2;
        }

        if (srcID > 8 && srcID <= 12) {
            srcID = srcID - 9;
            srcUnit = 1;
        } else if (srcID <= 8)
            srcUnit = 0;
        else if (srcID > 12) {
            srcID = srcID - 13;
            srcUnit = 2;
        }


        var srcSize = 0;

        if (srcUnit == 0) {
            srcSize = srcVal * volume[srcID];
            targSize = srcSize / volume[targID];
        }
        if (srcUnit == 1) {
            srcSize = srcVal * weight[srcID];
            targSize = srcSize / weight[targID];
        }
        if (srcUnit == 2) {
            console.log(srcID);
            console.log(targID);
            if (srcID == 0 && targID == 1) { //Fahrenheit to Celsius
                targSize = (srcVal - 32) * 5.0 / 9;
            } else if (srcID == 1 && targID == 0) { //Celsius to Fahrenheit
                targSize = srcVal * 1.8 + 32;
            } else {
                targSize = srcVal;
            }
        }
        if (Math.trunc(targSize) == (targSize).toFixed(2)) {
            return Math.trunc(targSize)
        } else {
            return (targSize).toFixed(2);
        }
    }
});

app.service('TimerService', function() {

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

    var padWithZeros = function(t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return "" + t;
        }
    }

    var refreshTimeFields = function() {
        timer.time.seconds = timer.time.totalSeconds % 60;
        timer.time.minutes = Math.floor(timer.time.totalSeconds / 60) % 60;
        timer.time.hours = Math.floor(timer.time.totalSeconds / 3600);
    }

    this.getTimer = function() {
        return timer;
    }

    this.prettyPrintTime = function() {
        var strHours = padWithZeros(timer.time.hours);
        var strMinutes = padWithZeros(timer.time.minutes);
        var strSeconds = padWithZeros(timer.time.seconds);
        return strHours + ":" + strMinutes + ":" + strSeconds;
    }

    this.setTotalSeconds = function() {
        timer.time.totalSeconds = timer.time.hours * 3600 + timer.time.minutes * 60 + timer.time.seconds
        return timer.time.totalSeconds;
    }

    this.decrementTime = function() {
        if (timer.time.totalSeconds == 1 || timer.time.totalSeconds == 0) {
            timer.time.seconds = 0;
            timer.time.totalSeconds = 0;
            return true;
        } else {
            timer.time.totalSeconds--;
            refreshTimeFields();
        }
    }

    this.parseTimerSentence = function(sentence) {

        sentence = sentence.toLowerCase();
        sentence = sentence.trim();
        if (sentence.length > 0 && sentence.includes(" ")) {
            var words = sentence.split(' ');
            var TargID;
        } else {
            var words = "ERROR";
        }

        timer.time.seconds = 0;
        timer.time.minutes = 0;
        timer.time.hours = 0;

        var timeUnits = ["second", "minute", "hour", "seconds", "minutes", "hours"];
        var numWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "0", "2", "3", "4", "5", "6", "7", "8", "9"];
        var begin = 0;
        var end = 0;
        var val = 0;

        var currentWord = 0;
        while (currentWord <= words.length && numWords.indexOf(words[currentWord]) == -1) {
            currentWord++;
        }
        while (currentWord < words.length) {
            begin = currentWord;
            while (currentWord <= words.length && timeUnits.indexOf(words[currentWord]) == -1) {
                currentWord++;
            }
            end = currentWord;
            numStr = words.slice(begin, end);
            var val = numParse(numStr);
            if (timeUnits.indexOf(words[currentWord]) % 3 == 0) {
                timer.time.seconds = val
            } else if (timeUnits.indexOf(words[currentWord]) % 3 == 1) {
                timer.time.minutes = val
            } else if (timeUnits.indexOf(words[currentWord]) % 3 == 2) {
                timer.time.hours = val
            }

            currentWord++;
            if (words[currentWord] == "and") {
                currentWord++;
            }
        }
    }

    function numParse(textArray) {
        var ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        var teens = ["null", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
        var tens = ["null", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        var mag = ["null", "null", "hundred"];
        var misc = ["a", "point", "minus", "negative", "and"];

        var word = 0;
        var number = 0;
        var value;
        var place;
        var sign = 1;


        if (textArray.length == 0 || (textArray.length == 1 && (textArray[0] === ("a") || textArray[0] === ("an")))) {
            number = 1;
        } else if (textArray.length == 1 && !isNaN(textArray[0])) {
            number = parseFloat(textArray[0]);
        } else if (textArray.indexOf("half") != -1) {
            number = 0.5
        } else if (textArray.indexOf("quarter") != -1) {
            number = 0.25
        } else if (textArray.indexOf("eighth") != -1) {
            number = 0.125
        } else {
            while (word < textArray.length) {
                value = 0;
                place = 0;
                if (ones.indexOf(textArray[word]) != -1) {
                    value = ones.indexOf(textArray[word]);
                    word++;
                    if (mag.indexOf(textArray[word]) != -1) {
                        place = Math.pow(10, mag.indexOf(textArray[word]));
                    } else {
                        place = 1;
                    }
                    word++;
                    if (word < textArray.length && textArray[word] === ("and")) {
                        word++;
                    }

                } else if (teens.indexOf(textArray[word]) != -1) {
                    value = teens.indexOf(textArray[word]) + 10;
                    word++;
                    if (mag.indexOf(textArray[word]) != -1) {
                        place = Math.pow(10, mag.indexOf(textArray[word]));
                    } else {
                        place = 1;
                    }
                    word++;
                } else if (tens.indexOf(textArray[word]) != -1) {
                    value = tens.indexOf(textArray[word]);
                    place = 10;
                    word++;
                } else if (textArray[word] === ("a")) {
                    value = 1;
                    if (mag.indexOf(textArray[word]) != -1) {
                        place = Math.pow(10, mag.indexOf(textArray[word]));
                    } else {
                        place = 1;
                    }
                    word++;
                } else if (textArray[word] === ("minus") || textArray[word] === ("negative")) {
                    sign = -1;
                    word++;
                } else {
                    word++;
                }

                number += sign * value * place;
            }
        }

        return number;
    }

    this.resetTimer = function() {
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

app.service('ListenerService', function($http) {

    var listener = {};
    listener.isActive = false;
    listener.showText = false;
    listener.results = "";
    listener.triggeredWatch = false;
    listener.token = {};
    listener.audioCtx = new AudioContext();
    listener.recording = false;
    listener.speechProcessing = false;
    listener.watsonSocket = {};
    listener.startMessage = {
        action: 'start',
        continuous: true,
        "content-type": 'audio/wav', //;rate=22050
        keywords: ["Watson", "Chef", "Dawg"],
        keywords_threshold: 0.5,
        smart_formatting: true
    };
    listener.stopMessage = {
        action: 'stop'
    };

    // get token from node server - happens on startup
    $http.get("/api/stt/gettoken").success(function(data) {
        // get token
        listener.token = data.token;
    });

    // Showing the GUI
    this.getListener = function() {
        return listener;
    }

    this.setActive = function() {
        listener.isActive = true;
    }

    this.setInactive = function() {
        listener.isActive = false;
    }

    this.showText = function() {
        listener.showText = true;
    }

    this.hideText = function() {
        listener.showText = false;
    }



    // send start message to watson
    var sendStart = function() {
        if (listener.watsonSocket != null && listener.watsonSocket.readyState == listener.watsonSocket.OPEN) {
            listener.watsonSocket.send(JSON.stringify(listener.startMessage));
        } else {
            console.log("Can't send start.. socket closed");
        }
    }

    // send stop message to watson
    var sendStop = function() {
        if (listener.watsonSocket != null && listener.watsonSocket.readyState == listener.watsonSocket.OPEN) {
            listener.watsonSocket.send(JSON.stringify(listener.stopMessage));
        } else {
            console.log("Can't send stop.. socket closed");
        }
    }

    // send chunk of data to watson
    var sendAudioToWatson = function(data) {
        if (listener.watsonSocket != null && listener.watsonSocket.readyState == listener.watsonSocket.OPEN) {
            if (data.size >= 100) {
                console.log("SENDNG AUDIO CHUNK");
                listener.watsonSocket.send(data);
            } else {
                console.log("Audio must be at least 100 bytes");
            }
        } else {
            console.log("Web Socket closed!");
        }
    }

    // record audio and stream to watson until stopped
    // var recordIntervalID;
    listener.recorder = {};
    var startStreamingAudio = function() {
        // access the microphone and start recording
        function successCallback(stream) {
            console.log("successfully captured microphone");
            var context = new AudioContext();
            var mediaStreamSource = context.createMediaStreamSource(stream);

            listener.recorder = new Recorder(mediaStreamSource);
            listener.recorder.record();
        }

        // could not access microphone
        function errorCallback(stream) {
            console.log("Error accessing microphone");
        }

        // connect to microphone
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
        navigator.getUserMedia({
            audio: true
        }, successCallback, errorCallback);
    }


    // put results in text box
    var setSpeechResults = function(text) {
        listener.results = text;
        listener.refreshScope();
        console.log("HERE IS WHAT I HEARD: " + text);
    }


    // connect to websocket
    var setupWebsocket = function() {
        // connect to websocket
        var STTSocketURL = "wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=" + listener.token + "&model=en-US_BroadbandModel";
        listener.watsonSocket = new WebSocket(STTSocketURL);

        // socket open - start recording and streaming audio data
        listener.watsonSocket.onopen = function(evt) {
            console.log("SOCKET OPEN");

            // send start message and begin recording/streaming
            sendStart();
            startStreamingAudio();
        };

        // socket close
        listener.watsonSocket.onclose = function(evt) {
            console.log("SOCKET CLOSED. Details below");
            console.log(evt);
        };

        // socket receives data
        listener.watsonSocket.onmessage = function(evt) {
            console.log("SOCKET MESSAGE: " + evt.data);
            var data = JSON.parse(evt.data);

            // check if receiving results or state update
            if (data.results) {
                listener.speechProcessing = false;
                if (data.results[0]) {
                    var text = data.results[0].alternatives[0].transcript;
                    console.log("Search text: " + text);
                    setSpeechResults(text);
                } else {
                    console.log("Did not hear any speech...");
                    setSpeechResults("");
                }
                listener.watsonSocket.close();
            } else {
                console.log("No results in data");
            }
        };

        // socket error
        listener.watsonSocket.onerror = function(evt) {
            console.log("SOCKET ERROR. Details below");
            console.log(evt);
        };
    };

    // handle click to start/stop recording
    this.speechTrigger = function(refreshCallback) {
        listener.refreshScope = refreshCallback;
        listener.triggeredWatch = false;

        if (listener.recording) {
            listener.recorder.exportWAV(function(blob) {
                listener.recorder.clear();
                sendAudioToWatson(blob);
            });
            listener.speechProcessing = true;
            // stop recording and send stop message
            setTimeout(function() {
                sendStop();
            }, 200);
        } else {
            //connect to socket (starts recording and streaming automatically once opened)
            setupWebsocket();
        }

        listener.recording = !listener.recording;
    };

});


app.service('SubstitutionService', function($http) {

    var substitutioner = {};
    substitutioner.sentence = "";
    substitutioner.isActive = false;
    substitutioner.result = "";

    $http.get('/api/substitutions').success(function(data) {
        substitutioner.substitutions = data;
        console.log("Got substitutions");
    });


    this.getSubstitutions = function(input) {
        // return "Try this";
        var substitution = "Sorry I can't find a substitution";
        for (term in substitutioner.substitutions) {
            if (input.includes(term)) {
                substitution = "You can substitute " + substitutioner.substitutions[term]['sub'] + " for " + substitutioner.substitutions[term]['amount'] + " of " + term;
            }
        }
        substitutioner.result = substitution;
        return substitutioner.result;
    }

    this.getSubstitutioner = function() {
        return substitutioner;
    }

    this.clearQuery = function() {
        substitutioner.sentence = "";
    }

});
