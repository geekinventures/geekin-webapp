/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var fbURL = "https://luminous-inferno-8382.firebaseio.com";

$(document).ready(function(){
    //subscribe to channel
    var clockSkew = new Firebase(fbURL+"/.info/serverTimeOffset");
    clockSkew.on('value', function(snap){
        var offset = snap.val();
        console.log("offset", offset);
        var estimatedSkew = new Date().getTime() + offset;
        console.log("Estimated clock skew of client", estimatedSkew);
    });
    SC.initialize({
        client_id:"0f0e321b9652115f3a8ea04f5030f9c0",
        redirect_uri: "http://localhost:8383/geekinradio/callback.html"
    });
    var reference = new Firebase("https://luminous-inferno-8382.firebaseio.com/");
    var online = new Firebase("https://luminous-inferno-8382.firebaseio.com/onlineusers");
    
    online.on('value', function(snapshot){
        
        addUser(snapshot.val());
    });
    $("#search-feed").click(function(){
        window.location = "searchview.html";
    });
    
    $("#online_users").click('li', function(data){
//        console.log($(data.target).data().start);
        var data = $(data.target).data();
        
        var trackid = data.song.id;
        var stream = SC.stream("/tracks/"+trackid,function(sound){
            sound.load({
                whileloading: function(){
                    console.log('loading');
                    updateProgressBar(this.bytesLoaded, this.bytesTotal);
                },
                onload: function(){
                    console.log("song loaded");
                    playSong(this, data);
                }
            }); 
            $("#pauseplay-btn").click(function(button){
                sound.togglePause();
                updatePlayBtn(!sound.paused);
                playSong(sound,data);
            }); //sound
        }); //stream
    }); //click function
}); //on document load

function writeData(data){
    var myFirebaseRef = new Firebase("https://luminous-inferno-8382.firebaseio.com");
    myFirebaseRef.set(data);
}

function playSong(song, data){
    song.play({
        whileplaying: function(){
            updateProgressBar(this.position, this.duration);
        }
    });
    var playStats = new Firebase("https://luminous-inferno-8382.firebaseio.com/onlineusers/"+data.id+"/status");
    var reference = new Firebase("https://luminous-inferno-8382.firebaseio.com/"+data.id);
//    var pingOfBCast = new Firebase("https://luminous-inferno-8382.firebaseio.com/"+data.id+"/ping");
//    var refPos = 0;
    //set the song position then start playing it
    var fbRef = new Firebase(fbURL+"/"+data.id);
    var skew = new Firebase(fbURL+"/.info/serverTimeOffset");
    skew.once('value', function(snap){
        fbRef.once('value', function(snapshot){
            //set client time
            var offset = new Date().getTime() + snap.val();
            song.setPosition(offset - snapshot.val().servertime);
        });
    });
    var syncroLimit = 0;
    $("#pauseplay-btn").click(function(){
        song.togglePause();
        updatePlayBtn(!song.paused);

    }); //sound
    playStats.on('value', function(snapshot){
        syncroLimit = 1;

        if(snapshot.val() === false){
            console.log("firing paused");
            song.pause();
            updatePlayBtn(!song.paused);
        }
        if(snapshot.val() === true){
            console.log("firing play");
            song.resume();
            reference.once('value', function(snapshot){
               console.log("this value changed");
//               song.setPosition(snapshot.val()); 
            });
            updatePlayBtn(!song.paused);
        }
    });
}

function updateProgressBar(soFar, total){
    var pBar = $("#progress-bar");
    var percentage = (soFar/total).toFixed(2) * 100;
    pBar.attr('aria-valuenow', soFar.toString());
    pBar.attr('aria-valuemax', total.toString());
    pBar.text(percentage);
    pBar.css("width",percentage+"%");  
}

function addUser(data){
    //adds users to the DOM in list items
    var users = $("#online_users");
    users.children().remove();
    for(var keys in data){
        if(data[keys].status){
            var song = JSON.parse(data[keys].song);
            var userList = document.createElement("li");
            var aref = document.createElement("a");
            aref.setAttribute("id", keys);
            aref.textContent = keys;
            userList.textContent = keys;
            userList.className = "list-group-item";
            $(userList).data("song",song.song);
            $(userList).data("start", data[keys].currentPosition);
            $(userList).data("id", keys);
            users.append(userList);
        }
    }   
}
function updatePlayBtn(bool){
    if(bool){
        //show pause button
        $('#pauseplay-btn').attr("class","glyphicon glyphicon-pause white");
    }else{
        //show play button
        $('#pauseplay-btn').attr("class","glyphicon glyphicon-play white");
    }
}

//returns the position where the song should be (seek to position)
function newAlgorithm(currentSongPosition, broadcasterName){
    //grab the data from Firebase b_start time and b_event time (pause play event)
    var fbRef = new Firebase(fbURL+"/"+broadcasterName+"/newAlgorithm");
    var bCastTime = null;
    fbRef.once("value", function(snapshot){
        
        bCastTime = snapshot.val().start_time;
        
        return Date.now() - bCastTime;
    });
    //calculate where the listeners position is
    
    //calculate the difference between the broadcaster and listeners time
    var bcastListenerDifference = Date.now() - bCastTime;
    
    //return the position of where the song should now go
    
    var result = bcastListenerDifference;
    
//    return result;
    
}