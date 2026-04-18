let email=document.getElementById("email").value;
let password=document.getElementById("password").value;
let forgotPassword=document.getElementById("forgot");
let signUp=document.getElementById("sign");
let userLog=document.getElementById("userLog");

if(email.trim() ==="" && password.trim() ===""){
    alert("Please fill in all input fileds !")
}

forgotPassword.onclick=function(){
    window.location.href="reset.html";
};

signUp.onclick=function(){
    window.location.href="signUp.html";
}

userLog.onclick=function(){
    window.location.href="user.html"
}