/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//client id: 0f0e321b9652115f3a8ea04f5030f9c0
$(document).ready(function(){
    var reference = new Firebase("https://luminous-inferno-8382.firebaseio.com/");
    reference.on('child_changed', function(snapshot){
        console.log(snapshot.val());
    });
    reference.on('child_added', function(snapshot){
        console.log(snapshot.val());
    })
    SC.initialize({
        client_id:"0f0e321b9652115f3a8ea04f5030f9c0",
        redirect_uri: "http://localhost:8383/geekinradio/callback.html"
    });
    connectToSoundCloud();
    $("#search-btn").on("click", function(button){
        if($("#search-container").length){
            //is visible need to hide it
            showSearch(false);
        }else{
            //no visible show it
            showSearch(true);
        }
    });
    
    $("#livefeed-btn").click(function(){
        if($("#livefeed-container").length){
            showListenerFeed(true);
            //remove me
            generateOnlineUsersList([{username:"timothy.barrett"}]);
        }else{
            showListenerFeed(false);
        }
    });


    
    $('#search-results').click('list-group-item', function(entry){
        console.log("item");
        console.log($(entry.target).attr('id'));
        console.log($(entry.target).data().id);
        
        //set user play status to 'playing'
        playTrackAtPosition($(entry.target).attr('id'), 0);
    });
});


/*
 * Plays a track from soundcloud at specified position in milliseconds
 */
function playTrackAtPosition(trackid, position){
    var stream = SC.stream("/tracks/"+trackid, {autoPlay:false}, function(sound){
        $("#pauseplay-btn").click(function(){
            sound.stop();
            console.log("pause/play");
            //set user status to not playing/paused
        });
        sound.load({
            whileloading: function(){
                console.log('loading');
            },
            onload: function(){
                sound.play({onplay: function(){
                     sound.setPosition(position);}});}
        });
    });
}

function setUserStatus(action){
    var createChannel = {};
    
}
function userDidPlaySound(songID){
    var me = getUserData();
    
}

function connectToSoundCloud(){
    SC.connect(function(){
    });
}

function getUserData(){
    SC.get('/me', function(me){
        return me;
    });
}



function generateOnlineUsersList(objects){
    var livefeed = $("#livefeed-container");
    livefeed.children().remove(); //remove unwanted children
    var ulContainer = document.createElement("ul");
    ulContainer.className = "list-group";
    livefeed.append(ulContainer);

    //for every online user add them to list
    for(var i=0; i < objects.length; i++){
        var listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = objects[i].username;
        listItem.id = objects[i].username;
        ulContainer.appendChild(listItem);
    }  
}


/*
 * Display the search button and results when user clicks 
 * the search button.
 */
function showListenerFeed(display){
    if(display){
       $("#livefeed-contianer").remove();
    }else{
       var livefeed = $("#livefeed");
       var container = document.createElement("div");
       container.className = "row row-offcanvas row-offcanvas-right";
       livefeed.append(container);
    }
}

function showSearch(display){
    if(display){
        var livefeed = $("#search");
        var container = document.createElement("div");
        var inputGroup = document.createElement("div");
        var groupAddon = document.createElement("span");
        var input = document.createElement("input");
        container.id = "search-container";
        container.className = "row row-offcanvas row-offcanvas-right";
        inputGroup.className = "input-group";
        groupAddon.className = "input-group-addon";
        groupAddon.textContent = "Search";
        input.setAttribute("type", "text");
        input.className = "form-control";
        input.id = "search-input";
        input.setAttribute("placeholder","Search Genres, Artists, and Tracks");
        livefeed.append(container);
        container.appendChild(inputGroup);
        inputGroup.appendChild(groupAddon);
        inputGroup.appendChild(input);
       
    }else{
        var search = $("#search-container").remove();
        
    }
}