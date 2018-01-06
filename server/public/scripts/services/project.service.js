myApp.service('ProjectService', ['$http', function ($http) {
    var self = this;
    self.newProject = {};
    self.projects = { list: [] };
    self.currentProject = { name: 'nothing' };
    self.project = { list: [], arrayScore: [] }


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
            url: '/projects/tracks/' + self.currentProject.name
        }).then(function (response) {
            self.project.list = angular.copy(response.data);

            self.project.arrayScore = response.data;

            for (let j = 0; j < self.project.list.length; j++) {
                self.project.arrayScore[j] = { componentName: self.project.list[j].component_name, score: [] }

                var array = []
                for (let i = 0; i < self.project.list[j].score.length / 2; i++) {
                    let pushValue = self.project.list[j].score.slice(2 * i, 2 * i + 2)
                    var on = 0
                    if (pushValue > 0) {
                        on = 1
                    }
                    array.push({ id: j, componentName: self.project.list[j].component_name, note: pushValue, position: i, on: on })
                }
                for (let i = 0; i < array.length / 32; i++) {
                    self.project.arrayScore[j].score[i] = []
                    for (let index = i * 32; index < 32 * (i + 1); index++) {
                        self.project.arrayScore[j].score[i].push(array[index])
                    }
                }
            }
        })
    }

    self.editNote = function (beat) {
        function replaceNote(string, index, replacement) {
            let thing = string.substr(0, index) + replacement + string.substr(index + replacement.length);
            return thing
        }
        let noteValue = '00'
        if (beat.on == 0) {
            noteValue = '01';
        }
        let newString = {}
        newString.string = replaceNote(self.project.list[beat.id].score, 2 * beat.position, noteValue)
        newString.componentName = beat.componentName
        newString.projectName = self.currentProject.name
        $http({
            method: 'PUT',
            url: '/projects/tracks',
            params: newString,
        }).then(function (response) {
            self.getTrack()
        })
    }
}])