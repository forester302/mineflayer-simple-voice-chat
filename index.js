const mineflayer = require('mineflayer');
const simple_voice_chat = require('./mineflayer-simple-voice-chat')

let bot = mineflayer.createBot({
	host: '168.119.111.130',
	port: 19140,
	auth: "offline"
});

bot.loadPlugin(simple_voice_chat.plugin)

bot.on("audio_player_initialised", () => {
	bot.simple_voice_chat.AudioPlayer.enQueue("song2.mp3")
})