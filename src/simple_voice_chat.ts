import { Bot } from "mineflayer";

//types
import PacketManager from "./PacketManager";
import VoiceServer from "./VoiceServer";
import { Group, secret_packet, player_state_packet, player_state, player_states_packet, add_group_packet, remove_group_packet, Sound } from "./data/types";
import AudioPlayer from "./AudioPlayer";

export class SVC_Data {
	static groups: Map<Buffer, Group>
	static players: Map<Buffer, player_state>
}

export class SVC_OBJ {
	static PacketManager: PacketManager
	static AudioPlayer: AudioPlayer
	static VoiceServer: VoiceServer = new VoiceServer()
}

export function init(bot: Bot) {
	//Init
	SVC_OBJ.PacketManager = new PacketManager()
	SVC_OBJ.PacketManager.init(bot)
	SVC_OBJ.AudioPlayer = new AudioPlayer()
	SVC_OBJ.AudioPlayer.init(bot)
	SVC_Data.groups = new Map()
	SVC_Data.players = new Map()
	bot.on("spawn", () => {
		bot._client.write("custom_payload", {channel: "voicechat:request_secret", data: SVC_OBJ.PacketManager.createPacket("request_secret", {"version": 18})})
	})

	//Message Channels
	bot._client.on("voicechat:secret", (packet: secret_packet) => {
		SVC_OBJ.VoiceServer = new VoiceServer()
		SVC_OBJ.VoiceServer.init(bot, packet)
	})
	bot._client.on("voicechat:player_state", (packet: player_state_packet) => {
		if (SVC_Data.players.has(packet.player_state.uuid)) {SVC_Data.players.delete(packet.player_state.uuid)}
		if (packet.player_state.disconnected) {return}
		SVC_Data.players.set(packet.player_state.uuid, packet.player_state)
	})
	bot._client.on("voicechat:player_states", (packet: player_states_packet) => {
		SVC_Data.players = new Map()
		for (let player of packet.player_states) {
			if (player.disconnected) {continue}
			SVC_Data.players.set(player.uuid, player)
		}
	})
	bot._client.on("voicechat:add_group", (packet: add_group_packet) => {
		if (SVC_Data.groups.has(packet.group.id)) {SVC_Data.groups.delete(packet.group.id)}
		SVC_Data.groups.set(packet.group.id, packet.group)
	})
	bot._client.on("voicechat:remove_group", (packet: remove_group_packet) => {
		SVC_Data.groups.delete(packet.uuid)
	})


	//UDP Server
	bot._client.on("SVC_AuthenticateAck", (data) => {
		SVC_OBJ.VoiceServer.send(SVC_OBJ.PacketManager.createPacket("packet", {
			"id": "ConnectionCheckPacket",
			"data": {}
		}))
	})
	bot._client.on("SVC_ConnectionCheckAck", (data) => {
		SVC_OBJ.VoiceServer.connected = true;
		bot.emit("voicechat_connected")
	})
	bot._client.on("SVC_Ping", (data) => {
		SVC_OBJ.VoiceServer.send(SVC_OBJ.PacketManager.createPacket("packet", {
			"id": "PingPacket",
			"data": {}
		}))
	})
	bot._client.on("SVC_KeepAlive", (data) => {
		SVC_OBJ.VoiceServer.send(SVC_OBJ.PacketManager.createPacket("packet", {
			"id": "KeepAlivePacket",
			"data": {}
		}))
	})
	bot._client.on("SVC_PlayerSound", (data: Sound) => {
		bot.emit("voicechat_sound", (data))
	})
	bot._client.on("SVC_GroupSound", (data) => {
		bot.emit("voicechat_sound", (data))
	})
	bot._client.on("SVC_LocationSound", (data) => {
		bot.emit("voicechat_sound", (data))
	})
}