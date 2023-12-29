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
    bot.simple_voice_chat.joinGroup = (group: Buffer, password: string = "") => {
        bot.simple_voice_chat.sendUDP(SVC_OBJ.PacketManager.protoDef.createPacketBuffer("packet", {
            "id": "JoinGroupPacket",
            "data": {
                "group": group,
                "password": password.length > 0 && SVC_Data.groups.get(group).hasPassword ? password : undefined
            } 
        }))
    }
    bot.simple_voice_chat.joinGroupName = (groupname: string, password: string = "") => {
        for (const group of SVC_Data.groups) {
            if (group[1].name == groupname) {
                bot.simple_voice_chat.joinGroup(group[0], group[1].hasPassword ? password : "")
                return
            }
        }
    }
    bot.simple_voice_chat.protodef = SVC_OBJ.PacketManager.protoDef
    bot.simple_voice_chat.data = SVC_Data
    bot.simple_voice_chat.AudioPlayer = SVC_OBJ.AudioPlayer
}

interface SimpleVoiceChat {
    sendUDP(payload: Buffer);
    sendPCM(payload: Buffer);
    joinGroup(group: Buffer, password: string)
    joinGroupName(groupname: string, password: string)
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
