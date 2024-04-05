window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("errorMsg").innerText = "";
    const submitBtn = document.getElementById("submit");

    if (submitBtn) {
        submitBtn.addEventListener("click", async (e) =>{
            e.preventDefault();

            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            window.location.href="/";
        });
    }
    else
        console.log("loljk");
});