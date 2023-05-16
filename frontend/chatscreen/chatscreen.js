const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
let chatlist = document.getElementById("chatlist");
window.addEventListener("DOMContentLoaded", (event) => {  
        let flag = localStorage.getItem("loggedIn");
        
        if(flag=="true"){
            getMessage();
        }
        else if(flag=="false"){
            localStorage.setItem("loggedIn",true);
            sendMessage("logged in");
            getMessage();
        }
        else{
            window.location.href = "../login/login.html";
        }
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
      {try{
        let obj={message:message};
        let send=  await axios.post("http://localhost:3000/chat/message",obj, config);
        if(send)
        {
            showData(`You : ${message}`);
        }
        else{
            alert("Something went wrong, please try again");
        }
        }
        catch(err)
        {
            alert("Please try again");
        }
      }

      async function getMessage(){
        try{
            let chatMessages = await axios.get("http://localhost:3000/chat/message", config);
            if(chatMessages)
            {
                for(let i=0;i<chatMessages.data.messages.length;i++)
                {
                    let str= `${chatMessages.data.messages[i].userName} : ${chatMessages.data.messages[i].message}`;
                    showData(str);
                }
            }
        }
        catch(err){
            alert(err.message);
        }        
      }


      function showData(str)
    {
        
        
        let msg = document.createElement("li");
            msg.setAttribute("class","msg");
            msg.appendChild(document.createTextNode(str));
            chatlist.appendChild(msg);
            let hr = document.createElement("hr");  
            chatlist.appendChild(hr);
        
         
    }