const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const requestLogger = (request, reponse, next) => {
	console.log('Method', request.method);
	console.log('Path', request.path);
	console.log('Body', request.body);
	console.log('---');
	next();
};

app.use(express.json());
app.use(express.static('dist'));
app.use(requestLogger);
app.use(cors());

morgan.token('personData', req => {
	return JSON.stringify(req.body);
});
app.use(
	morgan(
		':method :url :status :res[content-length] :response-time ms :personData'
	)
);

//:method :url :status :res[content-length] - :response-time ms
//# will output
//GET /tiny 200 2 - 0.188 ms

let persons = [
	{
		id: '1',
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: '2',
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: '3',
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: '4',
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

app.get('/info', (request, response) => {
	const info = () => {
		const currentDate = new Date();
		return `<p>Phonebook has info for ${
			persons.length
		} people</p><p>${currentDate.toString()}</p>`;
	};

	response.send(info());
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const person = persons.find(person => person.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

const generateID = () => {
	return Math.floor(Math.random() * 10000);
};

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name) {
		return response.status(400).json({
			error: 'Please enter a name',
		});
	}
	if (!body.number) {
		return response.status(400).json({
			error: 'Please enter a number',
		});
	}

	const existingNames = persons.map(person => person.name);
	if (existingNames.includes(body.name)) {
		return response.status(400).json({
			error: `${body.name} already exists`,
		});
	}

	const newPerson = {
		id: String(generateID()),
		name: body.name,
		number: body.number,
	};

	console.log('new person is:');
	console.log(newPerson);

	persons = persons.concat(newPerson);

	console.log(persons);

	response.json(newPerson);
});

app.put('/api/persons/:id', (request, response) => {
	//NOTE -- I accidentally created this prematurely in Exercise 3.9. it does appear to work right now. But it might not be what they want!
	const id = request.params.id;
	const updatedPerson = request.body;
	persons = persons.map(person => (person.id === id ? updatedPerson : person));
	response.status(204).end();
});

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	persons = persons.filter(person => person.id !== id);

	response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
