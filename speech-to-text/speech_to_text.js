var watson = require('watson-developer-cloud');
var fs = require('fs');

var speech_to_text = watson.speech_to_text({
  username: '{username}',
  password: '{password}',
  version: 'v1',
});

var getUserMedia = require('getusermedia');
var MicrophoneStream = require('microphone-stream');

var params = {
  content_type: 'audio/wav',
  continuous: true,
  interim_results: true
};

// Create the stream.
var recognizeStream = speech_to_text.createRecognizeStream(params);
 
getUserMedia({ video: false, audio: true }, function(err, stream) {
  var micStream = new MicrophoneStream(stream);
  
  // get Buffers (Essentially a Uint8Array DataView of the same Float32 values) 
  // micStream.on('data', function(chunk) {
  //   // Optionally convert the Buffer back into a Float32Array 
  //   // (This actually just creates a new DataView - the underlying audio data is not copied or modified.) 
  //   var raw = MicrophoneStream.toRaw(chunk);
  //   //... 
    
  //   // note: if you set options.objectMode=true, the `data` event will output AudioBuffers instead of Buffers 
  //  });
  
  // or pipe it to another stream 
  micStream.pipe(recognizeStream);

  // Pipe out the transcription to a file.
	recognizeStream.pipe(fs.createWriteStream('transcription.txt'));

	// Get strings instead of buffers from 'data' events.
	recognizeStream.setEncoding('utf8');

	// Listen for events.
	recognizeStream.on('data', function(event) { onEvent('Data:', event); });
	recognizeStream.on('results', function(event) { onEvent('Results:', event); });
	recognizeStream.on('error', function(event) { onEvent('Error:', event); });
	recognizeStream.on('close-connection', function(event) { onEvent('Close:', event); });

	// Displays events on the console.
	function onEvent(name, event) {
	    console.log(name, JSON.stringify(event, null, 2));
	};
  
  // It also emits a format event with various details (frequency, channels, etc) 
  micStream.on('format', function(format) {
    console.log(format);
  });
  
  // Stop when ready 
  document.getElementById('my-stop-button').onclick = function() {
    micStream.stop();
  };
});



// // Pipe in the audio.
// fs.createReadStream('audio-file.wav').pipe(recognizeStream);


