def ping(freq: number, message: str):
    music.set_volume(255)
    music.play_tone(freq, music.beat(BeatFraction.HALF))
    music.rest(music.beat(BeatFraction.SIXTEENTH))
    music.set_volume(128)
    music.play_tone(freq, music.beat(BeatFraction.HALF))
    music.rest(music.beat(BeatFraction.SIXTEENTH))
    music.set_volume(64)
    music.play_tone(freq, music.beat(BeatFraction.HALF))
    radio.send_string("" + message + ":" + ("" + str(x)) + ":" + ("" + str(y)))
    return message

def on_button_pressed_a():
    ping(1050, "ping")
input.on_button_pressed(Button.A, on_button_pressed_a)

def draw():
    led.plot(2, 3)
def initv2():
    music.set_built_in_speaker_enabled(True)
    init()
def init():
    global x, y
    radio.set_group(1)
    x = randint(0, 100)
    y = randint(0, 100)
    game.score()
    music.play_tone(988, music.beat(BeatFraction.SIXTEENTH))
    draw()

def on_received_string(receivedString):
    global messages
    messages = receivedString.split(":")
    if messages[0] == "ping":
        control.wait_micros(1000 * randint(0, 1000))
        ping(1000, "pong")
radio.on_received_string(on_received_string)

messages: List[str] = []
y = 0
x = 0
messages2 = ""
init()

def on_forever():
    pass
basic.forever(on_forever)
