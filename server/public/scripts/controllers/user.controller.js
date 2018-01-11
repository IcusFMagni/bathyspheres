myApp.controller('UserController',['UserService', 'ProjectService', function(UserService, ProjectService) {
  console.log('UserController created');
  var self = this;

  //functions
  self.newProject = ProjectService.newProject;
  self.deleteProject = ProjectService.deleteProject
  self.createProject = ProjectService.createProject;
  self.addCollaborator = ProjectService.addCollaborator;
  


  //variables
  self.currentProject = ProjectService.currentProject;
  self.projects = ProjectService.projects;
  self.collaboratorList = ProjectService.collaboratorList
  self.project = ProjectService.project;

  self.userService = UserService;
  self.userObject = UserService.userObject;


  ProjectService.getProjects()
  ProjectService.getCollaboratorProjects()

  self.selectProject = function (name) {
    self.currentProject.name = name
    ProjectService.getTrack()
  }

  
  



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
