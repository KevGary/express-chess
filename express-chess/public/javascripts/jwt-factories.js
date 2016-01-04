var app = angular.module('app');
//JWT AUTH FACTORIES
app.factory('UserFactory', function UserFactory($http, $q, API_URL, AuthTokenFactory) {
  'use strict';
  return {
    register: register,
    login: login,
    logout: logout,
    getUser: getUser
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

  function getUser() {
    if(AuthTokenFactory.getToken()) {
      return $http.get(API_URL + '/me')
    } else {
      return $q.reject({ data: 'client has no authorization '})
    }
  }
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