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
        if(AuthLogicCreateUser(username, email, password)){
            console.log("created user");
            
            if(AuthLogicLogin(email,password)){
                console.log("attempting login");
                bindUsernameToApp(username);
                window.location = "searchview.html";
            }
        }
        //redirect user if successful!
    });
});

/*
 * 
 * @param {string} email
 * @param {string} password
 * @returns {boolean}
 */
function AuthLogicLogin(email, password){
    //attempts to login the user with provided credentials
    //sets the 'username' and stores this information once.
    //remember the username is used throughout the application to define
    //the broadcaster's name.
    var ref = new Firebase("https://luminous-inferno-8382.firebaseio.com");
    console.log(user);
    //logs in an authenticated user and redirects them to main page
    ref.authWithPassword({
        email: String(user.email),
        password: String(user.password)
    }, function(error, authData){
        if(error){
            console.log(error);
            alert("Login Failed with error ", error);
            return false;
        }else{
            console.log("Authenticated with authData ", authData);
            return true;
        }
    });
}

/*
 * 
 * @param {string} uname
 * @param {String} uemail
 * @param {string} upassword
 * @returns {boolean}
 * 
 * Attempts to create a new user in Firebase.  If successful returns true else
 * false.
 */
function AuthLogicCreateUser(uname, uemail, upassword){
    //function will attempt to create a new user with provided credentials
    //sets the 'username' for application purposes. see login logic for 
    //explanation of why this is necessary. 
    var ref = new Firebase("https://luminous-inferno-8382.firebaseio.com");
    ref.createUser({
        email: uemail,
        password: upassword
    }, function(error){
        if (error) {
            if(error.code === "EMAIL_TAKEN"){
                console.log("Taken Email");
                alert("Oops, this email address is taken");
            }
            if(error.code === "INVALID_EMAIL"){
                console.log("Wrong Email");
                alert("Incorrect email format!");
            }
            console.log(error);
            return false;
        } else {
            console.log("User account created successfully!");
            return true;
        }
    });
}


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