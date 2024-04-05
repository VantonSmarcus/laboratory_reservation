/**
 * To Do: 
 * 1.) Need to implement a get function and create dynamic dates for user options on date
 * 2.) Display the available options to the user screen
 */

const { Router } = require('express')
const {startOfWeek, endOfWeek, format, addDays} = require('date-fns')

const searchRouter = Router()

searchRouter.get("/", async (req,res) =>{
    //  Get fuction for the DYNAMIC dates
    const currDate = new Date()
    console.log(currDate)
    const start = startOfWeek(currDate, {weekStartsOn: 1})
    const end = endOfWeek(currDate, {weekStartsOn: 0})
    
    const weekDates = []
    let currDay = start 

    while(currDay < end){
        weekDates.push({
            date: format(currDay, 'MMMM dd, yyyy')
        })
        currDay = addDays(currDay, 1)
    }

    res.render('searchpage', {
        week: weekDates
    })
})


module.exports = searchRouter