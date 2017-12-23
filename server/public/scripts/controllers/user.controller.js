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
    for (let i = 0; i < list.length; i++) {
      stringToPrint += list[i] + ', '      
    }
    stringToPrint = stringToPrint.slice(0, -2)
    if (stringToPrint === 'null'){
      stringToPrint = 'None'
    }
    return stringToPrint
  }


}]);
