//import crypto from "crypto";
import { ProtoDef } from "protodef";
import * as crypto from "crypto";

// Types
import { Bot } from "mineflayer";
import { Client } from "minecraft-protocol";
import protocol from "./data/protocol";

export default class PacketManager {
	bot: Bot;
	protoDef = new ProtoDef(false);
	
	secret: Buffer;
	
	async init(bot: Bot) {
		this.bot = bot;

		this.protoDef.addProtocol(protocol, ["channels"])
		this.protoDef.addProtocol(protocol, ["udp"])
		this.protoDef.addTypes(protocol.types)

		this.bot.on("login", async () => {
			this.registerChannels(this.bot._client)
			this.registerTypes(this.bot._client)
		})
	}

	async init_udp() {

	}

	private async registerChannels(client: Client) {
		client.registerChannel("voicechat:secret", this.protoDef.types.secret, true);
		client.registerChannel("voicechat:player_state", this.protoDef.types.player_state, true);
		client.registerChannel("voicechat:player_states", this.protoDef.types.player_states, true);
		client.registerChannel("voicechat:add_group", this.protoDef.types.add_group, true);
		client.registerChannel("voicechat:remove_group", this.protoDef.types.remove_group, true);
	}

	// Is there a better way to do this?
	private async registerTypes(client: Client) {
        for (const [key, value] of Object.entries(this.protoDef.types)) {
            client.registerChannel(key, value);
        }
    }

	parsePacket(packet_type: string, packet: Buffer) {
		return this.protoDef.parsePacketBuffer(packet_type, packet)
	}

	createPacket(packet_type: string, packet: {}): Buffer {
		return this.protoDef.createPacketBuffer(packet_type, packet)
	}

	public encrypt(data: Buffer): Buffer {
		const iv = crypto.randomBytes(16);
			
		const cipher = crypto.createCipheriv('aes-128-cbc', this.secret, iv);
		const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
	
		return Buffer.concat([iv, encrypted]);
	  }
	
	public decrypt(payloadArray: Array<number>): Buffer {
		const payload = Buffer.from(payloadArray)
		const iv = payload.subarray(0, 16);
		const encryptedData = payload.subarray(16, payload.length);
		const decipher = crypto.createDecipheriv('aes-128-cbc', this.secret, iv);
		const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
		return decryptedData;
	}
}