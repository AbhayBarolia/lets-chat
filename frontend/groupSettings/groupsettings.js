const config={headers:{'Content-Type':'application/JSON',Authorization:localStorage.getItem('token')}};
let memberlist = document.getElementById("memberlist");




window.addEventListener("DOMContentLoaded", (event) => {  
    event.preventDefault();
    let flag = localStorage.getItem("loggedIn");
    
    if(flag=="true"){
        
        getMembers();    
        
    }
    else{
        window.location.href = "../login/login.html";
    }
});





window.addEventListener("submit", (event)=>{
    if(event.target.className==="form" && event.target.id==="form"){
    event.preventDefault();
    let userNumber = document.getElementById("mnumber").value;
    let obj ={mnumber:userNumber};
    addMember(obj);
    }
});




window.addEventListener("click", (event)=>{
    if(event.target.className==="rembtn"){
    event.preventDefault();
    let li=event.target.parentElement;
    let mno = li.getAttribute("id");
    removeMember(mno);
    }
});




window.addEventListener("click", (event)=>{
    if(event.target.className==="admbtn"){
    event.preventDefault();
    let li=event.target.parentElement;
    let mno = li.getAttribute("id");
    makeAdmin(mno);
    }
});



async function getMembers(){
    try{   
        let gid = localStorage.getItem("groupId");
        let members = await axios.get("http://localhost:3000/groupsettings/members/"+gid, config);
        if (members)
            {       
                for(let i=0;i<members.data.userData.length;i++){
                    let str= `${members.data.userData[i].userName}   ${members.data.userData[i].mnumber}`;
                    showData(str,members.data.userData[i].mnumber);
                } 
            }
        }
    catch(err){

        alert(err.message);
     
    }    
}



async function addMember(obj){
    try{
        gid = localStorage.getItem("groupId");
        let res = await axios.post("http://localhost:3000/groupsettings/addmember/"+gid, obj);
        if(res.status==200)
        {
            alert("User added");
            let str= res.data.userData;
            showData(str,obj.mnumber);
            
        }
        if(res.status==201)
        {
            alert("User already present");
        }
        
    }
    catch(err){

        alert(err.response.data.message);
    }
};



async function removeMember(mno){
    try{
        let gid = localStorage.getItem("groupId");
        let res= await axios.delete("http://localhost:3000/groupsettings/deletemember/"+gid+"/"+mno);
        if(res.status==200){ 
        window.location.reload();
        }
        else{
            alert("Something went wrong, please try again");
        } 
    }
    catch(err){
        alert(err.message);
    }
}


async function makeAdmin(mno){
    try{
        let gid = localStorage.getItem("groupId");
        let res= await axios.put("http://localhost:3000/groupsettings/makeadmin/"+gid+"/"+mno);
        if(res.status==200){ 
        alert("Member is now Admin");
        }
        if(res.status==201){
            alert("Member is already Admin");
        }
        else{
            alert("Something went wrong, please try again");
         
        } 
    }
    catch(err){
        alert(err.message);
    }
}



function showData(str,mno)
{
    let usr = document.createElement("li");
    usr.setAttribute("class","usr");
    usr.setAttribute("id",mno);
    usr.appendChild(document.createTextNode(str));
    
    let btn = document.createElement("button");
    btn.setAttribute("class","rembtn");
    btn.setAttribute("type","button");
    btn.appendChild(document.createTextNode("Remove"));

    let btn1 = document.createElement("button");
    btn1.setAttribute("class","admbtn");
    btn1.setAttribute("type","button");
    btn1.appendChild(document.createTextNode("Admin"));
    
    let hr = document.createElement("hr"); 

    usr.appendChild(btn1);
    usr.appendChild(btn);
    usr.appendChild(hr);

    memberlist.appendChild(usr);
    
   


    
}