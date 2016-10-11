// var getUserMedia = require('getusermedia');
// var MicrophoneStream = require('microphone-stream');
// var watson = require('watson-developer-cloud');
// var fs = require('fs');

navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(function(stream) {
  
  // var speech_to_text = watson.speech_to_text({
  //   username: '{username}',
  //   password: '{password}',
  //   version: 'v1',
  // });

  // var params = {
  //   content_type: 'audio/wav',
  //   continuous: true,
  //   interim_results: true
  // };

  // // Create the stream.
  // var recognizeStream = speech_to_text.createRecognizeStream(params);
  // var micStream = new MicrophoneStream(stream);
  // micStream.pipe(recognizeStream);
  // recognizeStream.pipe(fs.createWriteStream('transcript.txt'));
  // recognizeStream.setEncoding('utf8');
  // recognizeStream.on('data', function(event) { onEvent('Data:', event); });
  // recognizeStream.on('results', function(event) { onEvent('Results:', event); });
  // recognizeStream.on('error', function(event) { onEvent('Error:', event); });
  // recognizeStream.on('close-connection', function(event) { onEvent('Close:', event); });
  // function onEvent(name, event) {
  //   console.log(name, JSON.stringify(event, null, 2));
  // };
});

 
// getUserMedia({ video: false, audio: true }, function(err, stream) {
//   var micStream = new MicrophoneStream(stream);
//   console.log(typeof micStream);
  
  // get Buffers (Essentially a Uint8Array DataView of the same Float32 values) 
  // micStream.on('data', function(chunk) {
  //   // Optionally convert the Buffer back into a Float32Array 
  //   // (This actually just creates a new DataView - the underlying audio data is not copied or modified.) 
  //   var raw = MicrophoneStream.toRaw(chunk) 
  //   //... 
    
  //   // note: if you set options.objectMode=true, the `data` event will output AudioBuffers instead of Buffers 
  //  });
  
  // or pipe it to another stream 
  // micStream.pipe(/*...*/);
  
  // It also emits a format event with various details (frequency, channels, etc) 
  // micStream.on('format', function(format) {
  //   console.log(format);
  // });
  
  // Stop when ready 
  // document.getElementById('my-stop-button').onclick = function() {
  //   micStream.stop();
  // };
// });