myApp.controller('LoginController', function($http, $location, UserService) {
    var vm = this;
    vm.user = {
      username: '',
      password: ''
    };
    vm.message = '';
    
    vm.facebookLogin = function () {
      console.log('in facebookLogin')
      $http ({
        method: 'GET',
        url: '/user/facebook'
      }).then(function(response){
        console.log('facebook', response)
      })
    }

    vm.login = function() {
      if(vm.user.username === '' || vm.user.password === '') {
        vm.message = "Enter your username and password!";
      } else {
        $http.post('/', vm.user).then(function(response) {
          if(response.data.username) {
            // location works with SPA (ng-route)
            $location.path('/user'); // http://localhost:5000/#/user
          } else {
            vm.message = "Nope";
          }
        }).catch(function(response){
          vm.message = "Nope";
        });
      }
    };

    vm.registerUser = function() {
      if(vm.user.username === '' || vm.user.password === '') {
        vm.message = "Choose a username and password!";
      } else {
        $http.post('/register', vm.user).then(function(response) {
          $location.path('/home');
        }).catch(function(response) {
          console.log('LoginController -- registerUser -- error');
          vm.message = "Please try again."
        });
      }
    }
});
