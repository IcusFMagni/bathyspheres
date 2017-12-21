myApp.controller('UserController',['UserService', 'ProjectService', function(UserService, ProjectService) {
  console.log('UserController created');
  var vm = this;
  vm.newProject = ProjectService.newProject;

  vm.createProject = 
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

}]);
