/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
    //subscribe to channel
    SC.initialize({
        client_id:"0f0e321b9652115f3a8ea04f5030f9c0",
        redirect_uri: "http://localhost:8383/geekinradio/callback.html"
    });
    var reference = new Firebase("https://luminous-inferno-8382.firebaseio.com/");
    var online = new Firebase("https://luminous-inferno-8382.firebaseio.com/onlineusers");
    
    online.on('value', function(snapshot){
        console.log(snapshot.val());
        addUser(snapshot.val());
    });
    $("#search-feed").click(function(){
        window.location = "searchview.html";
    });
    
    $("#online_users").click('li', function(data){
//        console.log($(data.target).data().start);
        var data = $(data.target).data();
        console.log(data);
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

    var position = data.start;
    console.log(data.start);
    console.log(data.id);
    var current = new Date();
    song.setPosition(current.getTime() - position);
    song.play({
        whileplaying: function(){
            updateProgressBar(this.position, this.duration);
        }
    });
    var playStats = new Firebase("https://luminous-inferno-8382.firebaseio.com/onlineusers/"+data.id+"/status");
    var reference = new Firebase("https://luminous-inferno-8382.firebaseio.com/"+data.id+"/playstatus");
    var pingOfBCast = new Firebase("https://luminous-inferno-8382.firebaseio.com/"+data.id+"/ping");
    var refPos = 0;
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
               song.setPosition(snapshot.val()); 
            });
            updatePlayBtn(!song.paused);
        }
    });
    reference.on('value', function(snapshot){
        console.log("Syncro Limit");
        console.log(syncroLimit);
        var broadcasterPing = 0;
        pingOfBCast.once('value', function(snapshot){
           console.log("ping");
           console.log("broadcaster ping " + snapshot.val());
           console.log("listener ping " + ping());
           console.log("Summation of Ping " + (snapshot.val() + ping()));
           broadcasterPing = snapshot.val();
        });
        var lag = ping();

        if(syncroLimit < 4){
            console.log("firebase firing and syncro limit is " + syncroLimit);
            if(song.position > (refPos + 100)){
                var lag = ping();
                console.log("lag");
                console.log(lag+broadcasterPing);
                
                //calculation method where users ping is added to broadcaster's
                //ping
                // song.setPosition(snapshot.val() + (lag+broadcasterPing));
                
                //calculation does not take into account ping of client and bcaster
                song.setPosition(snapshot.val());
                refPos = song.position;
            }
        }
        if(song.position > ((lag+broadcasterPing)+snapshot.val())){
            syncroLimit = 0;
            song.setPosition(snapshot.val());
        }
        console.log("reference position");
        console.log(refPos);
        syncroLimit++;
    });
}

function updateProgressBar(soFar, total){
    var pBar = $("#progress-bar");
    var percentage = (soFar/total).toFixed(2) * 100;
    pBar.attr('aria-valuenow', soFar.troString());
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