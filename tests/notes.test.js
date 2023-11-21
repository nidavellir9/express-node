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

	for (const note of initialNotes) {
		const noteObject = new Note(note)
		await noteObject.save()
	}
})

describe('GET all notes', () => {
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
})

describe('Create a note', () => {
	test('Is possible with a valid note', async () => {
		const newNote = {
			content: 'Proxima nota',
			important: true
		}
	
		await api
			.post('/api/notes')
			.send(newNote)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	
		const { contents, response } = await getAllContentsFromNotes()
	
		expect(response.body).toHaveLength(initialNotes.length + 1)
		expect(contents).toContain(newNote.content)
	})
	
	test('Is not possible with an invalid note', async () => {
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
})

describe('Delete notes', () => {
	test('A note can be deleted', async () => {
		const { response: firstResponse } = await getAllContentsFromNotes()
		const { body: notes } = firstResponse
		const noteToDelete = notes[0]
	
		await api
			.delete(`/api/notes/${noteToDelete.id}`)
			.expect(204)
	
		const { contents, response: secondResponse } = await getAllContentsFromNotes()
		expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
	
		expect(contents).not.toContain(noteToDelete.content)
	})
	
	test('A note that do not exist can not be deleted', async () => {
		await api
			.delete('/api/notes/1234')
			.expect(400)
	
		const { response } = await getAllContentsFromNotes()
	
		expect(response.body).toHaveLength(initialNotes.length)
	})
})

afterAll(() => {
	mongoose.connection.close()
	server.close()
})