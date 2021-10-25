def ping(freq: number, message: str):
    music.set_volume(255)
    music.play_tone(freq, music.beat(BeatFraction.HALF))
    music.rest(music.beat(BeatFraction.SIXTEENTH))
    music.set_volume(128)
    music.play_tone(freq, music.beat(BeatFraction.HALF))
    music.rest(music.beat(BeatFraction.SIXTEENTH))
    music.set_volume(64)
    music.play_tone(freq, music.beat(BeatFraction.HALF))
    radio.send_string(message)
    return message

def on_button_pressed_a():
    ping(1050, "ping")
    basic.show_leds("""
        . . . # .
                . . . # .
                . . . . .
                . . . . .
                . . . . .
    """)
input.on_button_pressed(Button.A, on_button_pressed_a)

def initv2():
    music.set_built_in_speaker_enabled(True)
    music.play_tone(988, music.beat(BeatFraction.SIXTEENTH))

def on_received_string(receivedString):
    if receivedString == "ping":
        control.wait_micros(1000 * randint(0, 1000))
        ping(1000, "pong")
radio.on_received_string(on_received_string)

basic.show_leds("""
    # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
""")
radio.set_group(1)

def on_forever():
    pass
basic.forever(on_forever)
