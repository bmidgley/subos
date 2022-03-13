function quieting (x1: number, y1: number, x2: number, y2: number) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2
}
function toFixed (n: number) {
    return Math.trunc(n * 10) / 10
}
function relativeDirectionSpeed (v1: number, d1: number, x1: number, y1: number, v2: number, d2: number, x2: number, y2: number) {
    let targetDirection = 0
    angle = Math.atan2(y2 - y1, x2 - x1)
    ev1 = v1 * Math.cos(targetDirection - d1)
    ev2 = v2 * Math.cos(targetDirection - d2)
    return [angle, ev1 - ev2]
}
function directionTo (angle: number) {
    for (let entry of directionals) {
        if (angle > entry[0]) {
            return [entry[1], entry[2]]
        }
    }
    return [2, 1]
}
function draw () {
    basic.clearScreen()
    led.plot(2, 3)
}
function sound (fx: number, fy: number, freq: number) {
    music.setVolume(255 - quieting(x, y, fx, fy))
    music.playTone(freq, music.beat(BeatFraction.Whole))
}
function debugSendString (message: string) {
    serial.writeString("" + (`outbound: ${message}\n`))
    radio.sendString(message)
}
function init () {
    radio.setGroup(1)
    x = randint(0, gridsize)
    y = randint(0, gridsize)
    for (let index = 0; index < 3; index++) {
        mines.push([randint(0, gridsize), randint(0, gridsize)])
    }
    music.playTone(788, music.beat(BeatFraction.Sixteenth))
    //mines = [[4, 3]]
}
radio.onReceivedString(function (receivedString) {
    serial.writeString("" + (`inbound: ${receivedString}\n`))
    messages = receivedString.split(":")
    if (messages[0] == "p") {
        music.rest(music.beat(BeatFraction.Sixteenth))
        music.setVolume(128)
        music.playTone(1100, music.beat(BeatFraction.Half))
        debugSendString("" + (`g:${Math.round(x)}:${Math.round(y)}:${Math.round(speed)}:${direction}`))
    }
    xsound = parseFloat(messages[1])
    ysound = parseFloat(messages[2])
    ssound = parseFloat(messages[3])
    asound = parseFloat(messages[4])
    if (messages[0] == "t") {
        sound(xsound, ysound, 160)
    }
    if (messages[0] == "s") {
        //sound(xsound, ysound, 110)
    }
    if (messages[0] == "m") {
        plotMine([xsound, ysound])
return
    }
    let rdirection: number
let rspeed: number
    [rdirection, rspeed] = relativeDirectionSpeed(speed, direction, x, y, ssound, asound, xsound, ysound)
showDirection(rdirection)
})
input.onButtonPressed(Button.A, function () {
    debugSendString("" + (`p:${Math.round(x)}:${Math.round(y)}:${Math.round(speed)}:${direction}`))    
    music.setVolume(255)
    music.playTone(1000, music.beat(BeatFraction.Half))
})
input.onButtonPressed(Button.B, function () {
    if (ttime == 0) {
        ttime = 30
        tdirection = direction
        tx = x
        ty = y
    }
})
function showDirection (angle: number) {
    [rx, ry] = directionTo(angle)
led.plot(rx, ry)
    //music.playTone(1000, music.beat(BeatFraction.Sixteenth))
    led.unplot(rx, ry)
}
let ttime = 0
let messages: string[] = []
let ev2 = 0
let ev1 = 0
let directionals: number[][] = []
let gridsize = 0
let ysound = 0
let xsound = 0
let mines: number[][] = []
let direction = 0
let speed = 0
let y = 0
let x = 0
let tdirection = 0
let tx = 0
let ty = 0
let angle = 0
let asound = 0
let ssound = 0
let rx = 0
let ry = 0
function plotMine(mine: number[]) {
    let dx = mine[0] - x
    let dy = mine[1] - y
    let px = 2 + Math.round(dx * Math.sin(direction) + dy * Math.cos(direction))
    let py = 3 - Math.round(dx * Math.cos(direction) + dy * Math.sin(direction))
    //serial.writeString("" + (`plot: ${Math.round(x)},${Math.round(y)}@${direction}: ${mine[0]},${mine[1]} -> ${px},${py}\n`))
    led.plot(px, py) // 1, 2
}
function broadcastMine(mine: number[]) {
    plotMine(mine)
}
let tspeed = 1.7
let twopi = Math.PI * 2
let pi = Math.PI
let fpi = Math.PI / 36
gridsize = 50
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
    speed = (0 - input.acceleration(Dimension.Y)) / 128
    direction += 0 - input.acceleration(Dimension.X) / 4096
    if (direction > pi) {
        direction += 0 - twopi
    }
    if (direction < 0 - pi) {
        direction += twopi
    }
    x += speed * Math.cos(direction) / 16
    y += speed * Math.sin(direction) / 16
    if (x < 0) {
        x = 0
    }
    if (y < 0) {
        y = 0
    }
    if (x > gridsize) {
        x = gridsize
    }
    if (y > gridsize) {
        y = gridsize
    }
    debugSendString("" + (`s:${Math.round(x)}:${Math.round(y)}:${Math.round(speed)}:${direction}`))
    draw()
    mines.forEach(mine => broadcastMine(mine))
})
