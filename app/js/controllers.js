app.controller("cuisineMachineController", function($scope, $location, RandRService, RecipeService) {

    $scope.searchText = "";
    $scope.recipes = RecipeService.getRecipes();
    // $scope.testData = "";
    // $scope.responseData = "";
    $scope.cookingPopup = false;
    // Utility functions
    var scrollTo = function(selector, time) {
        $('html,body').animate({
            scrollTop: $(selector).offset().top + 100
        }, time);
    }

    $scope.onSubmit = function() {
        console.log("testData: " + $scope.testData);
        $scope.responseData = TextToSpeechService.speakText($scope.testData);
        console.log($scope.responseData);
    }

    $scope.search = function() {
        RandRService.sendRequest($scope.searchText)
        .success(function(data){
            RecipeService.addRecipe(data[0]);
            $scope.recipes = RecipeService.getRecipes();
            $location.path("/discover");

        }).error(function(data){
            console.log("Error: " + data);
            $scope.documents = [];
        });
    }

    $scope.startCooking = function() {
        scrollTo('#first-step', 1500);
        setTimeout(function() {
            $('#cooking-popup').show();
            $('#first-step').hide();
        }, 1450);
    }

});
