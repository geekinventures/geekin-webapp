/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var fbURL = "https://luminous-inferno-8382.firebaseio.com";

$(document).ready(function(){
    SC.initialize({
        client_id:"0f0e321b9652115f3a8ea04f5030f9c0",
        redirect_uri: "http://localhost:8383/geekinradio/callback.html"
    });
    $("#player_bar").hide();
    $("#start-bcast-btn").show();
    $("#search-feed").click(function(){
        updateStatus(false, 0);
        window.location = "searchview.html";
    });
    $("#listener-feed").click(function(){
        updateStatus(false, 0);
        window.location = "modeltest.html";
    });
    var songJS = JSON.parse(getSongData());
    updateUserInfo(true);
    var prevPosition = 0;
    var updateOnceCount = 0;
    var stream = SC.stream("/tracks/"+songJS['song'].id, function(sound){
        sound.load({
            whileloading: function(){
                console.log(this.bytesLoaded, this.bytesTotal);
                updateProgressBar(this.bytesLoaded, this.bytesTotal);
//                updateLoadingText(this.bytesLoaded, this.bytesTotal);
            }
        });
        $("#start-bcast-btn").click(function(){
            
            updateListenHistory(localStorage.getItem('user_name'), getSongData());
            initialDBUpdate(localStorage.getItem('user_name'), 0);
            var fbRef = new Firebase(fbURL+"/"+localStorage.getItem('user_name'));
            var skew = new Firebase(fbURL+"/.info/serverTimeOffset");
            skew.once('value', function(snap){
                fbRef.once('value', function(snapshot){
                    //set client time
                    var offset = new Date().getTime() + snap.val();
                    sound.setPosition(offset - snapshot.val().servertime);
                });
            });
//            $("#loading-main").remove();
//            $("#player_bar").show();
//            $("#pauseplay-btn").show();
            if(true){
                $("#loading-main").remove();
                $("#player_bar").show();
                $("#pauseplay-btn").show();
                sound.play({
                    onplay: function(){
                        initialDBUpdate(localStorage.getItem('user_name'), 0);
                    },
                    whileplaying: function(){
                        if(sound.position > (prevPosition+50)){
                            prevPosition = this.position;
                            updateUserInfo(this.position);
                        }
                        updateProgressBar(sound.position, sound.duration);
                    }
                });
                var bounceBack = new Firebase(fbURL+"/"+localStorage.getItem('user_name'));
                var syncroLimit = 0;
//                bounceBack.once('value', function(snapshot){
//                    sound.setPosition(Firebase.ServerValue.TIMESTAMP - snapshot.val().servertime);
//                });
//                bounceBack.on('value', function(snapshot){
//                    console.log("broadcaster bounceback");
//                    console.log(snapshot.val().playstatus);
//                    if(syncroLimit < 15){
//                        syncroLimit++;
//                        sound.setPosition(Date.now() - snapshot.val().servertime);
//                        console.log("Server time difference ", Firebase.ServerValue.TIMESTAMP - snapshot.val().servertime + 5000);
//                    }
//                    
//                });
                updatePlayBtn(true);
                updateStatus(!sound.paused, sound.position);
                this.remove();
            }else{
                alert("Song has not loaded yet");
            }
                
        });
        $("#pauseplay-btn").click(function(){
//            console.log("pauseplay hit");
//            console.log(sound.readyState);
            var sound_position_snapshot = sound.position;
//            console.log("sound position " + sound.position);
            sound.togglePause();
//            if(sound.readyState === 3){
//               sound.togglePause();
//               console.log(!sound.paused);
//            }
            updatePlayBtn(!sound.paused);
            updateStatus(!sound.paused, sound_position_snapshot);
        });
        
    });
//    console.log(stream);
    
}); //document ready



