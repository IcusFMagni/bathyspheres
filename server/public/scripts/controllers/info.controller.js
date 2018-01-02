myApp.controller('InfoController',['UserService', 'ProjectService', function(UserService, ProjectService) {
  console.log('InfoController created');
  var self = this;
  self.userService = UserService;
  self.currentProject = ProjectService.currentProject;
  
}]);
