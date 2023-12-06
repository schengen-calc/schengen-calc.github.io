// import {addDays, formatDate} from "./utils.js"

var slider = document.getElementById("myRange")
var minDate = document.getElementById("min")
var maxDate = document.getElementById("max")

var startStay = document.getElementsByClassName("startStay")
var endStay = document.getElementsByClassName("endStay")

var todayDate = document.getElementById("todayLabel")
var start = document.getElementById("startDateLabel")
var end = document.getElementById("endDateLabel")
var totalPeriod = document.getElementById("totalPeriodLabel")
var daysCount = document.getElementById("countLabel")

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf())
    date.setUTCDate(date.getUTCDate() + days)
    return date
}


// Get a default chart palette 
const chartPalette = JSC.getPalette();

const today = new Date()

// Initial termDays
var termDays = [
    {
        name: 'Short-stay term',
        pattern: {
            date_range: [
                formatDate(today),
                formatDate(today.addDays(180)),
            ]
        }
    }
]


var touristDays = 0


slider.min = new Date(today).setUTCDate(today.getUTCDate() - 250)
slider.max = new Date(today).setUTCDate(today.getUTCDate() + 150)
slider.step = 1000 * 3600 * 24

window.onload = function () {
    slider.value = today.valueOf()
    startStay[0].min = formatDate(new Date(today).setUTCDate(today.getUTCDate() - 250))
    startStay[0].max = formatDate(new Date(today).setUTCDate(today.getUTCDate() + 150))
    endStay[0].min = formatDate(new Date(today).setUTCDate(today.getUTCDate() - 250))
    endStay[0].max = formatDate(new Date(today).setUTCDate(today.getUTCDate() + 150))

}

todayDate.innerHTML = formatDate(today)
minDate.innerHTML = formatDate(slider.min)
maxDate.innerHTML = formatDate(slider.max)

var startDate = new Date(parseInt(slider.value))
var stays = []
var staysDays = listDays(stays)


start.innerHTML = formatDate(startDate)
end.innerHTML = formatDate(startDate.addDays(180))

slider.oninput = function () {
    var startDate = new Date(parseInt(this.value))
    var endDate = startDate.addDays(180)
    touristDays = countDaysInRange(staysDays, startDate, endDate)
    start.innerHTML = formatDate(startDate)
    end.innerHTML = formatDate(endDate)
    totalPeriod.innerHTML = (endDate - startDate) / (1000 * 3600 * 24)
    daysCount.innerHTML = touristDays
    termDays[0].pattern.date_range = [formatDate(startDate), formatDate(endDate)]
}

// Event listener for desktop
slider.onclick = function () {
    makeShortTermDays(initChart);
}

// Event listener for mobile
slider.ontouchend = function () {
    makeShortTermDays(initChart)
}

function updateStays() {
    var startStays = document.getElementsByClassName("startStay")
    var endStays = document.getElementsByClassName("endStay")
    stays = []

    for (i in startStays) {
        stays.push(
            {
                opacity: 1,
                visible: true,
                pattern: {
                    date_range: [
                        startStays[i].value,
                        endStays[i].value
                    ]
                }
            }
        )
    }
    for (i in stays) {
        stays[i].color = chartPalette[i]
    }

    staysDays = listDays(stays)

    makeShortTermDays(initChart)
}


