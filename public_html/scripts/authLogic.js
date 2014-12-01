/* 
 * Provides accessor functions to firebase user authentication and user data
 * for authentication and verification
 */

/*-----------GLOBALS------------*/



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