const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
let chatlist = document.getElementById("chatlist");
let messageArr = new Array(10);



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
            document.getElementById("message").value="";
            document.getElementById("message").value="";
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
        messageArr = JSON.parse(localStorage.getItem("messageArr") || "[]");
        if(messageArr[0]!=null)
        {
           for(let i =0;i< messageArr.length;i++)
           {
            if(messageArr[i]!=null)
            {
                let str= `${messageArr[i].userName} : ${messageArr[i].message}`
                showData(str);
            }
            
           }
        }
        else
        {
            let message = await axios.get("http://localhost:3000/chat/message/", config);
            if (message)
            {
                for(let i=0;i< 10;i++){
                    if(message.data.messages.length>=10){
                        messageArr[i]= {
                        username: message.data.messages[message.data.messages.length-10+i].userName,
                        message: message.data.messages[message.data.messages.length-10+i].message,
                        id: message.data.message[message.data.messages.length-10+i].id
                        }
                
                    }  
                    else
                    {
                     if(i<message.data.messages.length)   
                     {
                        messageArr[i]= {
                            username: message.data.messages[i].userName,
                            message: message.data.messages[i].message,
                            id: message.data.message[i].id
                            }
                     }
                    } 
                
                    localStorage.setItem("messageArr",JSON.stringify(messageArr));    
                }
                if(messageArr.length>0)
                {
                    getMessage();
                }
            }
        }
       }
    catch(err){
        alert(err.message);
    }    
    }  


    let getNewMessage = setInterval(async()=>{
        try{
            let id;
            for(let i=0; i<messageArr.length; i++)
            {
                if(messageArr[i]==null)
                {   if(i==0){
                        id=0;
                    }

                    break;
                }
                else
                {
                    id=messageArr[i].id;
                }
            }

            let chatMessages = await axios.get("http://localhost:3000/chat/message/"+id, config);
            
            if(chatMessages)
            {
                for(let i=0;i<chatMessages.data.messages.length;i++)
                {   if(messageArr[9]==null){
                        messageArr.push(
                            {
                                userName:chatMessages.data.messages[i].userName,
                                message:chatMessages.data.messages[i].message,
                                id:chatMessages.data.messages[i].id
                            }
                        );
                    }
                    else{
                     for(let j=0;j<9;j++)
                     {
                        messageArr[j]=messageArr[j+1];
                     }   
                     messageArr[9]= {
                        userName:chatMessages.data.messages[i].userName,
                        message:chatMessages.data.messages[i].message,
                        id:chatMessages.data.messages[i].id
                    };
                    }
                    let str= `${chatMessages.data.messages[i].userName} : ${chatMessages.data.messages[i].message}`;
                    showData(str);
                }
                localStorage.setItem("messageArr",JSON.stringify(messageArr));    
            }
            
            
            
            return;
        }
        catch(err){
            alert(err.message);
        }        
    },1000);


    function showData(str)
    {
        
        
        let msg = document.createElement("li");
        msg.setAttribute("class","msg");
        msg.appendChild(document.createTextNode(str));
        chatlist.appendChild(msg);
        let hr = document.createElement("hr");  
        chatlist.appendChild(hr);
        
            var chatHistory = document.getElementById("scroll");
            chatHistory.scrollTo(-1, chatHistory.scrollHeight);
         
    }


