/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){
    console.log("ready");
    $("#submit-btn").click(function(event){
        event.preventDefault();
        console.log("submit button hit");
        //register new user with auth function
        var username = $("#username-input").val();
        var password = $("#password-input").val();
        var email = $("#email-input").val();
        console.log("Input given ", username, password, email);
        AuthLogicCreateUser(username, email, password);
        
        //redirect user if successful!
    });
});



/*----NOTE----
 * 
 * @param {string} uname
 * @returns {Boolean}
 * 
 * Outdated warning!  This will be removed next refactor.
 * Since login authentication is being implemented, it will no longer be required
 * that the username is bound to an HTML DOM element!
 */
function bindUsernameToApp(uname){

    
    if(uname !== ""){
        //verify user actually entered something
        if($("#username-input").val().length === 0){
            console.log("user being too cute...need to enter text");
            alert("You gotta have an email yo!");
            return false;
        }else{
            if(typeof Storage !== 'undefined'){
                localStorage.setItem('user_name', $("#username-input").val());
                console.log(localStorage.getItem('user_name'));
                return true;
            } else {
                alert("Your browser doesn't support local storage...upgrade quick");
                return false;
            }
        }
    }else{
        return false;
    }
}