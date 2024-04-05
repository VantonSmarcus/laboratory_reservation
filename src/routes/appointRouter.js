/**
 * To Do:
 * 1.) Need to make a function that gets the requested room and date from the search website DONE
 * 2.) Need to make a get function on the array of appointments DONE
 */

const { Router } = require('express')
const appointRouter = Router()
const session = require('express-session');
const {isPast, isToday} = require('date-fns')

const Appointment = require('../models/Appointment.js')

var foundroom, founddate, founduser

// appointRouter.use(session({
//     secret: 'lmao guess',
//     resave: false,
//     saveUninitialized: false,
// }));

appointRouter.post('/post-search-data', async(req,res) =>{
//  Function to get the fields for the search request (Room number, Date, and username)
    try{    

        const currUserProfile = await fetch('http://localhost:3000/currUser')
        const curruser = await currUserProfile

        console.log("FOUND CURRENT USER: ", curruser)

        foundroom = req.body[0]
        founddate = req.body[1]
        founduser = curruser
        
        console.log(founduser)

        // console.log(req.session.user)
        // res.send(req.session.user)

        console.log("Data received successfully")
        
    }catch(err) {
        console.log("Error: Unable to find Form field data")
    }
})  

appointRouter.get('/fetch-data', async(req,res) =>{
//  Retrieves the appointment data 
    updateData()

    const searchReq = {
        room: foundroom,
        date: founddate,
        user: founduser,
    }

    const appoint = await Appointment.find({}).lean().exec()

    const searchProfiles = await fetch('http:localhost:3000/profile/profile')

    const profiles = await searchProfiles.json()

    
    // console.log(profiles)

    //const appoints = []
    res.send({searchReq, appoint, profiles})
})

//USE TO GET APPOINTMENTS DATA
appointRouter.get('/fetch-appoint-data', async(req,res) =>{
    updateData()
    const appoint = await Appointment.find({}).lean().exec()
    res.send(appoint)
    console.log(appoint)
})

// appointRouter.get('/appoint/fetch-appoint-data', async(req,res)=>{
//     const appoint = await Appointment.find({}).lean().exec()
//     res.send(appoint)
// })

appointRouter.post('/create-appointment', async(req,res)=>{
//  Creates the appointment from the user
    try{
        const create = await Appointment.create({
            roomNum: req.body.roomNum,
            date: req.body.date,
            seatNum: req.body.seatNum,
            timeStart: req.body.timeStart,
            timeEnd: req.body.timeEnd,
            name: req.body.name,
            anon: req.body.anon
        })

        console.log(create)
        updateData()
        res.sendStatus(200)
    }catch(err){
        console.log("ERROR: Server side failed to create appointment")
        res.sendStatus(500)
    }
})

async function updateData(){
    try{
        const appoints = await Appointment.find()

        for( const appoint of appoints ){
            if(isPast(appoint.date) && !isToday(appoint.date)){
                await Appointment.deleteOne({_id: appoint._id})
                console.log("Deleted appointment: ${appoint}")
            }
        }

        console.log("Success: Update finished")
    }catch(err){
        console.log("Error updating database: ", err)
    }
}

// function createsampledata(){
//     const result = Appointment.create({
//         roomNum: "321",
//         date: "March 13",
//         seatNum: 5,
//         timeStart: "9:00",
//         timeEnd: "10:00",
//         name: "GiancarloFlores",
//         anon: false
//     })
// }

module.exports = appointRouter