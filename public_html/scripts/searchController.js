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
    $("#search").keydown('#search-input',function(event){
        if(event.which === 13){
            event.preventDefault();
        }
        SC.get('/tracks', {q: $('#search-input').val()}, function(tracks){
//            console.log(tracks);
            generateSearchResults(tracks);
        });
    });
    $('#search-results').click('list-group-item', function(entry){
//        console.log("item");
//        console.log($(entry.target).attr('id'));
//        console.log($(entry.target).data());
        saveSelectionToLocalStorage($(entry.target).data());
        console.log(localStorage.getItem('song'));
        window.location = "broadcastview.html";
        //set user play status to 'playing'
//        playTrackAtPosition($(entry.target).attr('id'), 0);
        
    });
    $('#listener-feed').click(function(){
        window.location = "modeltest.html";
    });
});


function saveSelectionToLocalStorage(data){
    if(typeof(Storage) !== 'undefined'){
        console.log("Saving to local storage");
        localStorage.setItem('song',JSON.stringify(data));
        
    }else{
        console.log("client does not support local storage");
        alert("You don't support local storage...update your browswer");
    } 
}
function generateSearchResults(input){
    $('#search-results').children().remove();
    var searchResults = $('#search-results');
    var listGroup = document.createElement("div");
    listGroup.className = "list-group";
    searchResults.append(listGroup);
    for(var i=0; i < input.length; i++){
        var item = document.createElement("a");
        item.setAttribute("href","#");
        item.className = "list-group-item";
        var title = document.createElement("h4");
        title.className = "list-group-item-heading";
        title.textContent = input[i].title;
        var artist = document.createElement("p");
        artist.className = "list-group-item-text";
        artist.textContent = input[i].user.username;
        artist.id = input[i].id;
        title.id = input[i].id;
        item.id = input[i].id;
        item.appendChild(title);
        item.appendChild(artist);
        $(artist).data("song", input[i]);
        $(title).data("song", input[i]);
        $(item).data("song",input[i]); //append song data to dom element
        searchResults.append(item);
    }
}