function updatePlayBtn(bool){
//    console.log(bool);
    if(bool){
        //show pause button
        //song is playing
        updateUserInfo(bool);
//        console.log($("#pauseplay-btn"));
        $('#pauseplay-btn').attr("class","glyphicon glyphicon-pause");
    }else{
        //show play button
        //song is not playing
        updateUserInfo(bool);
        $('#pauseplay-btn').attr("class","glyphicon glyphicon-play");
    }
}

function getSongData(){
    if(typeof(Storage) !== 'undefined'){
        return localStorage.getItem('song');
    }else{
        console.log("client doens't support html 5");
        alert("you don't support local storage");
    }
}

function updateUserInfo(playStatus){
//    console.log("firing updateuseringo");
    var fbRef = new Firebase(fbURL);
   
    var songJS = JSON.parse(getSongData());
    var date = new Date();
    var user = {};
    var channelInfo = {};
    channelInfo['channelInfo'] = songJS;
    channelInfo['starttime'] = date.getTime();
    channelInfo['user'] = localStorage.getItem('user_name');
    user['username'] = localStorage.getItem('user_name');
    user['channel'] = channelInfo;
    user['playstatus'] = playStatus;
//    user['servertime'] = Firebase.ServerValue.TIMESTAMP;
//    user['ping'] = ping();
    writeData(user);

}

function updateChannelInfo(username, songData, playstatus, start, ping){
    //fbURL/[username]/channel endpoint
    var fbRef = new Firebase(fbURL+"/"+username);
    var channelChild = fbRef.child("channel");
    var data = {};
    var date = new Date();
    data['channelInfo'] = songData;
    data['starttime'] = start;
    data['ping'] = ping;
    data['playstatus'] = playstatus;
    data['username'] = username;
    data['starttime'] = date.now();
    channelChild.push(data);
}

function initialDBUpdate(username, songPosition){
    var fbRef = new Firebase(fbURL+"/"+username+"/newAlgorithm");
    var timeTest = new Firebase(fbURL+"/"+username);
    var servertime = {};
    timeTest.update({'servertime':Firebase.ServerValue.TIMESTAMP});
    var data = {};
//    console.log("Time Now in milli");
//    console.log(Date.now());
    data['start_time'] = Date.now();
    data['song_position'] = songPosition;
    
    fbRef.update(data);
}

function updateLoadingText(soFar, total){
    var loadingText = $("#small-loading");
    var perc = (soFar/total).toFixed(2) * 100;
    loadingText.text(perc.toString());
    
}
function updateProgressBar(soFar, total){
    var percentage = soFar/total * 100;
    var pBar = $("#progress-bar");
    pBar.attr('aria-valuenow', soFar);
    pBar.attr('aira-valuemax', total.toString());
    pBar.css("width",percentage+"%");
}

function writeData(data){
    var myFirebaseRef = new Firebase(fbURL+"/"+data['username']);
    myFirebaseRef.update(data);
}

function updateListenHistory(emailKey, songData){
    var userHistoryReference = new Firebase(fbURL+"/"+emailKey+"/history");
    userHistoryReference.push(songData);
}
function updatePlayBtn(bool){
    if(bool){
        //show pause button
        $('#pauseplay-btn').attr("class","glyphicon glyphicon-pause");
    }else{
        //show play button
        $('#pauseplay-btn').attr("class","glyphicon glyphicon-play");
    }
}

//updates the broadcasters online presence to reflect the play condition
function updateStatus(playerStatus, current_position){
//    console.log("current position " + current_position);
//    console.log("play status " + playerStatus);
    var username = localStorage.getItem('user_name');
    var d = new Date();
    var player = {};
    var data = {};
    data['song_position'] = current_position;
    player['status'] = playerStatus;
    player['song'] = localStorage.getItem('song');
    player['currentPosition'] = d.getTime();
    var myFirebaseRef = new Firebase(fbURL+"/onlineusers/"+username);
    var fbRef = new Firebase(fbURL+"/"+username+"/newAlgorithm");
    myFirebaseRef.update(player);
    fbRef.update(data);
    
}