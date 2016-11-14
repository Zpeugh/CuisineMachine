app.controller("cuisineMachineController", function($scope, $http, $location, $interval, $rootScope, RandRService,
                                                    ClassifyService, RecipeService, TextToSpeechService,
                                                    InstructionService, TimerService, ConversionService,
                                                    UnitConversionParser, ListenerService, SubstitutionService) {

    var init = function(){
        $scope.searchText = "";
        $scope.recipeService = RecipeService.getRecipeService();
        // $scope.recipeService.currentRecipe = RecipeService.getSelectedRecipe();
        // $scope.recipeService.recipeRows = RecipeService.getRecipeRows();
        // $scope.recipeService.filter = RecipeService.getFilter();
        $scope.instruction = InstructionService.getInstruction();
        $scope.timer = TimerService.getTimer();
        $scope.timer.displayTime = TimerService.prettyPrintTime();
        $scope.converter = ConversionService.getConverter();
        $scope.listener = ListenerService.getListener();
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

    
    
    // SEARCHING
    
    
    // Explore page's function to handle search being pressed
    $scope.onSubmit = function() {
        $scope.responseData = TextToSpeechService.speakText($scope.testData);
    }

    $scope.search = function(sentence) {
        // $scope.recipeService.currentRecipe = RecipeService.getSelectedRecipe();
        $scope.instruction = InstructionService.getInstruction();
        console.log("recipe on click");
        console.log($scope.recipeService.currentRecipe);
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
                        RecipeService.setRecipeRows()
                        $scope.recipeService = RecipeService.getRecipeService();
                        console.log("Recipe rows:" );
                        console.log($scope.recipeService.recipeRows);
                        // $scope.recipeService.recipeRows = RecipeService.getRecipeRows();
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
        // $scope.recipeService.currentRecipe = RecipeService.getSelectedRecipe();
        $location.path("/create");
        RecipeService.setSelectedRecipe(recipe);
        scrollTo("body", 50);
        console.log($scope.recipeService)
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
        console.log("Current instruction");
        console.log($scope.instruction);
        InstructionService.setCurrentInstructionStep(0);
        InstructionService.setCurrentInstruction($scope.recipeService.currentRecipe.instructions[0]);
        scrollTo('#instruction_0', 200, 1200);
        goToStep(0);
    }

    $scope.nextStep = function() {
        endStep($scope.instruction.stepNumber);
        if ($scope.recipeService.currentRecipe.instructions.length > $scope.instruction.stepNumber + 1) {
            InstructionService.incrementStep();
            InstructionService.setCurrentInstruction($scope.recipeService.currentRecipe.instructions[$scope.instruction.stepNumber])
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
            InstructionService.setCurrentInstruction($scope.recipeService.currentRecipe.instructions[$scope.instruction.stepNumber])
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
		if(totalSeconds <= 0){
			$scope.timerFinished();
		}
		else{
			$interval(function(){
				$scope.timer.displayTime = TimerService.prettyPrintTime();
				TimerService.decrementTime();
				if($scope.timer.time.totalSeconds <= 0){
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
    
    
    // CONVERSIONS

    
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

    
    // FILTERS
    
    
    $scope.openFilters = function(){
        $scope.recipeService.filter.isActive = true;
    }

    $scope.closeFilter = function(){
        $scope.recipeService.filter.isActive = false;
    }

    $scope.addExlusionFilter = function(sentence){
        console.log("excluding recipes containing: "+ sentence);
        $scope.recipeService.filter.exclude.sentence = sentence;
        RecipeService.excludeIngredients();
        RecipeService.clearInclusionFilter();
        console.log("Recipe rows:");
        console.log($scope.recipeService.recipeRows);
        // $scope.recipeService.recipeRows = RecipeService.getRecipeRows();
    }

    $scope.addInclusionFilter = function(sentence){
        $scope.recipeService.filter.include.sentence = sentence;
        RecipeService.includeIngredients(sentence);
        RecipeService.clearExclusionFilter();
        // $scope.recipeService.recipeRows = RecipeService.getRecipeRows();
    }
    
    
    // SUBSTITUTIONS
    

    $scope.setsubstitutionSentence = function(sentence){
        SubstitutionService.getSubstitutions(sentence);
    }

    $scope.openSubstitutions = function(){
        $scope.substitutioner.isActive = true;
        console.log("opening");
    }

    $scope.closeSubstitutions = function(){
        $scope.substitutioner.isActive = false;
        SubstitutionService.clearQuery();
    }

    
    
    
    
    
    
    // ------------- SPEECH TO TEXT ----------- 
    // TODO: 
    // Move to separate file    
    
    
    var token;
    var speechON = false;
    var audio_encoding = 'audio/wav';
    var watsonSocket;
    var startMessage = {
        action: 'start',
        continuous: true,
        "content-type": audio_encoding, //rate=22050
        keywords: ["Watson", "Chef", "Dawg"],
        keywords_threshold: 0.5,
        smart_formatting: true
    };
    var stopMessage = {
        action: 'stop'
    };
    
   
    // get token from node server - happens on startup
    $http.get( "/api/stt/gettoken").success(function(data) {
        // get token
        token = data.token;
    });

     // send start message to watson
    var sendStart = function() {
        if (watsonSocket != null && watsonSocket.readyState == watsonSocket.OPEN) {
            watsonSocket.send(JSON.stringify(startMessage));
        } else {
            console.log("Can't send start.. socket closed")
        }
    }

    // send stop message to watson
    var sendStop = function() {
        if (watsonSocket != null && watsonSocket.readyState == watsonSocket.OPEN) {
            watsonSocket.send(JSON.stringify(stopMessage));
        } else {
            console.log("Can't send stop.. socket closed")
        }
    }

    // send chunk of data to watson
    var sendAudioToWatson = function(data) {
        if (watsonSocket != null && watsonSocket.readyState == watsonSocket.OPEN) {
            if (data.size >= 100) {
                console.log("SENDNG AUDIO CHUNK");
                watsonSocket.send(data);
            } else {
                console.log("AUdio must be at least 100 bytes");
            }
        } else {
            console.log("Web Socket closed!");
        }
    }

    // record audio and stream to watson until stopped
    var recordIntervalID;
    var recorder;
    var startStreamingAudio = function() {
        // access the microphone and start recording
        function successCallback(stream) {
            var context = new AudioContext();
            var mediaStreamSource = context.createMediaStreamSource(stream);
            recorder = new Recorder(mediaStreamSource);
            recorder.record();
        }

        // could not access microphone
        function errorCallback(stream) {
            console.log("Error accessing microphone");
        }

        // connect to microphone
        navigator.getUserMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia;
        navigator.getUserMedia({audio:true}, successCallback, errorCallback);
    }
    
    
    // put results in text box
    var setSpeechResults = function(text) {
        $scope.searchText = text;
        $scope.$apply();
    }

                  
    // connect to websocket
    var setupWebsocket = function() {
        // connect to websocket 
        var STTSocketURL = "wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=" + token + "&model=en-US_BroadbandModel";
        watsonSocket = new WebSocket(STTSocketURL);
        
        // socket open - start recording and streaming audio data
        watsonSocket.onopen = function(evt) { 
            console.log("SOCKET OPEN");
            
            // send start message and begin recording/streaming
            sendStart();
            startStreamingAudio();
        };

        // socket close
        watsonSocket.onclose = function(evt) { 
            console.log("SOCKET CLOSED. Details below");
            console.log(evt);
        };
        
        // socket receives data
        watsonSocket.onmessage = function(evt) { 
            console.log("SOCKET MESSAGE: " + evt.data);
            var data = JSON.parse(evt.data);
            
            // check if receiving results or state update
            if (data.results) {
                if (data.results[0]) {
                    var text = data.results[0].alternatives[0].transcript;
                    console.log("Search text: " + text);
                    setSpeechResults(text);
                } else {
                    console.log("Did not hear any speech...");
                }
                
                console.log("close socket!!");
                watsonSocket.close();
            } else {
                console.log("Don't close socket!!")
            }
        };
        
        // socket error
        watsonSocket.onerror = function(evt) { 
            console.log("SOCKET ERROR. Details below");
            console.log(evt);
        };
    };
    

    // handle click to start/stop recording
    $scope.speechTrigger = function() {
        if (speechON) {
            recorder.exportWAV(function(blob) {
                recorder.clear();
                sendAudioToWatson(blob);
            });
            // stop recording and send stop message
            setTimeout(function() {
                sendStop();
            }, 100);
        } else {
            //connect to socket (starts recording and streaming automatically once opened)
            setupWebsocket();
        }
        
        speechON = !speechON
    };
});
