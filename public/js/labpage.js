var timetable = ["7:00", "7:30", "8:00", "8:30", "9:00", "9:30",
                 "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
                 "1:00", "1:30", "2:00", "2:30", "3:00", "3:30",
                 "4:00", "4:30", "5:00","5:30" ]

var fetchedSearch, fetchedAppoint, timeStart, timeEnd
var timeCollection = []
var userCollection = []

document.addEventListener("DOMContentLoaded", function(){
try{
fetch('/labpage/fetch-data')
.then(response => {
    if(!response.ok) {
        console.log("Error catching data")
    }
    return response.json()
})
.then(collected =>{
    fetchedSearch = collected.searchReq
    fetchedAppoint = collected.appoint
    userCollection = collected.profiles
    
    timeStart = ""
    timeEnd = ""
    // console.log(fetchedSearch)
    // console.log(fetchedAppoint)
    // console.log(userCollection)

    imageOnClick()
    clickAndDrag()
    confirmTime()
    createAppointment()
})

//End of code
}catch(err){
    console.log("Error something went wrong along the way")
}
})


//---------------------------------------------------------------FUNCTIONS------------------------------------------------------------------------------
async function fetchUsers(){
    try{
        
    }catch(err){
        console.log("Error: Failed to fetch user data from labpage")
    }
}


function imageOnClick(){
//  Function to create the onclick event listener for the computers
    var images = document.querySelectorAll('.computer')
    images.forEach(function(image){
    image.addEventListener('click', function() {
        let popup = document.getElementById("tablepopup")
        let seatname = document.getElementById("seat_id")
        popup.style.visibility = 'visible'
        popup.style.marginTop = '150px'
        createTimeTable(this.id)
        seatname.innerHTML = "Seat Number: "+ parseInt(this.id.substring(3), 10)
        aseat = this.id
    });
    });
}

function createTimeTable( seatid ){
//  Function to create the time table with the appropriate reservations displayed
    var i, data
    var foundAppointments = []
    var appointStatus = false
    var taken

    for( i = 0 ; i < fetchedAppoint.length ; i++){
        //Loop to find appointments with the correct room number, date, and seat
        if( parseInt(fetchedSearch.room, 10) === fetchedAppoint[i].roomNum && fetchedSearch.date === fetchedAppoint[i].date && parseInt(seatid.substring(3), 10) === fetchedAppoint[i].seatNum ){
            foundAppointments.push(fetchedAppoint[i])
            appointStatus = true
        }
    }

    console.log(foundAppointments)

    let row = document.getElementById("selectable")
    data = row.getElementsByTagName('td')

    if(appointStatus){
        for( i = 0 ; i < foundAppointments.length ; i++){
            taken = false
        //  Loop through the found appointments
            for( let j = 0 ; j < data.length ; j++){
                if( timetable[j] === foundAppointments[i].timeStart ){
                    taken = true
                }
                if( timetable[j] === foundAppointments[i].timeEnd ){
                    taken = false
                }
                if( taken ){
                    data[j].classList.toggle('taken')
                    if( foundAppointments[i].anon ){
                        data[j].textContent = "Annonymous"
                        console.log("Found ANON")
                    }else{
                        data[j].textContent = foundAppointments[i].name
                        console.log("Found "+foundAppointments[i].name)
                    }
                }
            }
        }

    }
}

// async function fetchData(){
// //  Function to get the Appointment (and possibly user?) Data 
//     try{
//         const response = await fetch('/appoint/fetch-search-data')

//         const data = await response.json()
//         fetchedSearch = await data

//     }catch(err){
//         console.log("Error fetching search req data")
//     }

//     try{    
//         const response2 = await fetch('/appoint/fetch-appoint-data')

//         const data2 = await response2.json()
//         fetchedAppoint = await data2

//     }catch(err){
//         console.log("Error fetching appointments data")
//     }
// }

function clickAndDrag(){
//  Function to apply the click and drag feature on the time table
//  Source: https://stackoverflow.com/questions/2013902/select-cells-on-a-table-by-dragging

    var isMouseDown = false,
        isHighlighted;
    $("#selectable td")
    .mousedown(function () {
        if( !($(this).hasClass("taken")) ){
            isMouseDown = true;
            $(this).toggleClass("highlighted");
            isHighlighted = $(this).hasClass("highlighted");
            refreshTime()
        }else{
            reserveeCheck($(this).index())
        }
        return false; // prevent text selection
    })
    .mouseover(function () {
        if( !($(this).hasClass("taken")) ){
            if (isMouseDown) {
                $(this).toggleClass("highlighted", isHighlighted);
                refreshTime()
            }
        }
    })
    .bind("selectstart", function () {
        return false;
    })

    $(document)
    .mouseup(function () {
        isMouseDown = false;
    });
}

function refreshTime(){
//Description:  This function will display the selected time in the time table
    let highlighted = document.querySelectorAll('.highlighted')
    let timeDisplay = document.getElementById('selectedTimeDisplay')
    
    if(highlighted.length === 1){
        timeDisplay.innerHTML = 'Selected time is from '+ timeHelperStart(highlighted[0].id) + ' to ' + timeHelperEnd(highlighted[0].id) 
    }else if(highlighted.length > 1 ){
        timeDisplay.innerHTML = 'Selected time is from '+ timeHelperStart(highlighted[0].id) + ' to ' + timeHelperEnd(highlighted[highlighted.length - 1].id) 
    }else{
        timeDisplay.innerHTML = 'Selected time is from --:-- to --:--'
    }
}

function reserveeCheck( timeindex ){
    let timeDisplay = document.getElementById('selectedTimeDisplay')
    const a = document.createElement('a')

    let row = document.getElementById("selectable")
    data = row.getElementsByTagName('td')

    let text = data[timeindex].textContent
    if(text === "Annonymous"){
        timeDisplay.innerHTML = "Reservee: "+ text
    }else{
        for(let i = 0 ; i < userCollection.length; i++){
            if( text === userCollection[i].username ){
                a.href = '/profile/profile/'+userCollection[i]._id
                a.innerHTML = text
                timeDisplay.innerHTML = "Reservee: "
                timeDisplay.appendChild(a)
            }   
        }
    }
}


function confirmTime(){
//  Function to apply the event listener for time confirmation
    let button

    button = document.getElementById('confirm_button')
    time = document.querySelectorAll(".highlighted")

    button.addEventListener('click', function(){
        let highlighted = document.querySelectorAll('.highlighted')
        let detailsTimeDisplay = document.getElementById('time_slot')

        if(highlighted.length === 1){
            detailsTimeDisplay.innerHTML = 'Time: ' + timeHelperStart(highlighted[0].id) + ' to ' + timeHelperEnd(highlighted[0].id) 

            timeStart = timeHelperStart(highlighted[0].id)
            timeEnd = timeHelperEnd(highlighted[0].id)

            for(let i = 0 ; i < highlighted.length ; i++){
                temp = timeHelperStart(highlighted[i].id)
                timeCollection.push(temp)
            }
        }else if(highlighted.length > 1 ){
            detailsTimeDisplay.innerHTML = 'Time: '+ timeHelperStart(highlighted[0].id) + ' to ' + timeHelperEnd(highlighted[highlighted.length - 1].id) 

            timeStart = timeHelperStart(highlighted[0].id)
            timeEnd = timeHelperEnd(highlighted[highlighted.length - 1].id)

            for(let i = 0 ; i < highlighted.length ; i++){
                temp = timeHelperStart(highlighted[i].id)
                timeCollection.push(temp)
            }
        }else{
            detailsTimeDisplay.innerHTML = 'Time: --:--'
        }
        closeDown(false)
    })
}

