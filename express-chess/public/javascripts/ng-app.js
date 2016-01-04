var app = angular.module('app', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngAnimate'], function config($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
//----APP CONSTANTS----
app.constant('API_URL', 'http://localhost:3001');


//----CONTROLLERS-----
app.controller('GlobalController', function ($scope, $rootScope, $q, UserFactory, $location) {
  UserFactory.getUser().then(function success (response) {
    console.log(response);
    $rootScope.user = response.data;
    if ($rootScope.user) {
      $location.url('/game');
      $location.path('/game');
    }
  });
});

app.controller('LandingController', function ($scope) {

});

app.controller('NavbarController', function ($scope, $rootScope, $mdDialog, $mdMedia, UserFactory, $location) {
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
  $scope.logout = function() {
    UserFactory.logout();
    $location.url('/');
    $location.path('/');
  }
});
function DialogController($rootScope, $scope, $mdDialog) {
  //----md actions-----
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

app.controller('LoginRegisterModalController', function ($scope, UserFactory, $location, $mdDialog, $q) {
  //----ng-clicks----
  $scope.login = function(user) {
    UserFactory.login(user).then(function success(response) {
      return UserFactory.getUser()
    }, handleError).then(function success (response) {
      $scope.user = response.data;
      $mdDialog.hide();
      $location.url('/game');
      $location.path('/game');
    })
  }
  $scope.register = function(user) {
    UserFactory.register(user).then(function success(response) {
      return UserFactory.getUser()
    }, handleError).then(function success (response) {
      console.log(response)
      $scope.user = response.data;
      $mdDialog.hide();
      $location.url('/game');
      $location.path('/game');
    })
  }
  function handleError(response) {
    alert('Error: ' + response.data);
    $location.url('/page-not-found');
    $location.path('/page-not-found');
  }
});

app.controller('GameController', function ($scope, UserFactory, $q) {
  
});
