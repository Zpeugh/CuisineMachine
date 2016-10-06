app.controller("cuisineMachineController", function($scope, $location, RandRService, RecipeService, TextToSpeechService) {

    $scope.searchText = "";
    $scope.recipes = RecipeService.getRecipes();
    $scope.currentRecipe = RecipeService.getSelectedRecipe();
    $scope.recipeRows = RecipeService.getRecipeRows();
    $scope.cookingPopup = false;
    $scope.currentInstruction = "";
    $scope.currentInstructionStep = 0;

    // Utility functionss
    var scrollTo = function(selector, offset, time) {
        $('html,body').animate({
            scrollTop: $(selector).offset().top - offset
        }, time);
    }

    $("body").on("mousemove",function(event) {
        if (event.pageX < 10) {
            $('#side-menu').show();
        }
    });

    $("body").on("mousemove",function(event) {
        if (event.pageX > 250) {
            $('#side-menu').hide();
        }
    });

    $scope.onSubmit = function() {
        console.log("testData: " + $scope.testData);
        $scope.responseData = TextToSpeechService.speakText($scope.testData);
        console.log($scope.responseData);
    }

    $scope.search = function() {
        RecipeService.clearRecipes();
        RandRService.sendRequest($scope.searchText)
        .success(function(data){
            console.log("Found " + data.length + " documents")
            for (var i = 0; i < data.length; i++){
                RecipeService.addRecipe(data[i]);
            }
            $scope.recipes = RecipeService.getRecipes();
            $scope.recipeRows = RecipeService.getRecipeRows();
            $location.path("/discover");
        }).error(function(data){
            console.log("Error: " + data);
            $scope.documents = [];
        });
    }

    $scope.selectRecipe = function(recipe){
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

    var goToStep = function(stepNum){
        var inst = $('#instruction_' + stepNum);
        inst.addClass('current-instruction-box');
        $('#button-container_' + stepNum).show();
    }

    var endStep = function(stepNum){
        var inst = $('#instruction_' + stepNum);
        inst.removeClass('current-instruction-box');
        $('#button-container_' + stepNum).hide();
    }

    $scope.nextStep = function(){
        endStep($scope.currentInstructionStep);
        if ($scope.currentRecipe.instructions.length > $scope.currentInstructionStep + 1){
            $scope.currentInstructionStep++;
            goToStep($scope.currentInstructionStep);
            scrollTo('#instruction_' + $scope.currentInstructionStep, 0, 1200);

        }
    }

    $scope.lastStep = function(){
        endStep($scope.currentInstructionStep);
        if ($scope.currentInstructionStep > 0){
            $scope.currentInstructionStep--;
            goToStep($scope.currentInstructionStep);
            scrollTo('#instruction_' + $scope.currentInstructionStep, 0, 1200);
        }
    }

    $scope.startTimer = function(){
        //TODO: Create/show timer widget
    }

    $scope.readInstruction = function(){
        var text = $('#instruction_' + $scope.currentInstructionStep +' > li').html();
        TextToSpeechService.speak(text);
    }


    $scope.convert(sentence){
    	var volume = [1, 3, 6, 48, 96, 192, 768, 0.202884, 202.884]; //teaspooon, tblspoon, ounce, cup, pint, quart, gallon, milliliter, liter
    	var weight = [1, 16, 0.035274, 35.274]; //ounce, pound, gram, kilogram
    	var typeIDs = ["tspn","tblspn","floz","cup","pnt","qrt","gal","ml","l","oz","lb","g","kg"];
    	var srcUnit = 0;//volume, weight
    	var targUnit = 0;


    	var srcType = document.getElementById("sourceType").value;
    	var srcVal = document.getElementById("sourceValue").value;
    	var srcID = typeIDs.indexOf(srcType);
    	if(srcID > 8){
    		srcID = srcID - 9;
    		srcUnit = 1;}
    	else
    		srcUnit = 0;
    	var targType = document.getElementById("targetType").value;
    	var targID = typeIDs.indexOf(targType);
    	if(targID > 8){
    		targID = targID - 9;
    		targUnit = 1;}
    	else
    		targUnit = 0;
    	if(srcUnit != targUnit){
    		document.getElementById("answer").innerHTML = "Type Error";}
    	else{
    		if(srcUnit == 0){
    			srcSize = srcVal * volume[srcID];
    			targSize = srcSize/volume[targID];
    			console.log(srcID);
    			console.log(targID);
    		}
    		if(srcUnit == 1){
    			srcSize = srcVal * weight[srcID];
    			targSize = srcSize/weight[targID];
    		}

    	document.getElementById("answer").innerHTML = targSize + " " + targType;

    	}

    }



});
