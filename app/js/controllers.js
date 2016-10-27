app.controller("cuisineMachineController", function($scope, $location, $interval, $rootScope, RandRService,
                                                    ClassifyService, RecipeService, TextToSpeechService,
                                                    InstructionService, TimerService, ConversionService,
                                                    UnitConversionParser, ListenerService) {

    var init = function(){
        $scope.searchText = "";
        $scope.recipes = RecipeService.getRecipes();
        $scope.currentRecipe = RecipeService.getSelectedRecipe();
        $scope.recipeRows = RecipeService.getRecipeRows();
        $scope.instruction = InstructionService.getInstruction();
        $scope.timer = TimerService.getTimer();
        $scope.timer.displayTime = TimerService.prettyPrintTime();
        $scope.converter = ConversionService.getConverter();
        $scope.listener = ListenerService.getListener();
        $scope.filter = RecipeService.getFilter();
    }

    init();

    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        var nextPath = next.$$route.originalPath;
        $scope.listener = ListenerService.getListener();
        if (nextPath == "/discover"){
            ListenerService.setActive();
        } else if (nextPath == "/create"){
            ListenerService.setActive();
        } else if (nextPath == "/explore"){
            ListenerService.setInactive();
        } else {
            console.log("unknown path: " + nextPath);
            ListenerService.setInactive();
        }
    });

    // Utility functions
    var scrollTo = function(selector, offset, time) {
        $('html,body').animate({
            scrollTop: $(selector).offset().top - offset
        }, time);
    }

    // These two event listeners show and hide the side menu bar when the mouse is
    // far enough to the left of the screen
    $("body").on("mousemove", function(event) {
        if (event.pageX < 25) {
            $('#side-menu').show();
        }
    });

    $("body").on("mousemove", function(event) {
        if (event.pageX > 255) {
            $('#side-menu').hide();
        }
    });

    // Explore page's function to handle search being pressed
    $scope.onSubmit = function() {
        $scope.responseData = TextToSpeechService.speakText($scope.testData);
    }

    $scope.search = function(sentence) {
        $scope.currentRecipe = RecipeService.getSelectedRecipe();
        $scope.instruction = InstructionService.getInstruction();
        console.log("recipe on click");
        console.log($scope.currentRecipe);
        $scope.searchText = sentence;
        ClassifyService.classifyRequest(sentence).success(function(className){
            console.log("Classified as: " + className);
            if (className == "recipes"){
                RecipeService.clearRecipes();
                RandRService.sendRequest(sentence)
                    .success(function(data) {
                        console.log("Found " + data.length + " documents")
                        for (var i = 0; i < data.length; i++) {
                            RecipeService.addRecipe(data[i]);
                        }
                        $scope.recipes = RecipeService.getRecipes();
                        $scope.recipeRows = RecipeService.getRecipeRows();
                        $location.path("/discover");
                    }).error(function(data) {
                        console.log("Error: " + data);
                        $scope.documents = [];
                    });
            } else if(className == "timer"){
                $scope.openTimer();
            } else if(className == "nav_start"){
                $scope.startCooking();
            } else if(className == "nav_next"){
                $scope.nextStep();
            } else if(className == "nav_prev"){
                $scope.goBackAStep();
            } else if(className == "nav_end"){
                $scope.nextStep();
            }else if(className == "unit_conversion"){
                $scope.openUnitConverter();
                $scope.setUnitConversionSentence(sentence);
            }
        }).error(function(data){
            console.log("Error classifying: "+ data);
        });
        $scope.closeListenerTextBox();
    }

    $scope.selectRecipe = function(recipe) {
        RecipeService.setSelectedRecipe(recipe);
        $scope.currentRecipe = RecipeService.getSelectedRecipe();
        $location.path("/create");
        scrollTo("body", 50);
    }


    var goToStep = function(stepNum) {
        var inst = $('#instruction_' + stepNum);
        inst.addClass('current-instruction-box');
        $('#button-container_' + stepNum).show();
    }

    var endStep = function(stepNum) {
        var inst = $('#instruction_' + stepNum);
        inst.removeClass('current-instruction-box');
        $('#button-container_' + stepNum).hide();
    }

    $scope.startCooking = function() {
        console.log("Current instruction");
        console.log($scope.instruction);
        InstructionService.setCurrentInstructionStep(0);
        InstructionService.setCurrentInstruction($scope.currentRecipe.instructions[0]);
        scrollTo('#instruction_0', 200, 1200);
        goToStep(0);
    }

    $scope.nextStep = function() {
        endStep($scope.instruction.stepNumber);
        if ($scope.currentRecipe.instructions.length > $scope.instruction.stepNumber + 1) {
            InstructionService.incrementStep();
            InstructionService.setCurrentInstruction($scope.currentRecipe.instructions[$scope.instruction.stepNumber])
            goToStep($scope.instruction.stepNumber);
            scrollTo('#instruction_' + $scope.instruction.stepNumber, 0, 1200);
        }
    }

    $scope.goBackAStep = function() {
        endStep($scope.instruction.stepNumber);
        console.log("Current instruction");
        console.log($scope.instruction);
        if ($scope.instruction.stepNumber > 0) {
            InstructionService.decrementStep();
            InstructionService.setCurrentInstruction($scope.currentRecipe.instructions[$scope.instruction.stepNumber])
            console.log("Back an instruction");
            console.log($scope.instruction);
            goToStep($scope.instruction.stepNumber);
            scrollTo('#instruction_' + $scope.instruction.stepNumber, 0, 1200);
        }
    }

    $scope.readInstruction = function() {
        var text = $('#instruction_' + $scope.instruction.stepNumber + ' > li').html();
        TextToSpeechService.speak(text);
    }

    $scope.openTimer = function() {
        $scope.timer.show = true;
        $scope.timer.showTitlePage = true;
    }

    $scope.setTimerTitle = function(timerTitle) {
        $scope.timer.showTitlePage = false;
        $scope.timer.showTimePage = true;
    }

    $scope.closeTimer = function() {
        $scope.timer.show = false;
        $scope.timer.showTitlePage = false;
        $scope.timer.showTimePage = false;
    }

    $scope.startTimer = function() {
        $scope.closeTimer();
        $scope.timer.isActive = true;
        var totalSeconds = TimerService.setTotalSeconds();
        $interval(function(){
            $scope.timer.displayTime = TimerService.prettyPrintTime();
            TimerService.decrementTime();
            if($scope.timer.time.totalSeconds == 0){
                $scope.timerFinished();
            }
        }, 1000, totalSeconds);
    }

    $scope.timerFinished = function(){
        var title = $scope.timer.title;
        $scope.timer.isActive = false;
        TextToSpeechService.speak("The " + title + " timer is done.");
        $scope.timer = TimerService.resetTimer();
    }

    $scope.openUnitConverter = function(){
        ConversionService.showConverter();
    }

    $scope.setUnitConversionSentence = function(sentence){
        UnitConversionParser.parseSentence(sentence);
        var sourceValue = UnitConversionParser.getSourceValue();
        var sourceType = UnitConversionParser.getSourceType();
        var targetType = UnitConversionParser.getTargetType();
		
		var targetValue = convert(sourceValue, sourceType, targetType);
		var targetAbbrev = abbrev(targetType);
		
		
		
		console.log(targetValue + targetAbbrev);

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
			
		

	return targSize;}


    $scope.closeUnitConverter = function(){
        ConversionService.hideConverter();
        ConversionService.resetConverter();
    }

    $scope.setUnitConversionSentence = function(sentence){
        $scope.converter.sentence = sentence;
		$scope.converter.result = UnitConversionParser.parseSentenceConvertUnits(sentence);
    }

    $scope.openListenerTextBox = function(){
        ListenerService.showText();
    }

    $scope.closeListenerTextBox = function(){
        ListenerService.hideText();
    }

    $scope.openFilters = function(){
        $scope.filter.isActive = true;
    }
});
