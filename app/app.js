var app = angular.module('cuisineMachineApp', ['ngRoute', 'ui.bootstrap']);

// Configure the routes
app.config( function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "index.html",
        controller: "cuisineMachineController"
    })
    .when("/home", {
        templateUrl: "partials/home.html",
        controller: "cuisineMachineController"
    })
    .when("/discover", {
        templateUrl: "partials/discover.html",
        controller: "cuisineMachineController"
    })
    .when("/create", {
        templateUrl: "partials/create.html",
        controller: "cuisineMachineController"
    });
});
