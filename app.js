const fs = require('fs')
const ytdl = require('ytdl-core')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

// Download Functions
async function downloadYoutubeVideo (youtubeurl) {
	const stream = ytdl(youtubeurl, { filter: 'videoandaudio' })
	const filename = 'video.mp4'
	const ws = fs.createWriteStream(filename)
	stream.pipe(ws)
	return new Promise(resolve => {
		stream.on('end', () => {
			resolve(filename)
		})
	})
}

async function downloadYoutubeAudio (youtubeurl) {
	const stream = ytdl(youtubeurl, { filter: 'audioonly' })
	const filename = 'audio.mp3'
	const ws = fs.createWriteStream(filename)
	stream.pipe(ws)
	return new Promise(resolve => {
		stream.on('end', () => {
			resolve(filename)
		})
	})
}


app.get('/', (req, res) => {
	res.send('test')
})

// Convert Youtube Video
app.post('/convert', async (req, res) => {
	const { youtube_url, media_type } = req.body
	let file
	console.log(req.body)
	if (media_type == 'audio') {
		file = await downloadYoutubeAudio(youtube_url)
		res.send({ type: 'audio' })
	} else {
		file = await downloadYoutubeVideo(youtube_url)
		res.send({ type: 'video' })
	}
})
// Download Video
app.get('/download', async (req, res) => {
	const { type } = req.query
	if (type == 'audio') {
		res.download('./audio.mp3')
	} else {
		res.download('./video.mp4')
	}
})
const port = process.env.PORT || 4000
app.listen(port, () => {
	console.log('server startedd')
})
