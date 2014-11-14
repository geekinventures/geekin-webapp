/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
    //test initial setup and detect private browsing modes
    try{
        localStorage.tryStorage = 2;
    } catch (e) {
        alert("You are in private browsing mode.  Please turn this off and reload");
    }
    
    console.log("document read");
    $("#username-form").submit(function(event){
        event.preventDefault();
        console.log($("#username-input").val());
        if($("#username-input").val().length === 0){
            console.log("user being too cute...need to enter text");
            alert("You gotta have a username yo!");
        }else{
            if(typeof Storage !== 'undefined'){
                localStorage.setItem('user_name', $("#username-input").val());
                console.log(localStorage.getItem('user_name'));
                window.location = "searchview.html";
            }else{
                alert("Your browser doesn't support local storage...upgrade quick");
            }
        }
    });
});