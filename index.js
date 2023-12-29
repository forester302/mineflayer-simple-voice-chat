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

bot.on("chat", (username, message) => {
	if (username != bot.username) 
		bot.chat(message)
		switch(message.split(" ")[0]) {
			case ("stop"):
				bot.simple_voice_chat.AudioPlayer.stop()
				break
			case ("pause"):
				bot.simple_voice_chat.AudioPlayer.pause()
				break
			case ("play"):
				bot.simple_voice_chat.AudioPlayer.play()
				break
			case ("skip"):
				bot.simple_voice_chat.AudioPlayer.skip()
				break
			case ("loop"):
				bot.simple_voice_chat.AudioPlayer.setQueueLoop(message.split(" ")[1] == "on")
				break
			case ("join"):
				message = message.replace("join ", "")
				message = message.split(" pass:")
				if (message.length == 2) {
					groupname = message[0].replace("group:", "")
					password = message[1]
				}
				else {
					groupname = message[0].replace("group:", "")
					password = undefined
				}
				bot.simple_voice_chat.joinGroupName(groupname, password)
				break
			case ("leave"):
				bot.simple_voice_chat.leaveGroup()
				break
			default:
				bot.simple_voice_chat.AudioPlayer.enQueue(message)
		}
	}
)