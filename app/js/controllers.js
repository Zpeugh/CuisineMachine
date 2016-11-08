app.controller("cuisineMachineController", function($scope, $location, $interval, $rootScope, RandRService,
                                                    ClassifyService, RecipeService, TextToSpeechService,
                                                    InstructionService, TimerService, ConversionService,
                                                    UnitConversionParser, ListenerService, SubstitutionService) {

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
        $scope.substitutioner = SubstitutionService.getSubstitutioner();
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
		if(totalSeconds == 0){
			$scope.timerFinished();
		}
		else{
			$interval(function(){
				$scope.timer.displayTime = TimerService.prettyPrintTime();
				TimerService.decrementTime();
				if($scope.timer.time.totalSeconds == 0){
					$scope.timerFinished();
				}
			}, 1000, totalSeconds);
		}
        
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

    $scope.closeFilter = function(){
        $scope.filter.isActive = false;
    }

    $scope.addExlusionFilter = function(sentence){
        RecipeService.excludeIngredients(sentence);
        $scope.recipeRows = RecipeService.getRecipeRows();
    }

    $scope.addInclusionFilter = function(sentence){
        RecipeService.includeIngredients(sentence);
        $scope.recipeRows = RecipeService.getRecipeRows();
    }

    $scope.setsubstitutionSentence = function(sentence){
        SubstitutionService.getSubstitutions(sentence);
    }

    $scope.openSubstitutions = function(){
        $scope.substitutioner.isActive = true;
        console.log("opening");
    }

    $scope.closeSubstitutions = function(){
        $scope.substitutioner.isActive = false;
    }

});
