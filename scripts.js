// import {addDays, formatDate} from "./utils.js"

var slider = document.getElementById("myRange")
var minDate = document.getElementById("min")
var maxDate = document.getElementById("max")
var startStay = document.getElementById("startStay")
var endStay = document.getElementById("endStay")

var todayDate = document.getElementById("todayLabel")
var start = document.getElementById("startDateLabel")
var end = document.getElementById("endDateLabel")
var totalPeriod = document.getElementById("totalPeriodLabel")
var daysCount = document.getElementById("countLabel")

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf())
    date.setUTCDate(date.getUTCDate() + days)
    return date
}



const today = new Date()

slider.value = today.valueOf()
slider.min = new Date(today).setUTCDate(today.getUTCDate() - 250)
slider.max = new Date(today).setUTCDate(today.getUTCDate() + 150)
slider.step = 1000 * 3600 * 24
window.onload = function() {
    startStay.min = formatDate(new Date(today).setUTCDate(today.getUTCDate() - 250))
    startStay.max = formatDate(new Date(today).setUTCDate(today.getUTCDate() + 150))
    endStay.min = formatDate(new Date(today).setUTCDate(today.getUTCDate() - 250))
    endStay.max = formatDate(new Date(today).setUTCDate(today.getUTCDate() + 150))

}

todayDate.innerHTML = formatDate(today)
minDate.innerHTML = formatDate(slider.min)
maxDate.innerHTML = formatDate(slider.max)

var startDate = new Date(parseInt(slider.value))

start.innerHTML = formatDate(startDate)
end.innerHTML = formatDate(startDate.addDays(180))

slider.oninput = function() {
    var startDate = new Date(parseInt(this.value))
    var endDate = startDate.addDays(180)
    start.innerHTML = formatDate(startDate)
    end.innerHTML = formatDate(endDate)
    totalPeriod.innerHTML = (endDate - startDate)/(1000 * 3600 * 24)
    daysCount.innerHTML = countDays(listDays(stays), startDate, endDate)
}

var stays = []

function updateStays() {
    var startStays = document.getElementsByClassName("startStay")
    var endStays = document.getElementsByClassName("endStay")

    let stays_ = []
    console.log(stays_)
    for (i in startStays) {
        console.log(i)
        // stays_.push(
        //     {
        //         start: startStays[i].value,
        //         end: endStays[i].value
        //     }
        // )
    }
    console.log(stays_)
    stays = stays_
}





function addStay() {

    let stay = document.createElement("div")
    let startLabel = document.createElement("label")
    startLabel.textContent = "Start date: "
    let startDateElement = document.createElement("input")
    startDateElement.type = "date"
    startDateElement.setAttribute("onchange", "updateStays()")
    startDateElement.classList.add("startStay")

    let endLabel = document.createElement("label")
    endLabel.textContent = "End date: "
    let endDateElement = document.createElement("input")
    endDateElement.type = "date"
    endDateElement.setAttribute("onchange", "updateStays()")
    endDateElement.classList.add("endStay")

    let removeButton = document.createElement('button');
    removeButton.textContent = "Remove stay"
    removeButton.addEventListener("click", () => {
        stay.remove()
        updateStays()
    })

    startDateElement.min = formatDate(new Date(today).setUTCDate(today.getUTCDate() - 250))
    startDateElement.max = formatDate(new Date(today).setUTCDate(today.getUTCDate() + 150))
    endDateElement.min = formatDate(new Date(today).setUTCDate(today.getUTCDate() - 250))
    endDateElement.max = formatDate(new Date(today).setUTCDate(today.getUTCDate() + 150))

    stay.appendChild(startLabel)
    stay.appendChild(startDateElement)
    stay.appendChild(endLabel)
    stay.appendChild(endDateElement)
    stay.appendChild(removeButton)

    document.getElementById("stays-container").appendChild(stay)

}





/**
 * ToDo: Move following functions to a 'utils' module
 */


function listDays(stays) {
    var dateArray = []
    for (i in stays) {
        // console.log(stays[i].start)
        dateArray = dateArray.concat(dateRange(stays[i].start, stays[i].end))
    }
    return dateArray
}


function dateRange(startDate, endDate, steps=1) {
    const dateArray = []
    let currentDate = new Date(startDate)

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate))
        // Use UTC date to prevent problems with time zones and DST
        currentDate.setUTCDate(currentDate.getUTCDate() + steps)
    }
    return dateArray
}


function countDays(listDays, range1, range2) {
    var count = 0
    listDays.forEach(
        function(range) {
            if (new Date(range1) <= range && range <= new Date(range2)) {
                // console.log(range)
                count++
            }
        }
    )
    return count
}


/**
 * Format a given date to yyyy-mm-dd string
 * @param {Date | Integer | String} date 
 * @returns a yyyy-mm-dd string formated date
 */
function formatDate(date) {
    if (date instanceof Date) {
        return date.toISOString().slice(0, 10)
    } else {
        return new Date(parseInt(date)).toISOString().slice(0, 10)
    }
}