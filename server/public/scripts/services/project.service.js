myApp.service('ProjectService', ['$http', function ($http) {
    var self = this;
    self.newProject = {};
    self.projects = { list: [] };
    self.currentProject = {name: 'nothing'};
    self.project = { list: [], arrayScore: []}


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
            url: '/projects/tracks/'+self.currentProject.name
        }).then(function (response) {
            self.project.list = response.data;
            self.project.arrayScore = response.data
            var array = []
            for (let i = 0; i < self.project.list[0].score.length/2; i++) {
                let pushValue = self.project.arrayScore[0].score.slice(2*i,2*i+2)
                var on = 0
                if (pushValue > 0){
                    on = 1
                }
                array.push({note: pushValue, position: i, on: on})
            }
            for (let i = 0; i < array.length/32; i++) {
                self.project.arrayScore[i] = []
                for (let index = i*32; index < 32*(i+1); index++) {
                    self.project.arrayScore[i].push(array[index])                   
                }
            }
        })
    }

    self.editNote = function (note) {
        if (note == 0) {

        }
        $http({
            method: 'PUT',
            url: '/projects/tracks', 
            params: note,
        })
    }
}])