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
    var synthPlayer = []
    for (let i = 0; i < array.length; i++) {
      if(array[i] > 0) {
        synthPlayer.push (audioListener.createOscillator());
        let frequency = self.pitchCalculator(i);

        synthPlayer[i].connect(audioListener.destination)
        synthPlayer[i].frequency.setValueAtTime(frequency, audioListener.currentTime)
    
        synthPlayer[i].start(audioListener.currentTime)
        synthPlayer[i].stop(audioListener.currentTime + self.eigthNoteLength)
        
      }else {
        synthPlayer.push (undefined)
      }
    }
  }

  //creates a sound, sets pitch, and length 
  self.synthPlayer = function (note) {
    var osc = audioListener.createOscillator();
    var frequency = self.pitchCalculator(note)

    osc.connect(audioListener.destination)
    osc.frequency.setValueAtTime(frequency, audioListener.currentTime)

    osc.start(audioListener.currentTime)
    osc.stop(audioListener.currentTime + self.eigthNoteLength)
  }


  
  self.userService = UserService;
  self.currentProject = ProjectService.currentProject;
  
}]);
