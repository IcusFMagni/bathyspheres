myApp.service('ProjectService', ['$http', function ($http) {
    var self = this;
    self.newProject = {}
    self.projects = { list: [] }


    self.createProject = function () {
        $http({
            method: 'POST',
            url: '/projects',
            params: self.newProject
        }).then(function (repsonse) {
            console.log('response', response);
            self.getProjects()
        })

    }


    self.getProject = function () {
        $http({
            method: 'GET',
            url: '/projects'
        }).then(function (response) {
            self.projects.list = response.data;

        });
    };
}])