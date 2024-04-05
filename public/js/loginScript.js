window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("errorMsg").innerText = "";
    const submitBtn = document.getElementById("submit");

    if (submitBtn) {
        submitBtn.addEventListener("click", async (e) =>{
            e.preventDefault();
            let mail = document.getElementById("mail").value;
            let pass = document.getElementById("pass").value;
            let remember = document.getElementById("rememberMe").checked;
            console.log(remember);
            if(mail == "" || pass == "")
                document.getElementById("errorMsg").innerText = "Error: Please fill out all text fields";
            else{
                try {
                    console.log('verifying user...');
                    var loginUser = {
                        "username": mail,
                        "email": mail,
                        "password": pass,
                        "remember": remember
                    };
    
                    let profileJstring = JSON.stringify(loginUser);
    
                    const response = await fetch('/login', {
                        method: 'POST',
                        body: profileJstring,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    var foundcurr = {
                        "username" : mail,
                    }

                    let currUser = JSON.stringify(foundcurr)

                    const response2 = await fetch('/getuser', {
                        method: 'POST',
                        body: currUser,
                        headers: {
                            'Content-Type' : 'application/json'
                        }
                    })


                } catch (err) {
                    console.error(err);
                }
            }
        });
    }
    else
        console.log("loljk");
});