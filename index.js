require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')

const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
//const logger = require('./loggerMiddleware')
const app = express()
//const http = require('http')

app.use(cors())
app.use(express.json())
//app.use(logger)

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
	response.send('<h1>Hello Wordld!</h1>')
})

app.get('/api/notes', async (request, response) => {
	const notes = await Note.find({})
	response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
	const { id } = request.params

	Note.findById(id).then(note => {
		if (note) {
			response.json(note)
		} else {
			response.status(404).end()
		}
	})
		.catch(error => {
			next(error)
		})
})

app.put('/api/notes/:id', (request, response) => {
	const { id } = request.params
	const note = request.body

	const newNoteInfo = {
		content: note.content,
		important: note.important
	}
  
	Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
		.then(result => {
			response.json(result)
		})//.catch(error => next(error))
})

app.delete('/api/notes/:id', async (request, response, next) => {
	const { id } = request.params
  
	try {
		await Note.findByIdAndDelete(id)
		response.status(204).end()
	} catch (error) {
		next(error)
	}
})

app.post('/api/notes', async (request, response, next) => {
	const note = request.body
  
	if (!note || !note.content) {
		return response.status(400).json({
			error: 'note.content is missing'
		})
	}

	const newNote = new Note({
		content: note.content,
		important: typeof note.important != 'undefined' ? note.important : false,
		date: new Date().toISOString()
	})

	//Change from promise to async-await
	// newNote.save().then(savedNote => {
	// 	 response.json(savedNote)
	// }).catch(err => next(err))
	try {
		const savedNote = await newNote.save()
		response.json(savedNote)
	} catch (error) {
		next(error)
	}
})

app.use(notFound)
app.use(handleErrors)

//Other way to generate de 404
/*app.use((request, response) => {
	response.status(406).json({
		errot: 'Not found'
	})
})*/

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }