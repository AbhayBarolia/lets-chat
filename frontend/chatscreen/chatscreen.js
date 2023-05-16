const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
window.addEventListener("DOMContentLoaded", (event) => {  
        sendMessage("You logged in");

    });

    window.addEventListener("submit", (e)=>{
        e.preventDefault();
        let message=document.getElementById("message").value;
        if(message=="")
        {
            alert("Please enter message");
        }
        else
        {
            sendMessage(message);
        }

      });

      async function sendMessage(message)
      {
        let obj={message:message};
        let send=  await axios.post("http://localhost:3000/chat/message",obj, config);
        if(send)
        {
            let chatlist = document.getElementById("chatlist");
            let msg = document.createElement("li");
            msg.setAttribute("class","msg");
            msg.appendChild(document.createTextNode(message));
            chatlist.appendChild(msg);
            let hr = document.createElement("hr");  
            chatlist.appendChild(hr);

        }
        else{
            alert("Something went wrong, please try again");
        }
      }
