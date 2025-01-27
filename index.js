const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));

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

// morgan('tiny');
//:method :url :status :res[content-length] - :response-time ms
//# will output
//GET /tiny 200 2 - 0.188 ms

const info = () => {
	const currentDate = new Date();
	return `<p>Phonebook has info for ${
		persons.length
	} people</p><p>${currentDate.toString()}</p>`;
};

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/info', (request, response) => {
	response.send(info());
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
	console.log(body);

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
		name: body.name,
		number: body.number,
		id: generateID(),
	};

	console.log('new person is:');
	console.log(newPerson);

	persons = persons.concat(newPerson);

	console.log(persons);

	response.json(newPerson);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	persons = persons.filter(person => person.id !== id);

	response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
