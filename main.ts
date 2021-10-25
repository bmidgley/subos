function ping (freq: number, message: string) {
    music.setVolume(255)
    music.playTone(freq, music.beat(BeatFraction.Half))
    music.rest(music.beat(BeatFraction.Sixteenth))
    music.setVolume(128)
    music.playTone(freq, music.beat(BeatFraction.Half))
    music.rest(music.beat(BeatFraction.Sixteenth))
    music.setVolume(64)
    music.playTone(freq, music.beat(BeatFraction.Half))
    radio.sendString(message)
    return message
}
input.onButtonPressed(Button.A, function () {
    ping(1050, "ping")
    basic.showLeds(`
        . . . # .
        . . . # .
        . . . . .
        . . . . .
        . . . . .
        `)
})
function initv2 () {
    music.setBuiltInSpeakerEnabled(true)
    music.playTone(988, music.beat(BeatFraction.Sixteenth))
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "ping") {
        control.waitMicros(1000 * randint(0, 1000))
        ping(1000, "pong")
    }
})
basic.showLeds(`
    # . . . #
    . # . # .
    . . # . .
    . # . # .
    # . . . #
    `)
radio.setGroup(1)
basic.forever(function () {
	
})
