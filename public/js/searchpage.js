document.addEventListener('DOMContentLoaded', function() {
    const submitInfo = document.querySelector('#submitInfo')
    // const myForm = document.forms.mySearch


    submitInfo.addEventListener('click', (e) => {
    e.preventDefault()
    // const submitData = new FormData(myForm)
    const room = document.getElementById("rooms_select").value
    const date = document.getElementById("date_select").value
    let data = {}
    console.log(room)
    const currDate = new Date()
    const selectedDate = new Date(date)
    
    console.log(currDate)
    console.log(selectedDate)
    if( currDate < selectedDate || currDate.toDateString() === selectedDate.toDateString() ){
    // for(let entry of submitData){
    //     data[entry[0]] = entry[1]
    // }
        if(room === ""){
            alert("Error: Invalid room")
        }else{
            data[0] = room
            data[1] = date
    
            const response = fetch('/labpage/post-search-data', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type' : 'application/json'
                }
            })
            
            response.then((res)=>{
                console.log(res)
                return res.json
            }).then((json)=>{
                console.log(json)
                console.log("sucessfully sent search data")
            }).catch((err)=>{
                console.error(err)
            })
            
            window.location.href='/labpage?room=' + encodeURIComponent(room) + "&date=" + encodeURIComponent(date) 
        }
    
    }else{
        alert("Error: Date has passed, Select a different date")
    }
    })
})