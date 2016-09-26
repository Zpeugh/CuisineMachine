app.controller("cuisineMachineController", function($scope, $location, RandRService, RecipeService) {

    $scope.searchText = "";
    $scope.recipes = RecipeService.getRecipes();
    $scope.currentRecipe = RecipeService.getSelectedRecipe();
    $scope.cookingPopup = false;
    
    // Utility functionss
    var scrollTo = function(selector, time) {
        $('html,body').animate({
            scrollTop: $(selector).offset().top
        }, time);
    }

    $scope.number = 0;
    $scope.add = function(x, y) {
        $scope.number = x + y;
    };

    $scope.onSubmit = function() {
        console.log("testData: " + $scope.testData);
        $scope.responseData = TextToSpeechService.speakText($scope.testData);
        console.log($scope.responseData);
    }

    $scope.search = function() {
        RecipeService.clearRecipes();
        RandRService.sendRequest($scope.searchText)
        .success(function(data){
            console.log("Found " + data.length + "documents")
            for (var i = 0; i < data.length; i++){
                RecipeService.addRecipe(data[i]);
            }
            $scope.recipes = RecipeService.getRecipes();
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
        scrollTo('#first-step', 1500);
        setTimeout(function() {
            $('#cooking-popup').show();
            $('#first-step').hide();
        }, 1450);
    }

});
