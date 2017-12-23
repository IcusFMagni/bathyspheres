myApp.controller('UserController',['UserService', 'ProjectService', function(UserService, ProjectService) {
  console.log('UserController created');
  var self = this;
  self.newProject = ProjectService.newProject;
  self.projects = ProjectService.projects;

  self.createProject = ProjectService.createProject
  self.userService = UserService;
  self.userObject = UserService.userObject;

  ProjectService.getProjects()

  self.listCollaborators = function (list) {
    let stringToPrint = ''
    if (list.array_agg === null) {
      stringToPrint = 'None'
    } else {
    for (let i = 0; i < list.length; i++) {
      console.log(list[i])

      stringToPrint += list[i] + ' '
      
    }}
    console.log(stringToPrint)
    return stringToPrint
  }


}]);
