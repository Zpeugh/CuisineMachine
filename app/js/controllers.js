app.controller("cuisineMachineController", function($scope, $http, $rootScope, $location, $interval, $rootScope,
                                                    RandRService, ClassifyService, RecipeService, TextToSpeechService,
                                                    InstructionService, TimerService, ConversionService,
                                                    UnitConversionParser, ListenerService, SubstitutionService) {

    var init = function() {
        $scope.searchText = "";
        $scope.recipeService = RecipeService.getRecipeService();
        $scope.instruction = InstructionService.getInstruction();
        $scope.timer = TimerService.getTimer();
        $scope.timer.displayTime = TimerService.prettyPrintTime();
        $scope.converter = ConversionService.getConverter();
        $scope.listener = ListenerService.getListener();
        $scope.substitutioner = SubstitutionService.getSubstitutioner();
    }

    init();

    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        var nextPath = next.$$route.originalPath;
        if (nextPath == "/create") {
            ListenerService.setActive();
        } else {
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



    // SEARCHING


    // Explore page's function to handle search being pressed
    $scope.onSubmit = function() {
        $scope.responseData = TextToSpeechService.speakText($scope.testData);
    }

    $scope.search = function(sentence) {
        $scope.instruction = InstructionService.getInstruction();
        $scope.searchText = sentence;
        ClassifyService.classifyRequest(sentence).success(function(className) {
            console.log("Classified as: " + className);
            if (className == "recipes") {
                RecipeService.clearRecipes();
                RandRService.sendRequest(sentence)
                    .success(function(data) {
                        console.log("Found " + data.length + " documents")
                        for (var i = 0; i < data.length; i++) {
                            RecipeService.addRecipe(data[i]);
                        }
                        RecipeService.setRecipeRows()
                        $scope.recipeService = RecipeService.getRecipeService();
                        $location.path("/discover");
                    }).error(function(data) {
                        console.log("Error: " + data);
                        $scope.documents = [];
                    });
            } else if (className == "timer") {
                $scope.openTimer();
            } else if (className == "nav_start") {
                $scope.startCooking();
            } else if (className == "nav_next") {
                $scope.nextStep();
            } else if (className == "nav_prev") {
                $scope.goBackAStep();
            } else if (className == "close_window") {
                $scope.closeWindow();
            } else if (className == "read"){
                $scope.readInstruction();
            } else if (className == "unit_conversion") {
                $scope.openUnitConverter();
                $scope.setUnitConversionSentence(sentence);
            }
        }).error(function(data) {
            console.log("Error classifying: " + data);
        });
    }

    $scope.selectRecipe = function(recipe) {
        // $scope.recipeService.selectedRecipe = RecipeService.getSelectedRecipe();
        $location.path("/create");
        RecipeService.setSelectedRecipe(recipe);
        scrollTo("body", 50);
    }


    // RECIPE INTERACTION


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
        InstructionService.setCurrentInstructionStep(0);
        InstructionService.setCurrentInstruction($scope.recipeService.selectedRecipe.instructions[0]);
        scrollTo('#instruction_0', 200, 1200);
        goToStep(0);
    }

    $scope.nextStep = function() {
        endStep($scope.instruction.stepNumber);
        if ($scope.recipeService.selectedRecipe.instructions.length > $scope.instruction.stepNumber + 1) {
            InstructionService.incrementStep();
            InstructionService.setCurrentInstruction($scope.recipeService.selectedRecipe.instructions[$scope.instruction.stepNumber])
            goToStep($scope.instruction.stepNumber);
            scrollTo('#instruction_' + $scope.instruction.stepNumber, 0, 1200);
        }
    }

    $scope.goBackAStep = function() {
        endStep($scope.instruction.stepNumber);
        if ($scope.instruction.stepNumber > 0) {
            InstructionService.decrementStep();
            InstructionService.setCurrentInstruction($scope.recipeService.selectedRecipe.instructions[$scope.instruction.stepNumber])
            console.log("Back an instruction");
            goToStep($scope.instruction.stepNumber);
            scrollTo('#instruction_' + $scope.instruction.stepNumber, 0, 1200);
        }
    }

    $scope.readInstruction = function() {
        var text = $('#instruction_' + $scope.instruction.stepNumber + ' > li').html();
        TextToSpeechService.speak(text);
    }

    // TIMERS

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
        if (totalSeconds <= 0) {
            $scope.timerFinished();
        } else {
            $interval(function() {
                $scope.timer.displayTime = TimerService.prettyPrintTime();
                TimerService.decrementTime();
                if ($scope.timer.time.totalSeconds <= 0) {
                    $scope.timerFinished();
                }
            }, 1000, totalSeconds);
        }

    }

    $scope.timerFinished = function() {
        var title = $scope.timer.title;
        $scope.timer.isActive = false;
        TextToSpeechService.speak("The " + title + " timer is done.");
        $scope.timer = TimerService.resetTimer();
    }


    // CONVERSIONS


    $scope.openUnitConverter = function() {
        ConversionService.showConverter();
    }

    $scope.closeUnitConverter = function() {
        ConversionService.hideConverter();
        ConversionService.resetConverter();
    }

    $scope.setUnitConversionSentence = function(sentence) {
        $scope.converter.sentence = sentence;
        $scope.converter.result = UnitConversionParser.parseSentenceConvertUnits(sentence);
    }


    // FILTERS


    $scope.openFilters = function() {
        $scope.recipeService.filter.isActive = true;
    }

    $scope.closeFilter = function() {
        $scope.recipeService.filter.isActive = false;
    }

    $scope.addExlusionFilter = function(sentence) {
        $scope.recipeService.filter.exclude.sentence = sentence;
        RecipeService.excludeIngredients();
        RecipeService.clearExclusionFilter();
    }

    $scope.addInclusionFilter = function(sentence) {
        $scope.recipeService.filter.include.sentence = sentence;
        RecipeService.includeIngredients(sentence);
        RecipeService.clearInclusionFilter();
    }


    // SUBSTITUTIONS


    $scope.setsubstitutionSentence = function(sentence) {
        SubstitutionService.getSubstitutions(sentence);
    }

    $scope.openSubstitutions = function() {
        $scope.substitutioner.isActive = true;
        SubstitutionService.clearQuery();
    }

    $scope.closeSubstitutions = function() {
        $scope.substitutioner.isActive = false;
        SubstitutionService.clearQuery();
    }


    // SPEECH TO TEXT
    $scope.openListenerTextBox = function() {
        ListenerService.speechTrigger(function(){
            $scope.$apply();
            console.log("Applying callback to refresh");
        });
        ListenerService.showText();
        console.log("RESULTS: " + $scope.listener.results);
    }

    $scope.closeListenerTextBox = function() {
        ListenerService.speechTrigger(function(){
            $scope.$apply();
            console.log("Applying callback to refresh");
        });
        ListenerService.hideText();
    }

    $scope.listenBasedOnLocation = function() {
        var currentLocation = $location.path();
        console.log(currentLocation);
        if (currentLocation == "/explore") {
            console.log("Triggering speech");
            ListenerService.speechTrigger(function(){
                $scope.$apply();
                console.log("Applying callback to refresh");
            });
        } else if (currentLocation == "/create") {
            console.log($scope.listener);
            if ($scope.listener.showText) {
                console.log("Opening Listener");
                $scope.openListenerTextBox();
                $scope.$apply();
            } else {
                console.log("Closing Listener");
                $scope.closeListenerTextBox();
                $scope.$apply();
            }
        }
    }

    $(document).unbind('keyup').bind("keyup", function(e) {
        if (e.which == 192) {
            $scope.listenBasedOnLocation();
        } else if (e.which == 32 && $location.path() == "/create") {
            $scope.listenBasedOnLocation();
        }
    });

    //Eliminate the default behavior of scrolling on spacebar press
    window.onkeydown = function(e) {
        if (e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
            return false;
        }
    };

    $scope.triggerRecorder = function() {
        ListenerService.speechTrigger(function(){
            $scope.$apply();
            console.log("Applying callback to refresh");
        });
    }

    // Add watcher to result.listener text, and classify result once it changes
    $scope.$watch("listener.results", function(newValue, oldValue, scope) {
        console.log("Result changed from '" + oldValue + "' to '" + newValue + "'");
        if (!$scope.listener.triggeredWatch){
            if (newValue != '' && newValue != undefined && newValue != oldValue) {
                console.log("Classifying: " + newValue);
                $scope.listener.triggeredWatch = true;
                $scope.search(newValue);
            }
        }
    }, true);



    // Closing windows
    $scope.closeWindow = function(){
            // <div ng-if="converter.show" ng-include src="'partials/widgets/unit-converter/conversion.html'"></div>
            // <div ng-if="substitutioner.isActive" ng-include src="'partials/widgets/substitution/substitution.html'"></div>
            // <div ng-if="listener.isActive" ng-include src="'partials/widgets/listener/listener.html'"></div>
            // <div ng-if="listener.showText" ng-include src="'partials/widgets/listener/listener-text-box.html'"></div>
            // <div ng-if="recipeService.filter.isActive
        if($scope.converter.show){
            $scope.closeUnitConverter();
        }
        if($scope.substitutioner.isActive){
            $scope.closeSubstitutions();
        }
        if($scope.listener.isActive){
            $scope.closeListenerTextBox();
        }
        if($scope.recipeService.filter.isActive){
            $scope.closeFilter();
        }
        if($scope.timer.show){
            $scope.closeTimer();
        }
    }




});
