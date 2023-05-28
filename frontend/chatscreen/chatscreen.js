const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
let chatlist = document.getElementById("chatlist");




window.addEventListener("DOMContentLoaded", (event) => {  
    event.preventDefault();
    let flag = localStorage.getItem("loggedIn");
    
    if(flag=="true"){
        let msg = "Select a group to start chatting";
        
        showData(msg);
        getGroups();
       
         document.getElementById("form").style.visibility = "hidden";
            
        
    }
    else{
        window.location.href = "../login/login.html";
    }
});



window.addEventListener("submit", (event)=>{
     if(event.target.className==="form" && event.target.id==="form"){
         event.preventDefault();
         let message=document.getElementById("message").value;
         if(message=="")
         {
             alert("Please enter message");
         }
         else
         {
             sendMessage(message);
            
           }
     }
   });
     
 
   window.addEventListener("submit", (event)=>{
    if(event.target.className==="form1" && event.target.id==="form1"){
    event.preventDefault();
    let groupName= document.getElementById("name").value;
    if(groupName=="")
    {alert("Please enter group name");}
    else{            
    let groupNameObj={groupName:groupName};
    createGroup(groupNameObj);
    
}
    }
});




     async function createGroup(obj)
     { try{
       let created=  await axios.post("http://localhost:3000/group/create",obj, config);
       
       if(created)
       {   

           let groupList =document.getElementById("grouplist");
           let li = document.createElement("li");
           let btn=document.createElement("groupName");
           btn.setAttribute("type","button");
           btn.setAttribute("id",created.data.groupCreated.id);
           btn.setAttribute("class","btn");
           btn.appendChild(document.createTextNode(created.data.groupCreated.groupName));
           groupList.appendChild(btn);
           localStorage.setItem("groupId",created.data.groupCreated.id); 
           groupId=created.data.groupCreated.id;
           document.getElementById("form").style.visibility = "visible"; 
       }
     }
     catch(err){

        alert(err.message);
     }

     }


     async function getGroups(){
       try{
           const groups = await axios.get("http://localhost:3000/group/grouplist", config);
           if(groups)
           {
               for(let i=0;i<groups.data.length;i++)
               {
                let groupList =document.getElementById("grouplist");
                let li = document.createElement("li");
                let btn=document.createElement("groupName");
                btn.setAttribute("type","button");
                btn.setAttribute("id",groups.data[i].groupId);
                btn.setAttribute("class","btn");
                btn.appendChild(document.createTextNode(groups.data[i].groupName));
                groupList.appendChild(btn);
     
               }
       }
    }
       catch(err){
           alert(err.message);
       }
     }



     window.addEventListener("click", (event) => {
        if (event.target.className === "btn") {
          let list = document.getElementById("chatlist");  
          while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
          }
          
          event.preventDefault();

          let groupId = event.target.getAttribute("id");
          let groupName = event.target.innerHTML;
          localStorage.setItem("groupId", groupId);
          document.getElementById("form").style.visibility = "visible";
          let h4=document.getElementById("group-name-tag");
          h4.innerHTML=groupName;
          isAdmin();
          getMessage(groupId);
          
        }
      });



      window.addEventListener("click", (event) => {
        if (event.target.className == "gsbtn") {
         window.location.href='/groupSettings/groupsettings.html'; 
        }
      });




      async function isAdmin(){
        try{
            let groupId = localStorage.getItem("groupId");
            let res=  await axios.get("http://localhost:3000/chat/admin/"+groupId, config);
            if(res)
            {
                let adminFlag = res.data.isAdmin;
                localStorage.setItem("adminFlag", adminFlag);
                if(adminFlag==false)
                {document.getElementById("gsbtn").style.visibility="hidden";}
            }
            else
            {
                alert("something went wrong, please try again");
            }
        }
        catch(e){
            alert(e);
        }
      }

   
      async function sendMessage(message)
      {try{
        let obj={message:message};
        let groupId=localStorage.getItem("groupId");
        let send=  await axios.post("http://localhost:3000/chat/message/"+groupId,obj, config);
        if(send)
        {
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


    async function getMessage(gid){
       try{   
            let message = await axios.get("http://localhost:3000/chat/message/"+gid, config);
            if (message)
                {       
                    for(let i=0;i<message.data.messages.length;i++){
                        let str= `${message.data.messages[i].userName} : ${message.data.messages[i].message}`;
                        showData(str);
                    } 
                    let id=message.data.messages[message.data.messages.length-1].id;
                    localStorage.setItem("lastMessageId",id);  
                }
            }
        catch(err){

            alert(err.message);
         
        }    
    }  


    let getNewMessage = setInterval(async()=>{
        try{
                let id = localStorage.getItem("lastMessageId");
                let groupId = localStorage.getItem("groupId");
                
                if(id!=null && groupId!=null){
                let chatMessages = await axios.get("http://localhost:3000/chat/message/"+groupId+"/"+id, config);
                
                if(chatMessages)
                {   
                    if(chatMessages.data.messages.length>0){
                    let newId= chatMessages.data.messages[chatMessages.data.messages.length-1].id;
                    localStorage.setItem("lastMessageId",newId);
                    }
                    for(let i=0;i<chatMessages.data.messages.length;i++)
                    {   
                        let str= `${chatMessages.data.messages[i].userName} : ${chatMessages.data.messages[i].message}`;
                        
                        showData(str);
                        
                    }    
                }
                
                
                
                return;
            
            
            }
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


