function quieting(x1: number, y1: number, x2: number, y2: number) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2
}
function ping(freq: number, message: string) {
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
function relativeDirectionSpeed(v1: number, d1: number, x1: number, y1: number, v2: number, d2: number, x2: number, y2: number) {
    let targetDirection = 0
    angle = Math.atan2(y2 - y1, x2 - x1)
    ev1 = v1 * Math.cos(targetDirection - d1)
    ev2 = v2 * Math.cos(targetDirection - d2)
    return [ev1 - ev2, angle]
}
input.onButtonPressed(Button.A, function () {
    radio.sendString("" + (`p:${Math.round(x)}:${Math.round(y)}:${Math.round(speed)}:${direction}`))
})
function coordinates(d: number) {
    for (let coordinate of directionals) {
        if (d > coordinate[0]) {
            return coordinate[1]
        }
    }
    return [2, 1]
}
function draw() {
    led.plot(2, 3)
}
function sound(fx: number, fy: number, freq: number) {
    music.setVolume(255 - quieting(x, y, fx, fy))
    music.playTone(freq, music.beat(BeatFraction.Whole))
}
function initv2() {
    music.setBuiltInSpeakerEnabled(true)
    init()
}
function toFixed(n:number):number {
    return Math.trunc(n*10) / 10.0
}
function init() {
    radio.setGroup(1)
    game.score()
    x = randint(0, 20)
    y = randint(0, 20)
    music.playTone(988, music.beat(BeatFraction.Sixteenth))
    draw()
}
radio.onReceivedString(function (receivedString) {
    serial.writeString(`inbound: ${receivedString}\n`)
    messages = receivedString.split(":")
    if (messages[0] == "p") {
        ping(1000, "g")
    }
    let xsound = parseFloat(messages[1])
    let ysound = parseFloat(messages[2])
    ssound = parseFloat(messages[3])
    asound = parseFloat(messages[4])
    if (messages[0] == "t") {
        sound(xsound, ysound, 160)
    }
    if (messages[0] == "m") {
        sound(xsound, ysound, 110)
    }
    let rdirection: number
    let rspeed: number
    [rspeed, rdirection] = relativeDirectionSpeed(speed, direction, x, y, ssound, asound, xsound, ysound)
    showDirection(rdirection)
})
input.onButtonPressed(Button.B, function () {
    if (ttime == 0) {
        ttime = 30
        tdirection = direction
        tx = x
        ty = y
    }
})
function showDirection(angle: number) {
    [rx, ry] = directionTo(angle)
    led.plot(rx, ry)
    music.playTone(1000, music.beat(BeatFraction.Sixteenth))
    led.unplot(rx, ry)
}
function directionTo(angle: number) {
    for (let entry of directionals) {
        if (angle > entry[0]) {
            return [entry[1], entry[2]]
        }
    }
    return [2, 1]
}
function debugSendString(message: string) {
    serial.writeString(`outbound: ${message}\n`)
    radio.sendString(message)
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
let direction = 0
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
        debugSendString("" + (`t:${Math.round(tx)}:${Math.round(ty)}:${Math.round(tspeed)}:${tdirection}`))
        sound(tx, ty, 160)
    } else {
        control.waitMicros(200000)
    }
    control.waitMicros(500000)
    speed = (0 - input.acceleration(Dimension.Y)) / 256.0
    direction += input.acceleration(Dimension.X) / 10240
    x += speed * Math.cos(direction)
    y += speed * Math.sin(direction)
    if (speed > 0.5 || speed < -0.5) {
        debugSendString("" + (`m:${Math.round(x)}:${Math.round(y)}:${Math.round(speed)}:${direction}`))
    }
})
