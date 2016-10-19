app.controller("cuisineMachineController", function($scope, $location, $interval, $rootScope, RandRService, ClassifyService, RecipeService, TextToSpeechService, TimerService, ConversionService, UnitConversionParser, ListenerService) {

    $scope.searchText = "";
    $scope.recipes = RecipeService.getRecipes();
    $scope.currentRecipe = RecipeService.getSelectedRecipe();
    $scope.recipeRows = RecipeService.getRecipeRows();
    $scope.currentInstruction = "";
    $scope.currentInstructionStep = 0;
    $scope.timer = TimerService.getTimer();
    $scope.timer.displayTime = TimerService.prettyPrintTime();
    $scope.converter = ConversionService.getConverter();
    $scope.listener = ListenerService.getListener();

    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        var nextPath = next.$$route.originalPath;
        if (nextPath == "/discover"){
            ListenerService.setActive();
            $scope.listener = ListenerService.getListener();

        } else if (nextPath == "/create"){
            ListenerService.setActive();
            $scope.listener = ListenerService.getListener();

        } else if (nextPath == "/explore"){
            ListenerService.setInactive();
            $scope.listener = ListenerService.getListener();

        } else {
            console.log("unknown path: " + nextPath);
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
            console.log($scope.converter.show);
        }
    });

    $("body").on("mousemove", function(event) {
        if (event.pageX > 255) {
            $('#side-menu').hide();
        }
    });

    // Explore page's function to handle search being pressed
    $scope.onSubmit = function() {
        console.log("testData: " + $scope.testData);
        $scope.responseData = TextToSpeechService.speakText($scope.testData);
        console.log($scope.responseData);
    }



    $scope.search = function(sentence) {
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
                console.log("opening converter");
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
        console.log($scope.currentRecipe);
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
        $scope.currentInstructionStep = z0;
        $scope.currentInstruction = $scope.currentRecipe.instructions[$scope.instructionStep];
        scrollTo('#instruction_0', 200, 1200);
        goToStep(0);
    }

    $scope.nextStep = function() {
        endStep($scope.currentInstructionStep);
        if ($scope.currentRecipe.instructions.length > $scope.currentInstructionStep + 1) {
            $scope.currentInstructionStep++;
            goToStep($scope.currentInstructionStep);
            scrollTo('#instruction_' + $scope.currentInstructionStep, 0, 1200);
        }
    }

    $scope.goBackAStep = function() {
        endStep($scope.currentInstructionStep);
        if ($scope.currentInstructionStep > 0) {
            $scope.currentInstructionStep--;
            goToStep($scope.currentInstructionStep);
            scrollTo('#instruction_' + $scope.currentInstructionStep, 0, 1200);
        }
    }

    $scope.readInstruction = function() {
        var text = $('#instruction_' + $scope.currentInstructionStep + ' > li').html();
        TextToSpeechService.speak(text);
    }


    $scope.openTimer = function() {
        $scope.timer.show = true;
        $scope.timer.showTitlePage = true;
        console.log("opening");
    }

    $scope.setTimerTitle = function(timerTitle) {
        $scope.timer.showTitlePage = false;
        $scope.timer.showTimePage = true;
        console.log("Timer Title: " + timerTitle);
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
        console.log($scope.timer.displayTime);
        $interval(function(){
            $scope.timer.displayTime = TimerService.prettyPrintTime();
            TimerService.decrementTime();
            console.log($scope.timer.time.totalSeconds);
            if($scope.timer.time.totalSeconds == 0){
                $scope.timerFinished();
            }
        }, 1000, totalSeconds);
    }

    $scope.timerFinished = function(){
        var title = $scope.timer.title;
        $scope.timer.isActive = false;
        TextToSpeechService.speak("The " + title + "timer is done.");
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


});
