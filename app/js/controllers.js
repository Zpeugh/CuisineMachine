app.controller("cuisineMachineController", function($scope, $location, $http, $interval, RandRService, RecipeService, TextToSpeechService, TimerService, UnitConversionParser) {

    $scope.searchText = "";
    $scope.recipes = RecipeService.getRecipes();
    $scope.currentRecipe = RecipeService.getSelectedRecipe();
    $scope.recipeRows = RecipeService.getRecipeRows();
    $scope.cookingPopup = false;
    $scope.currentInstruction = "";
    $scope.currentInstructionStep = 0;
    $scope.timer = TimerService.getTimer();
    $scope.timer.displayTime = TimerService.prettyPrintTime();
    $scope.converter = {};
    $scope.converter.show  = false;

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
        console.log("testData: " + $scope.testData);
        $scope.responseData = TextToSpeechService.speakText($scope.testData);
        console.log($scope.responseData);
    }

    $scope.search = function() {
        RecipeService.clearRecipes();
        RandRService.sendRequest($scope.searchText)
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
    }

    $scope.selectRecipe = function(recipe) {
        RecipeService.setSelectedRecipe(recipe);
        $scope.currentRecipe = RecipeService.getSelectedRecipe();
        console.log($scope.currentRecipe);
        $location.path("/create");
        scrollTo("body", 50);
    }

    $scope.startCooking = function() {

        $scope.currentInstructionStep = 0;
        $scope.currentInstruction = $scope.currentRecipe.instructions[$scope.instructionStep];

        scrollTo('#instruction_0', 200, 1200);

        goToStep(0);

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

    $scope.nextStep = function() {
        endStep($scope.currentInstructionStep);
        if ($scope.currentRecipe.instructions.length > $scope.currentInstructionStep + 1) {
            $scope.currentInstructionStep++;
            goToStep($scope.currentInstructionStep);
            scrollTo('#instruction_' + $scope.currentInstructionStep, 0, 1200);

        }
    }

    $scope.lastStep = function() {
        endStep($scope.currentInstructionStep);
        if ($scope.currentInstructionStep > 0) {
            $scope.currentInstructionStep--;
            goToStep($scope.currentInstructionStep);
            scrollTo('#instruction_' + $scope.currentInstructionStep, 0, 1200);
        }
    }

    $scope.startTimer = function() {
        //TODO: Create/show timer widget
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
        TextToSpeechService.speak("The " + title + " is done.");
        $scope.timer = TimerService.resetTimer();
    }

    $scope.openUnitConverter = function(){
        $scope.converter.show  = true;
    }

    $scope.setUnitConversionSentence = function(sentence){
        UnitConversionParser.parseSentence(sentence);
        var sourceValue = UnitConversionParser.getSourceValue();
        var sourceType = UnitConversionParser.getSourceType();
        var targetType = UnitConversionParser.getTargetType();

        console.log(sourceValue);
        console.log(sourceType);
        console.log(targetType);

    }
    var convert = function(sentence) {
        var volume = [1, 3, 6, 48, 96, 192, 768, 0.202884, 202.884]; //teaspooon, tblspoon, ounce, cup, pint, quart, gallon, milliliter, liter
        var weight = [1, 16, 0.035274, 35.274]; //ounce, pound, gram, kilogram
        var typeIDs = ["tspn", "tblspn", "floz", "cup", "pnt", "qrt", "gal", "ml", "l", "oz", "lb", "g", "kg"];
        var srcUnit = 0; //volume, weight
        var targUnit = 0;

        UnitConversionParser.parseSentence(sentence);

        var srcType = UnitConversionParser.getSourceType();
        var srcVal = UnitConversionParser.getSourceValue();
        var srcID = typeIDs.indexOf(srcType);

        var targType = UnitConversionParser.getTargetType();
        var targVal;

        if (srcUnit == 0) {
            srcSize = srcVal * volume[srcID];
            targSize = srcSize / volume[targID];
            console.log(srcID);
            console.log(targID);
        }
        if (srcUnit == 1) {
            srcSize = srcVal * weight[srcID];
            targSize = srcSize / weight[targID];
        }

        return "5 Grams"


    }

    
    // ------------- SPEECH TO TEXT ----------- 
    // TODO: 
    // Move to separate file

    
    var audio_encoding = 'audio/ogg; codecs=opus';
    
    // get token and connect to web socket
    $http.get( "/api/stt/gettoken").success(function(data) {
        // get token
        token = data.token;
        
        // connect to websocket 
        var STTSocketURL = "wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=" + token + "&model=en-US_BroadbandModel&continuous=true";
        var ws = new WebSocket(STTSocketURL);

        // open watson connection
        ws.onopen = function(evt) { 
            console.log("START");
            var message = {
                action: 'start',
                interim_results: true,
                "content-type": audio_encoding, //rate=22050
                keywords: ["Watson", "Chef", "Dawg"],
                keywords_threshold: 0.5,
                smart_formatting: true
            };
            ws.send(JSON.stringify(message));
            
            
            // send chunks of audio binary data over socket
            var sendAudioToWatson = function(data) {
                if (ws) {
                    console.log("SENDNG DATA");
                    ws.send(data);  
                }
            }
            
            
            // access the microphone and start recording
            navigator.getUserMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia;

            if (navigator.getUserMedia) {
                console.log('getUserMedia supported.');
                navigator.getUserMedia (
                    { audio: true },

                    // if microphone available listen to it
                    function(stream) {
                        console.log("RECORDING");
                        var opts = {
                            mimeType: 'audio/webm;codecs=opus'
                        };
                        var mediaRecorder = new MediaRecorder(stream, opts);
                        mediaRecorder.start();

                        // store data in chunks
                        var chunks = [];
                        mediaRecorder.ondataavailable = function(e) {
                            chunks.push(e.data);
                                                        
                            // send data to server every 100? bytes
                            if (chunks.length >= 256) {
                                var blob = new Blob(chunks, { 'type' : audio_encoding });
                                sendAudioToWatson(blob);
                                chunks = [];   
                                
                                // eventually remove this and figures out why intermediate results aren't coming
                                mediaRecorder.stop(true);
                                var message = {
                                    action: 'stop'
                                };
                                ws.send(JSON.stringify(message));
                            }
                        };
                    },

                    // Error callback
                    function(err) {
                        console.log('Error recording audio: ' + err);
                    }
                );
            } else {
                console.log('getUserMedia not supported on your browser!');
            }
        };
        
        // close watson connection
        ws.onclose = function(evt) {  
            console.log("STOP. details below");
            console.log(evt);
        };
        
        // handle incoming data
        ws.onmessage = function(evt) { 
            console.log("MESSAGE: " + evt.data);
        };
        
        // handle errors
        ws.onerror = function(evt) { 
            console.log("ERROR. details below");
            console.log(evt);
        };
    });   
});


