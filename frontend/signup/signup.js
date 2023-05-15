window.addEventListener("submit", (e)=>{
    if(e.target.className==="form"){
        e.preventDefault();
        let email = document.getElementById("email").value;
        let mnumber= document.getElementById("mnumber").value;
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let password2 = document.getElementById("password2").value;
        if(password!= password2){
            alert("Passwords do not match");
        }
        else if(username == "" || email == "" || mnumber=="" || password == "" || password2 == ""){
            alert("All fields are required");
        }
        else{
            let user = {
                username: username,
                email: email,
                mnumber:mnumber,
                password: password
            }
            createUser(user);
        }
    }
  });





async function createUser(user){
    const res= await axios.post("http://localhost:3000/user/signup",user);   
    alert(res.data.message);
    window.location.replace("/login/login.html");
}