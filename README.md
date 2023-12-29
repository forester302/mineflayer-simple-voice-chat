<h1 align="center">mineflayer-simple-voice-chat</h1>

# Features
 - Send any soundfile through the queue using **FFMPEG**
 - Uses protodef to define the protocol
 - Queue system for soundfiles

# Getting Started
### Installation
1) put mineflayer-simple-voice-chat into your project folder

### Simple Sound Player
A bot that plays a sound file on connecting to voice chat
```js
const mineflayer = require('mineflayer');
const simple_voice_chat = require('./mineflayer-simple-voice-chat')

let bot = mineflayer.createBot({
	host: 'localhost'
});

bot.loadPlugin(simple_voice_chat.plugin)

bot.on("audio_player_initialised", () => {
	bot.simple_voice_chat.AudioPlayer.enQueue("music.mp3")
})
```

### Listening to sounds
```js
bot.on("voicechat_sound", (data) => {

})
```

# Contributors
 - Forester302 - Made the plugin

#### Based off of [mineflayer-plasmovoice](https://github.com/Maks-gaming/mineflayer-plasmovoice) (but done my way)
