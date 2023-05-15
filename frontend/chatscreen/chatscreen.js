window.addEventListener("DOMContentLoaded", (event) => {  
    let chatlist = document.getElementById("chatlist");
    let msg = document.createElement("li");
    msg.setAttribute("class","msg");
    msg.appendChild(document.createTextNode("You logged in"));
    chatlist.appendChild(msg);            

    });