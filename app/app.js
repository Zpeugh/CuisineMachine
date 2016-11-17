var app = angular.module('cuisineMachineApp', ['ngRoute', 'ui.bootstrap']);

// Configure the routes
app.config( function($routeProvider) {
    $routeProvider
    .when("/explore", {
        templateUrl: "partials/explore.html",
        controller: "cuisineMachineController"
    })
    .when("/discover", {
        templateUrl: "partials/discover.html",
        controller: "cuisineMachineController"
    })
    .when("/create", {
        templateUrl: "partials/create.html",
        controller: "cuisineMachineController"
    })
    .otherwise({
        templateUrl: "partials/explore.html",
        controller: "cuisineMachineController",
        redirectTo: "/explore"
    })
});
