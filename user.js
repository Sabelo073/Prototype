
let forgotPassword=document.getElementById("forgot");
let signUp=document.getElementById("sign");
let adminLog=document.getElementById("adminLog");
let logIn=document.getElementById("logIn");


forgotPassword.onclick=function(){
    window.location.href="reset.html";
};

signUp.onclick=function(){
    window.location.href="signUp2.html";
}

adminLog.onclick=function(){
    window.location.href="admin.html";
}
logIn.onclick=function (){
    let email=document.getElementById("email").value;
let password=document.getElementById("password").value;
    if(email.trim() ==="" || password.trim() ===""){
    alert("Please fill in all input fileds !")
    return;
}
    window.location.href="userDashboard.html";
}
