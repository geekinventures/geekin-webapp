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
    
    $("#register-btn").click(function(event){
        event.preventDefault();

        window.location = "register.html";
    });

    $("#submit-btn").click(function(event){
        event.preventDefault();

        var password = $("#password-input").val();
        var email = $("#email-input").val();
        var user = {};
        user.username = username;
        user.password = password;
        user.email = email;
        
        //verify user actually entered something
        if($("#username-input").val().length === 0){
            console.log("user being too cute...need to enter text");
            alert("You gotta have an email yo!");
        }else{
            if(typeof Storage !== 'undefined'){
                localStorage.setItem('user_name', $("#username-input").val());
                console.log(localStorage.getItem('user_name'));

                //attempt to login user w/ creds.
                AuthLogicLogin(email, password);
                
            } else {
                alert("Your browser doesn't support local storage...upgrade quick");
            }
        }
    });
});

