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
    
    var songJS = JSON.parse(getSongData());
    var userName = localStorage.getItem('user_name');
    console.log(songJS['song'].id);
    updateUserInfo(true);
    var position = 0;
    var trackid = songJS['song'].id;
    var stream = SC.stream("/tracks/"+trackid,function(sound){
        sound.load({
            whileloading: function(){
                updateProgressBar(this.bytesLoaded, this.bytesTotal);
            },
            onload: function(){
                playSong(this, 0);
            }
        });
        $("#pauseplay-btn").click(function(button){
            sound.togglePause();
            updateStatus(!sound.paused); //invert sound paused to tell play status
            updatePlayBtn(!sound.paused);
            console.log(sound.playState);
            if(sound.playState === 1){
                console.log("song playstate " + sound.playState);
                playSong(sound,position);
            }else{
                sound.togglePause();
                console.log(sound.paused);
//                updateStatus(!sound.paused);
//                updatePlayBtn(!sound.paused);
            }
            
        });
        
    });  

 
});
function updatePlayBtn(bool){
    if(bool){
        //show pause button
        $('#pauseplay-btn').attr("class","glyphicon glyphicon-pause");
    }else{
        //show play button
        $('#pauseplay-btn').attr("class","glyphicon glyphicon-play");
    }
}
function updateProgressBar(soFar, total){
    var pBar = $("#progress-bar");
    var percentage = (soFar/total).toFixed(2) * 100;
//    console.log(percentage);
    pBar.attr('aria-valuenow', percentage.toString());
    pBar.text(percentage);
    pBar.css("width",percentage+"%");
}
function playSong(song, position){
    updatePlayBtn(true);
    var prevPos = 0;
    song.setPosition(position);
    updateStatus(true);
    song.play({
        whileplaying: function(){
            console.log(this.position);
            if(this.position > (prevPos+5000)){
                updateUserInfo(this.position);
                prevPos = this.position;
            }
            if(this.position > (prevPos + 3000)){
                updateUserInfo(this.position);
                prevPos = this.position;
            }
            updateProgressBar(this.position, this.duration);
        }
    });
}
function getSongData(){
    if(typeof(Storage) !== 'undefined'){
        return localStorage.getItem('song');
    }else{
        console.log("client doens't support html 5");
        alert("you don't support local storage");
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
function updatePosition(position){
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
    user['currentPos'] = position;
    writeData(user);
}

function writeData(data){
    var myFirebaseRef = new Firebase("https://luminous-inferno-8382.firebaseio.com/"+data['username']);
    myFirebaseRef.set(data);
}