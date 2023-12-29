import { Bot } from "mineflayer";
import { SVC_Data, SVC_OBJ, init } from "./simple_voice_chat";
import VoiceServer from "./VoiceServer";
import PacketManager from "./PacketManager";
import { Sound } from "./data/types";
import AudioPlayer from "./AudioPlayer";

export function plugin(bot: Bot) {
    // @ts-ignore
	bot.simple_voice_chat = {}
	init(bot)

    bot.simple_voice_chat.sendUDP = (payload: Buffer) => {
        SVC_OBJ.VoiceServer.send(payload)
    }
    bot.simple_voice_chat.sendPCM = (pcm: Buffer, whispering = false) => {
        bot.simple_voice_chat.sendUDP(SVC_OBJ.PacketManager.protoDef.createPacketBuffer("packet", {
            "id": "MicPacket",
            "data": {
                "data": pcm,
                "sequencenumber": process.hrtime.bigint(),
                "whispering": whispering
            }
        }))
    }
    bot.simple_voice_chat.protodef = SVC_OBJ.PacketManager.protoDef
    bot.simple_voice_chat.data = SVC_Data
    bot.simple_voice_chat.AudioPlayer = SVC_OBJ.AudioPlayer
}

interface SimpleVoiceChat {
    sendUDP(payload: Buffer);
    sendPCM(payload: Buffer);
    protodef;
    data: SVC_Data;
    AudioPlayer: AudioPlayer
}

declare module 'mineflayer' {
    interface Bot {
        simple_voice_chat: SimpleVoiceChat
    }
    interface BotEvents {
        voicechat_connected
        voicechat_sound: Sound

        audio_player_initialised
        audioplayer_song_start
        audioplayer_song_end
        audioplayer_stop
        audioplayer_pause
        audioplayer_play
        audioplayer_skip
        audioplayer_enqueue
    }
}
