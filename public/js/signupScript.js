window.addEventListener("DOMContentLoaded", (event) => {
    const submitBtn = document.getElementById("submit");
    
    if (submitBtn) {
        submitBtn.addEventListener("click", async (e) =>{
            e.preventDefault();

            document.getElementById("errorMsg").innerText = "";
            let mail = document.getElementById("mail").value;
            let pass = document.getElementById("pass").value;
            let conf = document.getElementById("passConf").value;
            let splitmail = mail.split("@");
            let usertype;

            if(mail == "" || pass == "" || conf == ""){
                document.getElementById("errorMsg").innerText = "Error: Please fill out all text fields";
            }
            else if(!mail.endsWith("@dlsu.edu.ph") || (!splitmail[0].includes("_") && !splitmail[0].includes("."))){
                document.getElementById("errorMsg").innerText = "Error: Email format is incorrect";
                document.getElementById("mail").value = '';
                document.getElementById("pass").value = '';
                document.getElementById("passConf").value = '';
            }
            else if(pass.localeCompare(conf) != 0){
                document.getElementById("errorMsg").innerText = "Error: Password and confirm password do not match";
                document.getElementById("pass").value = '';
                document.getElementById("passConf").value = '';
            }
            else
            try {
                if(mail.includes("_"))
                    usertype = 'S';
                else
                    usertype = 'F';
                console.log('adding user...');
                var signupUser = {
                    "username": mail,
                    "desc": 'default',
                    "pfp_link": '',
                    "user_type": usertype,
                    "email": mail,
                    "password": pass,
                    "remember": 0,
                    "session": ''
                };

                let profileJstring = JSON.stringify(signupUser);

                const response = await fetch('/signup', {
                    method: 'POST',
                    body: profileJstring,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                    
                if(response.status === 200)
                    window.location.href="/login";
                else
                document.getElementById("errorMsg").innerText = "Error: User already exists";
            } catch (err) {
                console.error(err);
            }
        });
    }
    else
        console.log("lol pain");
});