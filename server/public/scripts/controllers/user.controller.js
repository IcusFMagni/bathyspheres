myApp.controller('UserController',['UserService', 'ProjectService', function(UserService, ProjectService) {
  console.log('UserController created');
  var self = this;
  self.newProject = ProjectService.newProject;
  self.projects = ProjectService.projects;

  self.createProject = ProjectService.createProject
  self.userService = UserService;
  self.userObject = UserService.userObject;

  ProjectService.getProjects()

}]);
