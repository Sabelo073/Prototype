let reset=document.getElementById("reset");



reset.onclick=function(){
    let email=document.getElementById("email").value;
let newPassword=document.getElementById("newPassword").value; 

    if(email.trim() === "" || newPassword.trim() === ""){
    alert("Please fill all input fields")
    return;
}
    alert("Password Updated");
    window.location.href="index.html";
}