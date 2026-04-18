let reset=document.getElementById("reset");
let email=document.getElementById("email").value;
let newPassword=document.getElementById("newPassword").value;

if(email.trim() === "" && newPassword.trim() === ""){
    alert("Please fill all input fields")
    return;
}
reset.onclick=function(){
    alert("Password Updated");
    window.location.href="index.html";
}