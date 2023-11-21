const { app } = require('../index')
const supertest = require('supertest')

const api = supertest(app)

const initialNotes = [
	{
		content: 'Aprendiendo FullStack JS',
		important: true,
		date: new Date()
	},
	{
		content: 'Sigueme',
		important: true,
		date: new Date()
	},
	{
		content: 'Tercera nota',
		important: false,
		date: new Date()
	}
]

const getAllContentsFromNotes = async () => {
	const response = await api.get('/api/notes')
	return {
		contents: response.body.map(note => note.content),
		response
	}
}

module.exports = {
	api,
	initialNotes,
	getAllContentsFromNotes
}