function addStayComponent() {

    let stay = document.createElement("div")
    let startLabel = document.createElement("label")
    startLabel.textContent = "Start date: "
    let startDateElement = document.createElement("input")
    startDateElement.type = "date"
    startDateElement.setAttribute("onchange", "updateStays()")
    startDateElement.classList.add("startStay")

    let endLabel = document.createElement("label")
    endLabel.textContent = " End date: "
    let endDateElement = document.createElement("input")
    endDateElement.type = "date"
    endDateElement.setAttribute("onchange", "updateStays()")
    endDateElement.classList.add("endStay")

    let removeButton = document.createElement('button')
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



var chartConfig = {
    debug: true,
    type: 'calendar year solid',
    calendar_range: ['2023-01-01', '2023-12-31'],
    annotations: [
        {
            label_text: '<b>Vacation Days 2023</b>',
            position: 'top'
        }
    ],
    yAxis_label: {
        text: '2023',
        style_fontSize: 25
    },
    defaultSeries: {
        shape_innerPadding: 0,
        legendEntry_visible: false,
        defaultPoint: {
            fill: '#aaa',
            outline_color: '#fff',
            outline_width: 2,
            opacity: 0.5,
        }
    }
}

var chartConfig2 = {
    debug: true,
    type: 'calendar year solid',
    calendar_range: ['2024-01-01', '2024-12-31'],
    annotations: [
        {
            label_text: '<b>Vacation Days 2024</b>',
            position: 'top'
        }
    ],
    yAxis_label: {
        text: '2024',
        style_fontSize: 25
    },
    defaultSeries: {
        shape_innerPadding: 0,
        legendEntry_visible: false,
        defaultPoint: {
            fill: '#aaa',
            outline_color: '#fff',
            outline_width: 2,
            opacity: 0.5,
        }
    }
}


// Initialize the charts
var chart
var chart2

makeShortTermDays(initChart)


function initChart(holidayPoints) {
    chartConfig.series = [
        { points: holidayPoints }
    ]
    chart = JSC.chart(
        'chartDiv',
        chartConfig,
        function (c) {
            showAll(stays, c)
        }
    )
    chartConfig2.series = [
        { points: holidayPoints }
    ]
    chart2 = JSC.chart(
        'chartDiv2',
        chartConfig2,
        function (c) {
            showAll(stays, c)
        }
    )
}

function showAll(stays, chartRef) {
    for (i in stays) {
        showDays(i, chartRef)
    }
}


function showDays(i, chartRef) {
    var id = 'id-' + i,
        config = stays[i]
    var c = chartRef || chart
    var highlight = c.highlights(id)
    config.id = id;
    config.outline = {
        dashStyle: 'solid',
        color: '#000',
        width: 2
    };
    // config.tooltip = '<b>%name</b> ' + config.name

    if (!highlight) {
        c.highlights.add(config);
    }
    // Restore legend entry color 
    // c.legends(0)
    //     .entries('lid-' + i)
    //     .options({ color: 'red' });
}


function makeShortTermDays(callback) {

    var holidayPoints = termDays.map(function (
        item
    ) {
        if (touristDays > 90) {
            fillColor = 'red'
        } else {
            fillColor = 'green'
        }
        
        return {
            date: item.pattern,
            fill: fillColor,
            opacity: 0.2,
            outline: {
                dashStyle: 'solid',
                color: fillColor,
                width: 2,
            },
            tooltip: '<b>%name</b> ' // + item.name
        }
    });
    callback(holidayPoints);
}





/**
 * ToDo: Move following functions to a 'utils' module
 */


/**
 * 
 * @param {*} stays 
 * @returns 
 */
function listDays(stays) {
    var dateArray = []
    for (i in stays) {
        if (stays[i].pattern.date_range[0] && stays[i].pattern.date_range[1]) {
            dateArray = dateArray.concat(
                dateRange(stays[i].pattern.date_range[0], stays[i].pattern.date_range[1])
            )
        }
    }
    return [...new Set(dateArray)]
}


function dateRange(startDate, endDate, steps = 1) {
    const dateArray = []
    let currentDate = new Date(startDate)
    while (currentDate <= new Date(endDate)) {
        dateArray.push(formatDate(new Date(currentDate)))
        // Use UTC date to prevent problems with time zones and DST
        currentDate.setUTCDate(currentDate.getUTCDate() + steps)
    }
    return dateArray
}

/**
 * 
 * @param {*} dateList 
 * @param {*} startDate 
 * @param {*} endDate 
 * @returns 
 */
function countDaysInRange(dateList, startDate, endDate) {
    var count = 0
    dateList.forEach(
        function (date) {
            var dateObject = new Date(date)       
            if (new Date(startDate) <= dateObject && dateObject <= new Date(endDate)) {
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