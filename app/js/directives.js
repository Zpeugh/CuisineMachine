app.directive('timerWidget', function() {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'
        },
        templateUrl: 'partials/timer.html',
        controller: cuisineMachineController, //Embed a custom controller in the directive
        link: function($scope, element, attrs) {
            
        } //DOM manipulation
    }
});
