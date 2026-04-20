let forgotPassword=document.getElementById("forgot");
let signUp=document.getElementById("signUp");
let userLog=document.getElementById("userLog");
let logIn=document.getElementById("logIn");

forgotPassword.onclick=function(){
    window.location.href="reset.html";
};

signUp.onclick=function(){
    window.location.href="signUp.html";
};

userLog.onclick=function(){
    window.location.href="user.html";
};

logIn.onclick=function(){
    let email=document.getElementById("email").value;
    let password=document.getElementById("password").value;

    if(email.trim() === "" || password.trim() === ""){
        alert("Please fill in all input fields!");
        return;
    }

    window.location.href="Admin_Dashbord.html";
};