function closeDown( depends ){
//Description:  This function will close the popup time table, as well as reset the classes of the table data for the next use
    let row, i
    let popup = document.getElementById("tablepopup")
    popup.style.visibility = 'hidden'
    popup.style.marginTop = '-700px'
        
    row = document.getElementById('selectable')
    cell = row.getElementsByTagName('td')
    for( i = 0 ; i < cell.length ; i++ ){
        cell[i].classList.remove('highlighted')
        cell[i].classList.remove('taken')
    }

    document.getElementById('selectedTimeDisplay').innerHTML = 'Selected time is from --:-- to --:--'

    if(depends){
        document.getElementById('seat_id').innerHTML = 'Seat Number: ----'
    }
}

function timeHelperStart(text){
//Description:  This function serves to help the refresh time as the start-range
    switch(text){
        case "time7":
            return "7:00"
        case "time730":
            return "7:30"
        case "time8":
            return "8:00"
        case "time830":
            return "8:30"
        case "time9":
            return "9:00" 
        case "time930":
            return "9:30"
        case "time10":
            return "10:00"
        case "time1030":
            return "10:30"
        case "time11":
            return "11:00"
        case "time1130":
            return "11:30"
        case "time12":
            return "12:00"
        case "time1230":
            return "12:30"
        case "time1":
            return "1:00"
        case "time130":
            return "1:30"
        case "time2":
            return "2:00"
        case "time230":
                return "2:30"
        case "time3":
                return "3:00"
        case "time330":
            return "3:30"
        case "time4":
            return "4:00"
        case "time430":
            return "4:30"
        case "time5":
            return "5:00"
        case "time530":
            return "5:30"
        default:
            return null
    }
}
            
function timeHelperEnd(text){
//Description:  This function serves to help the refresh time as the end-range
    switch(text){
        case "time7":
            return "7:30"
        case "time730":
            return "8:00"
        case "time8":
            return "8:30"
        case "time830":
            return "9:00"
        case "time9":
            return "9:30" 
        case "time930":
            return "10:00"
        case "time10":
            return "10:30"
        case "time1030":
            return "11:00"
        case "time11":
            return "11:30"
        case "time1130":
            return "12:00"
        case "time12":
            return "12:30"
        case "time1230":
            return "1:00"
        case "time1":
            return "1:30"
        case "time130":
            return "2:00"
        case "time2":
            return "2:30"
        case "time230":
            return "3:00"
        case "time3":
            return "3:30"
        case "time330":
            return "4:00"
        case "time4":
            return "4:30"
        case "time430":
            return "5:00"
        case "time5":
            return "5:30"
        case "time530":
            return "6:00"
        default:
            return null
    }
}

async function createAppointment(){
    let button = document.getElementById('claim_button')
    button.addEventListener('click', async function(){
        //  Initialize the fields

        let seatNum = document.getElementById('seat_id')
        seatNum = parseInt(seatNum.textContent.substring(13), 10)
        let anon = document.getElementById('annoncheck')

        if( anon.checked ){
            anon = true
        }else{
            anon = false
        }
        
        // console.log(seatNum)
        // console.log(timeStart)
        // console.log(timeEnd)
        // console.log(anon)
        // console.log(fetchedSearch)

        //  Create the object for post

        const myObj ={
            roomNum: fetchedSearch.room,
            date: fetchedSearch.date,
            seatNum: seatNum,
            timeStart: timeStart,
            timeEnd: timeEnd,
            name: fetchedSearch.user,
            anon: anon
        }
        console.log(myObj)

        try{
            const response = await fetch('/labpage/create-appointment', {
                method: 'POST',
                body: JSON.stringify(myObj),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(response)
            if(response.status === 200){
                location.reload()
            }else{
                alert("ERROR: Please input all fields")
            }
            
        }catch(err){
            console.log("ERROR: Failed to create appointment")
        }
        

    })
}