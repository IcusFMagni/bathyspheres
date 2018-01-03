myApp.service('ProjectService', ['$http', function ($http) {
    var self = this;
    self.newProject = {};
    self.projects = { list: [] };
    self.currentProject = {name: 'nothing'};
    self.project = { list: []}


    self.createProject = function () {
        $http({
            method: 'POST',
            url: '/projects',
            params: self.newProject
        }).then(function (response) {
            console.log('response', response);
            self.getProjects()
        })

    }


    self.getProjects = function () {
        $http({
            method: 'GET',
            url: '/projects'
        }).then(function (response) {
            self.projects.list = response.data;

        });
    };

    self.getTrack = function () {
        $http({
            method: 'GET',
            url: '/projects/tracks'
        }).then(function ( response) {
            self.project.list = response.data;
        })

    }

}])