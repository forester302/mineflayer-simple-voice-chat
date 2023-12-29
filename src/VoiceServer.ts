import * as dgram  from 'dgram';
import { Bot } from 'mineflayer';
import PacketManager from './PacketManager';

//types
import { secret_packet } from './data/types';
import { SVC_OBJ } from './simple_voice_chat';

export default class VoiceServer {

	MAGIC_NUMBER = 255

	bot: Bot;

	host: string;
	port: number;
	playerUUID: string;

	secret: Buffer;
	
	udpSocket = dgram.createSocket('udp4');

	connected = false;

	init(bot: Bot, data: secret_packet) {
		this.udpSocket.on("error", (err) => { throw new Error(`Failed to connect  to UDP server: ${err}`); })
		this.udpSocket.on("close", () => { console.log("UDP Connection closed")})
		this.udpSocket.on("message", this.handler.bind(this));

		this.bot = bot
		this.playerUUID = data.playerUUID
		this.host = data.voiceHost.length > 0 ? new URL("voicechat://" + data.voiceHost).host : bot._client.socket.remoteAddress
		this.port = data.voiceHost.length > 0 ? parseInt(new URL(this.host).port) : data.serverPort
		
		this.secret = data.secret
		SVC_OBJ.PacketManager.secret = this.secret

		this.send(SVC_OBJ.PacketManager.createPacket("packet", {
			"id": "AuthenticatePacket",
			"data": {
				"playerUUID": this.playerUUID,
				"secret": this.secret
			}
		}))
	}

	private async handler(msg: Buffer, _: dgram.RemoteInfo) {
		const network_message = SVC_OBJ.PacketManager.parsePacket("client_network_message", msg);
		if (network_message.data.magic_number != this.MAGIC_NUMBER) {return}
		const payload = SVC_OBJ.PacketManager.decrypt(network_message.data.payload)
		const packet = SVC_OBJ.PacketManager.parsePacket("packet", payload)
		this.bot._client.emit(`SVC_${packet.data.id.replace("Packet", "")}`, (packet.data.data))
	}

	send(payload: Buffer) {
		const enc_payload = SVC_OBJ.PacketManager.encrypt(payload)
		const network_message = SVC_OBJ.PacketManager.createPacket("server_network_message", {
			"magic_number": this.MAGIC_NUMBER,
			"playerUUID": this.playerUUID,
			"payload": enc_payload
		})
		this.udpSocket.send(network_message, this.port, this.host)
	}
}