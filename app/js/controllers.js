app.controller("cuisineMachineController", function($scope, $location, TextToSpeechService) {

    $scope.testData = "";
    $scope.responseData = "";
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
        console.log($scope.responseData)
    }

    $scope.search = function() {
        $location.path("/discover");
    }

    $scope.startCooking = function() {
        scrollTo('#first-step', 1500);
        setTimeout(function() {
            $('#cooking-popup').show();
            $('#first-step').hide();
        }, 1450);
    }

});
