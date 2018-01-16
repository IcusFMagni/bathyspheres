myApp.service('ProjectService', ['$http', function ($http) {
    var self = this;
    self.newProject = {};
    self.projects = { list: [] };
    self.collaboratorList = { list: [] }
    self.currentProject = { name: 'nothing' };
    self.project = { list: [], arrayScore: [] }
    self.editOnlyOne = false;
    self.songLength = 32


    self.addCollaborator = function (collaborator, project) {
        $http({
            method: 'GET',
            url: '/projects/user',
            params: { user: collaborator }
        }).then(function (response) {

            $http({
                method: 'POST',
                url: '/projects/user',
                data: { user: response.data[0].id, track: project }
            }).then(function (response) {
                self.getProjects()
            });
        });

    };

    self.createProject = function () {
        $http({
            method: 'POST',
            url: '/projects',
            params: self.newProject
        }).then(function (response) {

            self.getProjects()
        });

    };


    self.getProjects = function () {
        $http({
            method: 'GET',
            url: '/projects'
        }).then(function (response) {
            self.projects.list = response.data;
        });
    };

    self.getCollaboratorProjects = function () {
        $http({
            method: 'GET',
            url: '/projects/collaborator'
        }).then(function (response) {
            self.collaboratorList.list = response.data
        })
    };

    self.removeSelf = function (id) {

        $http({
            method: 'DELETE',
            url: 'projects/collaborator',
            params: { track: id }
        }).then(function (response) {
            self.getCollaboratorProjects()
        })
    }


    self.deleteProject = function (name) {
        const send = { track: name }
        $http({
            method: 'DELETE',
            url: '/projects',
            params: send
        }).then(function (resposne) {
            self.getProjects()
        })
    }
    self.getTrack = function () {
        $http({
            method: 'GET',
            url: '/projects/tracks/' + self.currentProject.name
        }).then(function (response) {
            self.project.list = angular.copy(response.data);

            self.project.arrayScore = [];

            for (let j = 0; j < self.project.list.length; j++) {
                self.project.arrayScore[j] = { componentName: self.project.list[j].component_name, 
                    componentID: self.project.list[j].id,
                    type: self.project.list[j].type, 
                    componentSettings: {
                        osc: self.project.list[j].osc,
                        osc2: self.project.list[j].osc2,
                        volume: self.project.list[j].volume
                    },
                    score: [] }

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
        });
    }

    self.editNote = function (beat) {
        if (self.editOnlyOne == false) {
            self.editOnlyOne = true
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
                self.editOnlyOne = false
            })

        } else {
            console.log('wait')
        }
    }
    self.saveComponent = function (settings) {
        console.log(settings)
        $http({
            method: 'PUT',
            url: '/projects/component',
            data: settings
        }).then(function(response){
            self.getTrack()
        })
    }

    self.createReadableScore = function (array) {

        let readableScore = []

        for (let i = 0; i < self.songLength; i++) {
            readableScore.push(0)
        }
        let note = []
        for (let i = 0; i < array.length; i++) {
            note = array[i]

            for (let j = 0; j < self.songLength; j++) {

                if (note[j].note > 0) {
                    readableScore[j] = 58 - i
                }
            }
        }
        return readableScore
    }

    self.createReadableDrumScore = function (array) {
        let readableDrumScore = []

        for (let i = 0; i < array.length; i++) {
            readableDrumScore.push(array[i].on)
            
        }
        return readableDrumScore
    }
}])