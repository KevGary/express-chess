var app = angular.module('app');

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $mdThemingProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/partials/landing.html',
      controller: 'LandingController'
    })
    // .when('/register', {
    //   templateUrl: '/partials/register.html',
    //   controller: 'RegisterController'
    // }) 
    // .when('/login', {
    //   templateUrl: '/partials/login.html',
    //   controller: 'LoginController'
    // }) 
    // .when('/lobby', {
    //   templateUrl: '/partials/lobby.html',
    //   controller: 'LobbyController'
    // })
    .when('/game', {
      templateUrl: '/partials/game.html',
      controller: 'GameController'
    })
    // .when('/history', {
    //   templateUrl: '/partials/history.html',
    //   controller: 'HistoryController'
    // })      
    .when('/page-not-found', {
      templateUrl: '/partials/error.html'
    })
    .otherwise({
      redirectTo: '/page-not-found'
    });
  $locationProvider.html5Mode(true);
}]);