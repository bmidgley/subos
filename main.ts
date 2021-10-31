function tsound (fx: number, fy: number) {
    music.setVolume(255 - Math.pow(distance(x, y, fx, fy), 2))
    music.playTone(110, music.beat(BeatFraction.Whole))
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
    radio.sendString("" + (`${message}:${x}:${y}:${direction}:${speed}`))
    return message
}
input.onButtonPressed(Button.A, function () {
    ping(1050, "ping")
})
function draw () {
    led.plot(2, 3)
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
function distance (x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}
radio.onReceivedString(function (receivedString) {
    messages = receivedString.split(":")
    if (messages[0] == "ping") {
        control.waitMicros(1000 * randint(0, 1000))
        ping(1000, "pong")
    }
    if (messages[0] == "torpedo") {
        tsound(+messages[1], +messages[2])
    }
})
input.onButtonPressed(Button.B, function () {
    if (ttime == 0) {
        ttime = 30
        tdirection = direction
        tx = x
        ty = y
    }
})
let messages: string[] = []
let ty = 0
let tx = 0
let tdirection = 0
let x = 0
let y = 0
let direction = 0
let speed = 0
let tspeed = 1.7
let ttime = 0
init()
basic.forever(function () {
    control.waitMicros(500000)
    if (ttime > 0) {
        ttime += 0 - 1
        tx += tspeed * Math.cos(tdirection)
        ty += tspeed * Math.sin(tdirection)
        radio.sendString("" + (`torpedo:${tx}:${ty}:${tdirection}:${ttime}`))
        tsound(tx, ty)
    }
    control.waitMicros(500000)
    speed = -input.acceleration(Dimension.Y)/1024
    direction += input.acceleration(Dimension.X)/1024
    x += speed * Math.cos(direction)
    y += speed * Math.sin(direction)
    radio.sendString("" + (`move:${x}:${y}:${direction}:${speed}`))
})
