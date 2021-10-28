function ping (freq: number, message: string) {
    music.setVolume(255)
    music.playTone(freq, music.beat(BeatFraction.Half))
    music.rest(music.beat(BeatFraction.Sixteenth))
    music.setVolume(128)
    music.playTone(freq, music.beat(BeatFraction.Half))
    music.rest(music.beat(BeatFraction.Sixteenth))
    music.setVolume(64)
    music.playTone(freq, music.beat(BeatFraction.Half))
    radio.sendString("" + (`${message}:${x}:${y}`))
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
    x = randint(0, 100)
    y = randint(0, 100)
    game.score()
music.playTone(988, music.beat(BeatFraction.Sixteenth))
    draw()
}
radio.onReceivedString(function (receivedString) {
    messages = receivedString.split(":")
    if (messages[0] == "ping") {
        control.waitMicros(1000 * randint(0, 1000))
        ping(1000, "pong")
    }
})
let messages: string[] = []
let messages2 = ""
let x = 0
let y = 0
init()
basic.forever(function () {
	
})
