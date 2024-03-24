function quieting(x1: number, y1: number, x2: number, y2: number) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2
}
function relativeDirectionSpeed(v1: number, d1: number, x1: number, y1: number, v2: number, d2: number, x2: number, y2: number) {
    let targetDirection = Math.atan2(y2 - y1, x2 - x1)
    let ev1 = v1 * Math.cos(targetDirection - d1)
    let ev2 = v2 * Math.cos(targetDirection - d2)
    return [targetDirection - d1, ev1 - ev2]
}
function directionTo(angle: number) {
    let directionals = [
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
    while (angle > pi) angle -= twopi
    while (angle < -pi) angle += twopi
    for (let entry of directionals) {
        if (angle > entry[0]) {
            return [entry[1], entry[2]]
        }
    }
    return [2, 1]
}
function sound(fx: number, fy: number, freq: number) {
    music.setVolume(255 - quieting(x, y, fx, fy))
    music.playTone(freq, music.beat(BeatFraction.Whole))
}
function showDirection(xsound: number, ysound: number, angle: number, obj: string) {
    let ry: number
    let rx: number
    [rx, ry] = directionTo(angle)
    serial.writeString(control.deviceSerialNumber() + (` plot ${rx},${ry} for direction ${angle}\n`))
    led.plot(rx, ry)
    if (obj == "t") {
        sound(xsound, ysound, 160)
    }
    if (obj == "s") {
        sound(xsound, ysound, 110)
    }
    if (obj == "p") {
        sound(xsound, ysound, 1000)
    }
    if (obj == "g") {
        sound(xsound, ysound, 1100)
    }
    led.unplot(rx, ry)
}
function draw() {
    basic.clearScreen()
    led.plot(2, 3)
}
function debugMessage(value: string, direction: string) {
    serial.writeString(`${direction}:${value}\n`)
}
function debugSendString(obj: string, x: number, y: number, speed: number, direction: number) {
    let message = `${obj}:${Math.round(x)}:${Math.round(y)}:${Math.round(speed)}:${direction}`
    //debugMessage(message, "sent")
    radio.sendString(message)
}
function plotMine(mine: number[]) {
    let dx = mine[0] - x
    let dy = mine[1] - y
    let px = 2 + Math.round(dx * Math.sin(direction) + dy * Math.cos(direction))
    let py = 3 - Math.round(dx * Math.cos(direction) - dy * Math.sin(direction))
    led.plot(px, py)
}
function broadcastMine(mine: number[]) {
    plotMine(mine)
    debugSendString("m", mine[0], mine[1], 0, 0)
}
input.onButtonPressed(Button.A, function () {
    debugSendString("p", x, y, speed, direction)
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
radio.onReceivedString(function (message) {
    let ssound
    let asound
    let xsound
    let ysound
    let messages = message.split(":")
    if (messages[0] == "p") {
        music.rest(music.beat(BeatFraction.Sixteenth))
        music.setVolume(128)
        music.playTone(1100, music.beat(BeatFraction.Half))
        debugSendString("g", x, y, speed, direction)
    }
    xsound = parseFloat(messages[1])
    ysound = parseFloat(messages[2])
    ssound = parseFloat(messages[3])
    asound = parseFloat(messages[4])
    if (messages[0] == "m") {
        plotMine([xsound, ysound])
        return
    }
    let rdirection: number
    let rspeed: number
    [rdirection, rspeed] = relativeDirectionSpeed(speed, direction, x, y, ssound, asound, xsound, ysound)
    showDirection(xsound, ysound, rdirection, messages[0])
})
function init() {
    gridsize = 50
    tspeed = 1.7
    direction = 0
    radio.setGroup(1)
    for (let i = 0; i < gridsize; i++) { grid.push([]) }

    x = gridsize / 2
    y = gridsize / 2

    for (let mx = 0; mx < gridsize; mx += 3)
        for (let my = 0; my < gridsize; my += 3)
            mines.push([mx, my])

    music.playTone(788, music.beat(BeatFraction.Sixteenth))
}
let pi = Math.PI
let twopi = pi * 2
let fpi = pi / 36
let ttime = 0
let grid: number[][] = []
let mines: number[][] = []
let gridsize: number
let x: number
let y: number
let direction: number
let speed: number
let tx: number
let ty: number
let tdirection: number
let tspeed: number
init()
basic.forever(function () {
    control.waitMicros(500000)
    mines.forEach(mine => broadcastMine(mine))
    if (ttime > 0) {
        ttime += 0 - 1
        tx += tspeed * Math.cos(tdirection)
        ty += tspeed * Math.sin(tdirection)
        debugSendString("t", tx, ty, tspeed, tdirection)
        sound(tx, ty, 160)
    } else {
        control.waitMicros(200000)
    }
    speed = (0 - input.acceleration(Dimension.Y)) / 128
    direction += 0 - input.acceleration(Dimension.X) / 4096
    x += speed * Math.cos(direction) / 16
    y += speed * Math.sin(direction) / 16
    if (speed > 4)
        debugSendString("s", x, y, speed, direction)
    draw()
    debugMessage(`${direction/twopi}`, "turned")
})
