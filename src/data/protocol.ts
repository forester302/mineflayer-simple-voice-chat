export default {
	"types": {
		"varint": "native",
		"pstring": "native",
		"16": "native",
		"i32": "native",
		"u8": "native",
		"u64": "native",
		"f64": "native",
		"bool": "native",
		"string": [
			"pstring",
			{
				"countType": "varint"
			}
		],
		"uuid": [
			"buffer",
			{
				"count": 16
			}
		],
		"byte_array": [
			"array",
			{
				"countType": "varint",
				"type": "u8"
			}
		],
		"icon": [
			"array",
			{
				"count": 16,
				"type": [
					"array",
					{
						"count": 16,
						"type": "i32"
					}
				]
			}
		],
		"player_state_struct": [
			"container",
			[
				{
					"name": "disabled",
					"type": "bool"
				},
				{
					"name": "disconnected", 
					"type": "bool"
				},
				{
					"name": "uuid", 
					"type": "uuid"
				},
				{
					"name": "name", 
					"type": "string"
				},
				{
					"name": "group", 
					"type": 
					[
						"option",
						"uuid"
					]
				}
			]
		],
		"client_group": [
			"container",
			[
				{"name": "id", "type": "uuid"},
				{"name": "name", "type": "string"},
				{"name": "hasPassword", "type": "bool"},
				{"name": "persistent", "type": "bool"},
				{"name": "hidden", "type": "bool"},
				{"name": "type", "type": [
					"mapper",
					{
						"type": "i8",
						"mappings": {
							"0": "normal",
							"1": "open",
							"2": "closed"
						}
					}
				]}
			]
		],
		"volume_category": [
			"container",
			[
				{"name": "id", "type": "string"},
				{"name": "name", "type": "string"},
				{"name": "description", "type": ["option", "string"]},
				{"name": "icon", "type": "icon"}
			]
		]


	},
	"channels": {
		"types": {
			"add_category": [
				"container",
				[
					{
						"name": "category",
						"type": "volume_category"
					}
				]
			],
			"add_group": [
				"container",
				[
					{
						"name": "group",
						"type": "client_group"
					}
				]
			],
			"create_group": [
				"container",
				[
					{"name": "name", "type": "string"},
					{"name": "password", "type": ["option", "string"]},
					{"name": "type", "type": [
						"mapper",
						{
							"type": "i8",
							"mappings": {
								"0": "normal",
								"1": "open",
								"2": "closed"
							}
						}
					]}
				]
			],
			"joined_group": [
				"container",
				[
					{"name": "uuid", "type": ["option", "uuid"]},
					{"name": "wrong_password", "type": "bool"}
				]
			],
			"set_group": [
				"container",
				[
					{
						"name": "uuid",
						"type": "uuid"
					},
					{
						"name": "password",
						"type": [
							"option",
							"string"
						]
					}
				]
			],
			"leave_group": [
				"container",
				[

				]
			],
			"player_state": [
				"container",
				[
					{
						"name": "player_state",
						"type": "player_state_struct"
					}
				]
			],
			"player_states": [
				"container",
				[
					{
						"name": "player_states",
						"type": [
							"array",
							{
								"countType": "i32",
								"type": "player_state_struct"
							}
						]
					}
				]
			],
			"remove_category": [
				"container",
				[
					{
						"name": "id",
						"type": "string"
					}
				]
			],
			"remove_group": [
				"container",
				[
					{
						"name": "uuid",
						"type": "uuid"
					}
				]
			],
			"request_secret": [
				"container",
				[
					{
						"name": "version",
						"type": "i32"
					}
				]
			],
			"secret": [
				"container",
				[
					{
						"name": "secret",
					 	"type": "uuid"
					},
					{
						"name": "serverPort",
						"type": "i32"
					},
					{
						"name": "playerUUID",
						"type": "uuid"
					},
					{
						"name": "codec",
						"type": "u8"
					},
					{
						"name": "mtuSize",
						"type": "i32"
					},
					{
						"name": "voiceChatDistance",
						"type": "f64"
					},
					{
						"name": "keepAlive",
						"type": "i32"
					},
					{
						"name": "groupsEnabled",
						"type": "bool"
					},
					{
						"name": "voiceHost",
						"type": "string"
					},
					{
						"name": "allowRecording",
						"type": "bool"
					}
				]
			],
			"update_state": [
				"container",
				[
					{
						"name": "disabled",
						"type": "bool"
					}
				]
			]
		}
	},
	"udp": {
		"types": {
			"client_network_message": [
				"container",
				[
					{
						"name": "magic_number",
						"type": "u8"
					},
					{
						"name": "payload",
						"type": [
							"array",
							{
								"countType": "varint",
								"type": "u8"
							}
						]
					}
				]
			],
			"server_network_message": [
				"container",
				[
					{
						"name": "magic_number",
						"type": "u8"
					},
					{
						"name": "playerUUID",
						"type": "uuid"
					},
					{
						"name": "payload",
						"type": [
							"array",
							{
								"countType": "varint",
								"type": "u8"
							}
						]
					}
				]
			],
			"packet": [
				"container",
				[
					{
						"name": "id",
						"type": [
							"mapper",
							{
							"type": "u8",
								"mappings": {
									"1": "MicPacket",
									"2": "PlayerSoundPacket",
									"3": "GroupSoundPacket",
									"4": "LocationSoundPacket",
									"5": "AuthenticatePacket",
									"6": "AuthenticateAckPacket",
									"7": "PingPacket",
									"8": "KeepAlivePacket",
									"9": "ConnectionCheckPacket",
									"10": "ConnectionCheckAckPacket",
								}
							}
						]
					},
					{
						"name": "data",
						"type": [
							"switch",
							{
								"compareTo":  "id",
								"fields": {
									"MicPacket": "MicPacket",
									"PlayerSoundPacket": "PlayerSoundPacket",
									"GroupSoundPacket": "GroupSoundPacket",
									"LocationSoundPacket": "LocationSoundPacket",
									"AuthenticatePacket": "AuthenticatePacket",
									"AuthenticateAckPacket": "AuthenticateAckPacket",
									"PingPacket": "PingPacket",
									"KeepAlivePacket": "KeepAlivePacket",
									"ConnectionCheckPacket": "ConnectionCheckPacket",
									"ConnectionCheckAckPacket": "ConnectionCheckAckPacket",
								},
								"default": "void"
							}
						]
					}
				]
			],
			"AuthenticatePacket": [
				"container",
				[
					{
						"name": "playerUUID",
						"type": "uuid"
					},
					{
						"name": "secret",
						"type": "uuid"
					}
				]
			],
			"AuthenticateAckPacket": [
				"container",
				[

				]
			],
			"ConnectionCheckPacket": [
				"container",
				[

				]
			],
			"ConnectionCheckAckPacket": [
				"container",
				[

				]
			],
			"PingPacket": [
				"container",
				[

				]
			],
			"KeepAlivePacket": [
				"container",
				[
					
				]
			],
			"PlayerSoundPacket": [
				"container",
				[
					{
						"name": "channel_id",
						"type": "uuid"
					},
					{
						"name": "sender",
						"type": "uuid"
					},
					{
						"name": "data",
						"type": "byte_array"
					},
					{
						"name": "sequencenumber",
						"type": "u64"
					},
					{
						"name": "distance",
						"type": "f32"
					},
					{
						"name": "data",
						"type": 
						[
							"bitfield",
							[
								{"name": "empty_fields", "size": 6, "signed": false},
								{"name": "hasCategory", "size": 1, "signed": false},
								{"name": "whisper", "size": 1, "signed": false}
							]
						]
					},
					{
						"name": "category",
						"type": 
						[
							"switch",
							{
								"compareTo": "data/hasCategory",
								"fields": {
									"1": "string"
								},
								"default": "void"
							}
						]
					}
				]
			],
			"GroupSoundPacket": [
				"container",
				[
					{
						"name": "channel_id",
						"type": "uuid"
					},
					{
						"name": "sender",
						"type": "uuid"
					},
					{
						"name": "data",
						"type": "byte_array"
					},
					{
						"name": "sequencenumber",
						"type": "u64"
					},
					{
						"name": "data",
						"type": 
						[
							"bitfield",
							[
								{"name": "empty_fields", "size": 6, "signed": false},
								{"name": "hasCategory", "size": 1, "signed": false},
								{"name": "whisper", "size": 1, "signed": false}
							]
						]
					},
					{
						"name": "category",
						"type": 
						[
							"switch",
							{
								"compareTo": "data/hasCategory",
								"fields": {
									"1": "string"
								},
								"default": "void"
							}
						]
					}
				]
			],
			"LocationSoundPacket": [
				"container",
				[
					{
						"name": "channel_id",
						"type": "uuid"
					},
					{
						"name": "sender",
						"type": "uuid"
					},
					{
						"name": "location",
						"type": [
							"container",
							[
								{
									"name": "x",
									"type": "f64"
								},
								{
									"name": "y",
									"type": "f64"
								},
								{
									"name": "z",
									"type": "f64"
								},
							]
						]
					},
					{
						"name": "data",
						"type": "byte_array"
					},
					{
						"name": "sequencenumber",
						"type": "u64"
					},
					{
						"name": "distance",
						"type": "f32"
					},
					{
						"name": "data",
						"type": 
						[
							"bitfield",
							[
								{"name": "empty_fields", "size": 6, "signed": false},
								{"name": "hasCategory", "size": 1, "signed": false},
								{"name": "whisper", "size": 1, "signed": false}
							]
						]
					},
					{
						"name": "category",
						"type": 
						[
							"switch",
							{
								"compareTo": "data/hasCategory",
								"fields": {
									"1": "string"
								},
								"default": "void"
							}
						]
					}
				]
			],
			"MicPacket": [
				"container",
				[
					{
						"name": "data",
						"type": "byte_array"
					},
					{
						"name": "sequencenumber",
						"type": "u64"
					},
					{
						"name": "whispering",
						"type": "bool"
					}
				]
			]
		}
	}
}