/* 
 * Provides accessor functions to firebase user authentication and user data
 * for authentication and verification
 */

/*-----------GLOBALS------------*/
var fbURL = "https://luminous-inferno-8382.firebaseio.com";


/*
 * 
 * @param {string} email
 * @param {string} password
 * @returns {boolean}
 */
function AuthLogicLogin(uemail, upassword){
    //attempts to login the user with provided credentials
    //sets the 'username' and stores this information once.
    //remember the username is used throughout the application to define
    //the broadcaster's name.
    console.log("input email and password", uemail, upassword);
    var ref = new Firebase(fbURL);
    
    //logs in an authenticated user and redirects them to main page
    ref.authWithPassword({
        email: String(uemail),
        password: String(upassword)
    }, function(error, authData){
        if(error){
            console.log(error);
            alert("Login Failed with error ", error);
        }else{
            console.log("Authenticated with authData ", authData);
            
            //create user object skeleton on firebase
            //email -> fb key
            console.log("email to key");
            console.log(emailToKey(uemail));
            var fbRef = new Firebase(fbURL);
            console.log("Authentication Credentials");
            console.log(fbRef.getAuth());
            //get user's username from fb reference
            var userRef = new Firebase(fbURL+"/"+emailToKey(uemail));
            userRef.once('value', function(snapshot){
                console.log(snapshot.val());
                var uData = snapshot.val();
                bindUsernameToApp(uData.username);
                console.log(uData.username);
                //redirect user
                window.location = "searchview.html";
            });
            
            
            
            
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
    var ref = new Firebase(fbURL);
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

        } else {
            console.log("User account created successfully!");
            
            //create user skeleton
            var user = {};
            user.ping = null;
            user.emailKey = emailToKey(uemail);
            user.playstatus = null;
            user.username = uname;
            user.channel = null;
            var channelInfo = {};
            channelInfo.song = null;
            channelInfo.starttime = null;
            channelInfo.user = uname;
            
            user.channel = channelInfo;
            writeData(user);
            bindUsernameToApp(emailToKey(uemail));
            
            //redirect user
            window.location = "searchview.html";
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
        if(typeof Storage !== 'undefined'){
            localStorage.setItem('user_name', uname);
            console.log(localStorage.getItem('user_name'));
            return true;
        } else {
            alert("Your browser doesn't support local storage...upgrade quick");
            return false;
        }
    }else{
        return false;
    }
}

function writeData(data){
    var myFirebaseRef = new Firebase(fbURL+"/"+data['emailKey']);
    myFirebaseRef.set(data);
}

function emailToKey(email){
    return email.replace(/[^a-zA-z0-9]/g, '');
}

function getAuthenticationToken(){
    var token = null;
    var fbRef = new Firebase(fbURL);
//    var token = fbRef.getAuth().token;
    return null;
}

function authenticateWithToken(token){
    
}