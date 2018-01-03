myApp.controller('InfoController',['UserService', 'ProjectService', function(UserService, ProjectService) {
  console.log('InfoController created');
  var self = this;
  var audioListener = new AudioContext();

  self.bpm = 120;
  self.eigthNoteLength = 60/self.bpm;

  

  noise = audioListener.createOscillator();
  noise.connect(audioListener.destination)

  //takes in relative postion to A3
  self.pitchCalculator = function (note) {
    var adjustedPitch = note-14
    var part = Math.pow(2, 1/12)
    var frequency = 440*Math.pow(part, adjustedPitch)
    return frequency
  }

  self.scoreReader = function (array) {
    for (let i = 0; i < array.length; i++) {
      if(array[i] > 0) {
        self.synthPlayer(i)
      }      
    }
  }

  //creates a sound, sets pitch, and length 
  self.synthPlayer = function (note) {
    let osc = audioListener.createOscillator();
    var frequency = self.pitchCalculator(note)

    osc.connect(audioListener.destination)
    osc.frequency.setValueAtTime(frequency, audioListener.currentTime)

    osc.start(audioListener.currentTime)
    osc.stop(audioListener.currentTime + self.eigthNoteLength)
  }


  
  self.userService = UserService;
  self.currentProject = ProjectService.currentProject;
  
}]);
