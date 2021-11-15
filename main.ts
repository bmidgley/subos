function quieting (x1: number, y1: number, x2: number, y2: number) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2
}
function ping (freq: number, message: string) {
    music.setVolume(255)
    music.playTone(freq, music.beat(BeatFraction.Half))
    music.rest(music.beat(BeatFraction.Sixteenth))
    music.setVolume(128)
    music.playTone(freq, music.beat(BeatFraction.Half))
    music.rest(music.beat(BeatFraction.Sixteenth))
    music.setVolume(64)
    music.playTone(freq, music.beat(BeatFraction.Half))
    return message
}
function relativeDirectionSpeed (d1: number, v1: number, x1: number, y1: number, d2: number, v2: number, x2: number, y2: number) {
    let direction = 0
    angle = Math.atan2(y2 - y1, x2 - x1)
    ev1 = v1 * Math.cos(direction - d1)
    ev2 = v2 * Math.cos(direction - d2)
    return [angle, ev1 - ev2]
}
input.onButtonPressed(Button.A, function () {
    radio.sendString("" + (`ping:${x}:${y}:${direction2}:${speed}`))
})
function coordinates (d: number) {
    for (let coordinate of directionals) {
        if (d > coordinate[0]) {
            return coordinate[1]
        }
    }
    return [2, 1]
}
function draw () {
    led.plot(2, 3)
}
function sound (fx: number, fy: number, freq: number) {
    music.setVolume(255 - quieting(x, y, fx, fy))
    music.playTone(freq, music.beat(BeatFraction.Whole))
}
function initv2 () {
    music.setBuiltInSpeakerEnabled(true)
    init()
}
function init () {
    radio.setGroup(1)
    game.score()
x = randint(0, 100)
    y = randint(0, 100)
    music.playTone(988, music.beat(BeatFraction.Sixteenth))
    draw()
}
radio.onReceivedString(function (receivedString) {
    messages = receivedString.split(":")
    if (messages[0] == "ping") {
        control.waitMicros(1000 * randint(0, 1000))
        ping(1000, "pong")
    }
    let xsound = parseInt(messages[1], 10)
let ysound = parseInt(messages[2], 10)
asound = parseFloat(messages[3])
    ssound = parseFloat(messages[4])
    if (messages[0] == "torpedo") {
        sound(xsound, ysound, 160)
    }
    if (messages[0] == "move") {
        sound(xsound, ysound, 110)
    }
    let rdirection: number
let rspeed: number
[rdirection, rspeed] = relativeDirectionSpeed(direction2, speed, x, y, 0, 0, xsound, ysound)
showDirection(rdirection)
})
input.onButtonPressed(Button.B, function () {
    if (ttime == 0) {
        ttime = 30
        tdirection = direction2
        tx = x
        ty = y
    }
})
function showDirection (angle: number) {
    for (let entry of directionals) {
        if (angle > entry[0]) {
            rx = entry[1]
            ry = entry[2]
        }
    }
    led.plot(rx, ry)
    music.playTone(1000, music.beat(BeatFraction.Sixteenth))
    led.unplot(rx, ry)
}
let ry = 0
let rx = 0
let ttime = 0
let ssound = 0
let asound = 0
let ev2 = 0
let ev1 = 0
let angle = 0
let directionals: number[][] = []
let directions: number[] = []
let messages: string[] = []
let ty = 0
let tx = 0
let tdirection = 0
let x = 0
let y = 0
let speed = 0
let direction2 = 0
let tspeed = 1.7
let fpi = Math.PI / 36
directionals = [
[fpi * 33, 0, 3],
[fpi * 29, 0, 2],
[fpi * 26, 0, 1],
[fpi * 23, 0, 0],
[fpi * 20, 1, 0],
[fpi * 16, 2, 0],
[fpi * 13, 3, 0],
[fpi * 10, 4, 0],
[fpi * 7, 4, 1],
[fpi * 3, 4, 2],
[fpi * -3, 4, 3],
[fpi * -7, 4, 4],
[fpi * -13, 3, 4],
[fpi * -23, 2, 4],
[fpi * -29, 1, 4],
[fpi * -33, 0, 4],
[fpi * -37, 0, 3]
]
init()
basic.forever(function () {
    control.waitMicros(500000)
    if (ttime > 0) {
        ttime += 0 - 1
        tx += tspeed * Math.cos(tdirection)
        ty += tspeed * Math.sin(tdirection)
        radio.sendString("" + (`torpedo:${tx}:${ty}:${tdirection}:${tspeed}`))
        sound(tx, ty, 160)
    } else {
        control.waitMicros(200000)
    }
    control.waitMicros(500000)
    speed = (0 - input.acceleration(Dimension.Y)) / 1024
    direction2 += input.acceleration(Dimension.X) / 1024
    x += speed * Math.cos(direction2)
    y += speed * Math.sin(direction2)
    if (speed > 0.5 || speed < -0.5) {
        radio.sendString("" + (`move:${x}:${y}:${direction2}:${speed}`))
    }
})
