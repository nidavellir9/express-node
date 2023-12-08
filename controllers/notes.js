const notesRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
	const notes = await Note.find({}).populate('user', {
		username: 1,
		name: 1
	})
	response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.put('/:id', userExtractor, (request, response) => {
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

notesRouter.delete('/:id', userExtractor, async (request, response, next) => {
	const { id } = request.params
  
	try {
		await Note.findByIdAndDelete(id)
		response.status(204).end()
	} catch (error) {
		next(error)
	}
})

notesRouter.post('/', userExtractor, async (request, response, next) => {
	const {
		content,
		important = false
	} = request.body

	const { userId } = request
	const user = await User.findById(userId)
  
	if (!content) {
		return response.status(400).json({
			error: 'note.content is missing'
		})
	}

	const newNote = new Note({
		content,
		date: new Date().toISOString(),
		important,
		user: user._id
	})

	//Change from promise to async-await
	// newNote.save().then(savedNote => {
	// 	 response.json(savedNote)
	// }).catch(err => next(err))
	try {
		const savedNote = await newNote.save()

		user.notes = user.notes.concat(savedNote._id)
		await user.save()

		response.json(savedNote)
	} catch (error) {
		next(error)
	}
})

module.exports = notesRouter