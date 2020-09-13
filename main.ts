let lasttriggertime = 0
let lastreportime = 0
let currenttime = 0
let hashitminlightlevel = false
let currentlightreading = 0
let oneminuteinmilliseconds = 60000
let minlightvalue = 5
let maxlightvalue = 7
serial.writeLine("ready to start")
while (true) {
    // get current reading then devide value by a number that brings it into single digits, in our case % 100 this makes it easier to detect high and low light values as there are fewer steps in light level available
    currentlightreading = Math.idiv(pins.analogReadPin(AnalogPin.P0), 100)
    // uncomment line below to calibrate min and max light values but be sure to comment out again before trying to calculate RPM serial.writeValue("light reading", currentlightreading) check if light has dimmed to lowest value BUT has been to the highest value first this reduces / elimenates false positive readings
    if (currentlightreading == minlightvalue && hashitminlightlevel == false) {
        hashitminlightlevel = true
        currenttime = input.runningTime()
        if (currenttime - lastreportime > 1000) {
            // write our result at most once per second otherwise serial.write slows down the reading of the light sensor too much
            lastreportime = currenttime
            serial.writeValue("RPM", calculateCurrentRPM(lasttriggertime, currenttime))
        }
        lasttriggertime = currenttime
    }
    // check if light has reached highest value and if so reset hashitminlightlevel ready for  detection of next lowest light value
    if (currentlightreading == maxlightvalue) {
        hashitminlightlevel = false
    }
}
function calculateCurrentRPM(lasteventtime: number, currenteventtime: number) {
    // work out the time between the last two low light levels events
    // and assuming spinner has 3 arms so three low levels events per revolution
    return (oneminuteinmilliseconds / ((currenteventtime - lasteventtime) * 3));
}
