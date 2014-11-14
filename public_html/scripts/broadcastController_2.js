/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
    SC.initialize({
        client_id:"0f0e321b9652115f3a8ea04f5030f9c0",
        redirect_uri: "http://localhost:8383/geekinradio/callback.html"
    });
    $("#player_bar").hide();
    $("#start-bcast-btn").show();
    $("#search-feed").click(function(){
        updateStatus(false);
        window.location = "searchview.html";
    });
    $("#listener-feed").click(function(){
        updateStatus(false);
        window.location = "modeltest.html";
    });
    var songJS = JSON.parse(getSongData());
    updateUserInfo(true);
    var prevPosition = 0;
    var stream = SC.stream("/tracks/"+songJS['song'].id, function(sound){
        sound.load({
            whileloading: function(){
//                updateProgressBar(this.bytesLoaded, this.bytesTotal);
                updateLoadingText(this.bytesLoaded, this.bytesTotal);
            },
            onload: function(){
//                $("#player_bar").show("slow");
                
                
                
            }
        });
        $("#start-bcast-btn").click(function(){
            if(true){
                $("#loading-main").remove();
                $("#player_bar").show();
                $("#pauseplay-btn").show();
                sound.play({
                    whileplaying: function(){
                        if(sound.position > (prevPosition+5000)){
                            prevPosition = this.position;
                            updateUserInfo(this.position);
                        }
                        updateProgressBar(sound.position, sound.duration);
                    }
                });
                updatePlayBtn(true);
                updateStatus(!sound.paused);
                this.remove();
            }else{
                alert("Song has not loaded yet");
            }
                
        });
        $("#pauseplay-btn").click(function(){
            console.log("pauseplay hit");
            console.log(sound.readyState);
            sound.togglePause();
//            if(sound.readyState === 3){
//               sound.togglePause();
//               console.log(!sound.paused);
//            }
            updatePlayBtn(!sound.paused);
            updateStatus(!sound.paused);
        });
        
    });
    console.log(stream);
    
}); //document ready



function updatePlayBtn(bool){
    console.log(bool);
    if(bool){
        //show pause button
        //song is playing
        updateUserInfo(bool);
        console.log($("#pauseplay-btn"));
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
    console.log("firing updateuseringo");
    var songJS = JSON.parse(getSongData());
    var username = localStorage.getItem('username');
    var date = new Date();
    var user = {};
    var channelInfo = {};
    channelInfo['channelInfo'] = songJS;
    channelInfo['starttime'] = date.getTime();
    channelInfo['user'] = localStorage.getItem('user_name');
    user['username'] = localStorage.getItem('user_name');
    user['channel'] = channelInfo;
    user['playstatus'] = playStatus;
    user['ping'] = ping();
    writeData(user);
}

function updateLoadingText(soFar, total){
    var loadingText = $("#small-loading");
    var perc = (soFar/total).toFixed(2) * 100;
    loadingText.text(perc.toString());
    
}
function updateProgressBar(soFar, total){
    var pBar = $("#progress-bar");
    var percentage = (soFar/total).toFixed(2) * 100;
//    console.log(percentage);
    pBar.attr('aria-valuenow', percentage.toString());
//    pBar.text(percentage);
    pBar.css("width",percentage+"%");
}

function writeData(data){
    var myFirebaseRef = new Firebase("https://luminous-inferno-8382.firebaseio.com/"+data['username']);
    myFirebaseRef.set(data);
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

function updateStatus(playerStatus){
    var username = localStorage.getItem('user_name');
    var d = new Date();
    var player = {};
    player['status'] = playerStatus;
    player['song'] = localStorage.getItem('song');
    player['currentPosition'] = d.getTime();
    var myFirebaseRef = new Firebase("https://luminous-inferno-8382.firebaseio.com/onlineusers/"+username);
    myFirebaseRef.update(player);
}