var app = angular.module("cuisineMachineApp", ["ngRoute"]);

// Configure the routes
app.config( function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "index.html",
        controller: "cuisineMachineController"
    });
    // .when("/something", {
    //     templateUrl : "partials/something.html",
    // });

});
