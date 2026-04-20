let register=document.getElementById("register");
let logIn=document.getElementById("logIn");




register.onclick=function (){
    let userName=document.getElementById("userName").value;
let email=document.getElementById("email").value;
let newPassword=document.getElementById("newPassword").value;

    if(email.trim() === "" || newPassword.trim() === "" || userName.trim() === ""){
    alert("Please fill all input fields")
    return;
}
    window.location.href="admin.html";
}

logIn.onclick=function (){
    window.location.href="user.html";
}