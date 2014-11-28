/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
    //test initial setup and detect private browsing modes
    console.log("hello");
    try{
        localStorage.tryStorage = 2;
    } catch (e) {
        alert("You are in private browsing mode.  Please turn this off and reload");
    }
    
    console.log("document read");

    $("#submit-btn").click(function(event){
        event.preventDefault();
        console.log($("#username-input").val());
        var username = $("#username-input").val();
        var password = $("#password-input").val();
        var user = {};
        user.username = username;
        user.password = password;
        loginUser(user);
        
        //verify user actually entered something
        if($("#username-input").val().length === 0){
            console.log("user being too cute...need to enter text");
            alert("You gotta have a username yo!");
        }else{
            if(typeof Storage !== 'undefined'){
                localStorage.setItem('user_name', $("#username-input").val());
                console.log(localStorage.getItem('user_name'));
//                window.location = "searchview.html";
            }else{
                alert("Your browser doesn't support local storage...upgrade quick");
            }
        }
    });
});

function createNewUser(user){
    //creates a new user with provided credentials if none exist
}

function loginUser(user){
    console.log(user);
    //logs in an authenticated user and redirects them to main page
    var ref = new Firebase("https://luminous-inferno-8382.firebaseio.com");
    ref.authWithPassword({
        email: String(user.email),
        password: String(user.password)
    }, function(error, authData){
        if(error){
            console.log(error);
            alert("Login Failed with error ", error);
        }else{
            console.log("Authenticated with authData ", authData);
        }
    });
}