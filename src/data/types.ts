export interface secret_packet {
	secret: Buffer;
	serverPort: number;
	playerUUID: string;
	codec: number;
	mtuSize: number;
	voiceChatDistance: number;
	keepAlive: number;
	groupsEnabled: boolean;
	voiceHost: string;
	allowRecording: boolean;
}

export interface player_state_packet {
	player_state: player_state
}

export interface player_states_packet {
	player_states: Array<player_state>
}

export interface add_group_packet {
	group: Group
}

export interface remove_group_packet {
	uuid: Buffer
}

export interface player_state {
	disabled: boolean;
	disconnected: boolean;
	uuid: Buffer;
	name: string;
	group: Buffer | undefined;
}

export interface Group {
	id: Buffer;
	name: String;
	hasPassword: boolean;
	persistent: boolean;
	type: string;
}

export interface Sound {
	sender: Buffer;
	data: Buffer;
	sequencenumber: bigint;
	category: string | undefined;

	whispering: string | undefined
	distance: number | undefined
	location: {x:number, y:number, z:number} | undefined
}