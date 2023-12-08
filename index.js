require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')

const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const noteRouter = require('./controllers/notes')
const userRouter = require('./controllers/users')
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

app.use('/api/notes', noteRouter)
app.use('/api/users', userRouter)

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