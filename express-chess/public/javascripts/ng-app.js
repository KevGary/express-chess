var app = angular.module('app', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngAnimate'], function config($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('API_URL', 'http://localhost:3000');

app.controller('GlobalController', function ($scope) {
  $scope.message = 'yo';
});
app.controller('GameController', function ($scope) {
  $scope.message = 'yo';
});

app.controller('RegisterLoginController', function ($scope, $rootScope, $mdDialog, $mdMedia) {
  $rootScope.selectedIndex = 0;
  $scope.showRegister = function(ev) {
    $rootScope.selectedIndex = 0;
    $mdDialog.show({
      controller: DialogController,
      templateUrl:'partials/register-login-dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    })
  }
  $scope.showLogin = function(ev) {
    $rootScope.selectedIndex = 1;
    $mdDialog.show({
      controller: DialogController,
      templateUrl:'partials/register-login-dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    })
  }
});
function DialogController($rootScope, $scope, $mdDialog, $mdDialog) {
  $scope.selectedIndex = $rootScope.selectedIndex;
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}
app.controller('LoginRegisterModalController', function($scope, UserFactory) {
  $scope.login = function(user) {
    UserFactory.login(user).then(function success(response) {
      console.log(response);
      console.log('successful log in');
    }, handleError);
  }
  $scope.register = function(user) {
    UserFactory.register(user).then(function success(response) {
      console.log(response);
      console.log('successful registration');
    }, handleError);
  }
  function handleError(response) {
    alert('Error: ' + response.data);
  }
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

//JWT AUTH FACTORIES
app.factory('UserFactory', function UserFactory($http, $q, API_URL, AuthTokenFactory) {
  'use strict';
  return {
    register: register,
    login: login,
    logout: logout
    // getUser: getUser
  };

  function register(user){
    return $http.post(API_URL + '/register',
    {
      "user": user
    })
    .then(function success(response) {
      AuthTokenFactory.setToken(response.data.token);
      return response;
    });
  }

  function login(user){
    return $http.post(API_URL + '/login',
    {
      "user": user
    })
    .then(function success(response) {
      AuthTokenFactory.setToken(response.data.token);
      return response;
    });
  }
  

  function logout() {
    AuthTokenFactory.setToken();
    return null;
  }

  // function getUser() {
  //   if(AuthTokenFactory.getToken()) {
  //     return $http.get(API_URL2 + '/me')
  //   } else {
  //     return $q.reject({ data: 'client has no authorization '})
  //   }
  // }
})
app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
  'use strict';
  var store = $window.localStorage;
  var key = 'auth_token';
  return {
    getToken: getToken,
    setToken: setToken
  };

  function getToken() {
    return store.getItem(key);
  }

  function setToken(token){
    if (token) {
      store.setItem(key, token);
    } else {
      store.removeItem(key);
    }
  }
})
app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
  return {
    request: addToken
  };

  function addToken(config) {
    var token = AuthTokenFactory.getToken();
    if(token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }
})
//END JWT AUTH FACTORIES