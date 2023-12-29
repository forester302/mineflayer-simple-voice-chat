import { OpusEncoder } from '@discordjs/opus';
const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))

import * as fs from 'fs';
import * as path from 'path';

//@ts-ignore
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as ffmpeg from 'fluent-ffmpeg';

//types
import { Bot } from 'mineflayer';
import { SVC_OBJ } from './simple_voice_chat';

ffmpeg.setFfmpegPath(ffmpegInstaller.path)


export default class AudioPlayer {
	SAMPLE_RATE = 48_000
	CHANNELS = 2

	bot: Bot;

	initialised = false

	queue = []
	shouldLoop = false

	queueRunning = false
	songPlaying = false

	shouldStopQueue = false
	shouldStopSong = false

	paused = false

	async init(bot: Bot) {
		if (this.initialised) return

		this.bot = bot;

		const directory = "pcm";

		for (const file of await fs.promises.readdir(directory)) {
			await fs.promises.unlink(path.join(directory, file));
		}
		this.initialised = true
		bot.emit("audio_player_initialised")
	}

	//Will add YT/Spotify Downloading in the future
	//Will work like this
	//Request song
	//song gets downloded
	//song gets converted to PCM buffer (2 channels 48000Hz)
	//downloaded song gets deleted (if exists)
	//song gets stored in file and file name gets added to queue
	//When song finished playing
	//If queue not loop song file gets deleted
	//On startup clear out directory
	async enQueue(file: string) {
		if (!this.initialised) return
		if (!fs.existsSync(`audio/${file}`)) {
			return false
		}
		if (!fs.existsSync(`pcm/${file}.pcm`)) {
			//Convert to PCM
			let pcmBuffer: Buffer = await new Promise((resolve, reject) => {
				let chunks: Uint8Array[] = [];

				const ffmpegCommand = ffmpeg(`audio/${file}`)
					.audioCodec('pcm_s16le')
					.format('s16le')
					.audioFilters(`atempo=${1.0.toFixed(1)}`)
					.audioChannels(this.CHANNELS)
					.audioFrequency(this.SAMPLE_RATE)
					.on("error", reject);

				const audioStream = ffmpegCommand.pipe();

				audioStream.on("data", (chunk) => {
					chunks.push(chunk)
				})

				audioStream.on('end', () => {
					let outputBuffer = Buffer.concat(chunks);
					resolve(outputBuffer)
				})
			})
			//Store PCM in file
			await fs.promises.writeFile(`pcm/${file}.pcm`, pcmBuffer)
		}
		this.queue.push(`pcm/${file}.pcm`)
		this.bot.emit("audioplayer_enqueue")
		this.runQueue()
	}

	private deQueue(): string {
		return this.queue.shift()
	}

	async runQueue() {
		if (!this.initialised) return
		if (this.queueRunning) return
		this.queueRunning = true
		while (!this.shouldStopQueue) {
			if (!this.songPlaying && this.queue.length > 0 && SVC_OBJ.VoiceServer.connected) {
				let song = this.deQueue()
				console.log(song)
				this.sendPCM(song)
			}
			await sleep(5)
		}
		this.queueRunning = false
		this.shouldStopQueue = false
	}

	async sendPCM(file: string) {
		this.bot.emit("audioplayer_song_start")
		const pcmBuffer = fs.promises.readFile(file)
		const opusEncoder = new OpusEncoder(this.SAMPLE_RATE, this.CHANNELS);

		const frameSize = (this.SAMPLE_RATE / 1_000) * 40 * this.CHANNELS

		let frameDelay = BigInt(16_142_772)
		frameDelay = BigInt(16_431_725)

		this.songPlaying = true
		
		const frames = [];
		for (let i = 0; i < (await pcmBuffer).length; i += frameSize) {
			while (this.paused) {
				if (this.shouldStopSong) {
					break
				}
				await sleep(1)
			}
			if (this.shouldStopSong) {
				break
			}
			const startTime: bigint = process.hrtime.bigint()
			//cut frame out
			const frame = (await pcmBuffer).subarray(i, i + frameSize);
			if (frame.length !== frameSize) {
				break;
			}
			const opus = opusEncoder.encode(frame);
			this.bot.simple_voice_chat.sendPCM(opus)
			const endTime = process.hrtime.bigint();
			const elapsedTime = endTime - startTime;
			const sleepTime =frameDelay - elapsedTime;
			if (sleepTime > 0) {
				await sleep(Number(sleepTime) / 1000000)
			} else {
				console.log("Took too long")
			}
		}
		console.log("song finished")
		this.shouldStopSong = false
		this.paused = false
		this.songPlaying = false
		if (this.shouldLoop) {
			this.queue.push(file)
		}
		this.bot.emit("audioplayer_song_end")
	}

	stop() {
		this.shouldStopQueue = true
		this.shouldStopSong = true
		this.bot.once("audioplayer_song_end", () => {
			this.bot.emit("audioplayer_stop")
		})
	}

	pause() {
		this.paused = true
		this.bot.emit("audioplayer_pause")
	}

	play() {
		this.paused = false
		this.bot.emit("audioplayer_play")
	}
	
	skip() {
		this.shouldStopSong = true
		this.bot.once("audioplayer_song_end", () => {
			this.bot.emit("audioplayer_skip")
		})
	}

	setQueueLoop(shouldLoop: boolean) {
		this.shouldLoop = shouldLoop
	}
}


/*
Throw event when
music starts,
music stops,
music succesfully paused,
music succesfully played,
music succesfully skipped,
item added to the queue,
*/