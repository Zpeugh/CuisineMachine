const NLP_SERVICE_CREDENTIAL = "";
const NLP_SERVICE_PASSWORD = "";
const TEXT_TO_SPEECH_UN = "dbedbd53-5ac1-4f44-a97b-d682c856acc6"
const TEXT_TO_SPEECH_PASS = "X47ysWgxe4mD"
const TEXT_TO_SPEECH_URL = "https://stream.watsonplatform.net/text-to-speech/api";
const VOICE = "en-GB_KateVoice";
console.log("Initializing Services...");

app.service('NLPService', function($http) {
    this.processText = function( text ){
        $http.get("http://www.httpbin.org/get?sample=" + text)
        .success(function(data){
            console.log(data);
            return JSON.stringify(data);
        }).error(function(data){
            return "Shit";
        });
    };
});

app.service('RandRService', function($http){
    this.sendRequest = function(sentence){
        return $http.get("/api/search?q=" + sentence);
    }
});


app.service('TextToSpeechService', function($http) {
    this.speakText = function( text ){
        $.ajax({
            crossOrigin: true,
            url: TEXT_TO_SPEECH_URL,
            headers: {
                "Content-Type": "application/json",
                "Accept": "audio/wav"
            },
            method: "POST",
            dataType: "jsonp",
            data: {"username": TEXT_TO_SPEECH_UN,
                    "password": TEXT_TO_SPEECH_PASS,
                    "voice" : VOICE,
                    "text" : text},
            success: function(response) {
                console.log("success");
                console.log(response);
                return response;
            },
            error: function(response) {
                console.log("error");
                console.log(response);
                return response;
            }
        });
    };
});
