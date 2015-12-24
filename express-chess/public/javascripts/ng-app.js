var app = angular.module('app', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngAnimate']);

app.constant('API_URL', 'http://localhost:3000');

app.controller('GlobalController', function ($scope) {
  $scope.message = 'yo';
});
app.controller('GameController', function ($scope) {
  $scope.message = 'yo';
});
app.controller('LandingController', function ($scope) {
  $scope.message = 'yo';
});
app.controller('NavbarController', function ($scope) {
  $scope.message = 'yo';
});


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