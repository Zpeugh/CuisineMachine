app.controller("cuisineMachineController", function($scope, $location, TextToSpeechService){

    $scope.testData = "";
    $scope.responseData = "";

    $scope.onSubmit = function(){
        console.log("testData: " + $scope.testData);
        $scope.responseData = TextToSpeechService.speakText($scope.testData);
        console.log($scope.responseData)
    }

    $scope.search = function(){
        $location.path("/discover");
    }

});
