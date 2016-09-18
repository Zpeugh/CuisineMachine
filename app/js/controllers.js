app.controller("cuisineMachineController", function($scope, $location, RandRService) {

    $scope.searchText = "";
    $scope.documents = [{title: ['nothing']}];
    $scope.titles = "";
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
            console.log(data[0].title[0]);
            console.log(data);
            $scope.titles = data[0].title[0];
        }).error(function(data){
            console.log("Error: " + data);
            $scope.documents = [];
        });
        console.log("document title: " + $scope.documents);
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
