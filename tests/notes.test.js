const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const {
	api,
	initialNotes,
	getAllContentsFromNotes
} = require('./helpers')

beforeEach(async () => {
	await Note.deleteMany({})

	const note1 = new Note(initialNotes[0])
	await note1.save()

	const note2 = new Note(initialNotes[1])
	await note2.save()
})

test('Notes are returned as json', async () => {
	await api
		.get('/api/notes')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('There is one note', async () => {
	const response = await api.get('/api/notes')
	expect(response.body).toHaveLength(initialNotes.length)
})

test('The first note is about FullStack', async () => {
	const { 
		contents
	} = await getAllContentsFromNotes()
	
	expect(contents).toContain('Aprendiendo FullStack JS')
})

test('A valid note can be added', async () => {
	const newNote = {
		content: 'Proxima nota',
		important: true
	}

	await api
		.post('/api/notes')
		.send(newNote)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const { contents, response } = await getAllContentsFromNotes()

	expect(response.body).toHaveLength(initialNotes.length + 1)
	expect(contents).toContain(newNote.content)
})

test('Note without content can not be added', async () => {
	const newNote = {
		important: true
	}

	await api
		.post('/api/notes')
		.send(newNote)
		.expect(400)

	const response = await api.get('/api/notes')

	expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
	mongoose.connection.close()
	server.close()
})