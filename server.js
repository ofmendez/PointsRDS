import {google} from 'googleapis';
import {Hono} from 'hono';
import { bearerAuth } from 'hono/bearer-auth';

const serviceAccountKeyFile = "./steadfast-karma-177403-5484f69a7b47.json";
const sheetId = '1Gpa2pbEs3cm1jKRB7MkDsMPV7mlzQ0RgJzmnO_v13rQ'
const tabName = 'Pruebas' //TODO change to Acumulado
const range = 'B:P'


const ofToken = 'ofmendez-is-cool';

//////////////////////////////////G-SHEETS/////////////////////////////////////////

const GSheetClient = await _getGoogleSheetClient();

async function _getGoogleSheetRow(_email) {
	// Reading Google Sheet from a specific range
	const rows = await _readGoogleSheet(GSheetClient , sheetId, tabName, range);
	let data = '';
	let titles = rows[0];
	rows.forEach((row) => {
		console.log(row[0], _email);
		if(row[0] === _email)
			data = row;
	});
	return {data: data, titles: titles};
}
//main().then(() => {
  //console.log('Completed')
//})
async function main() {
	// Generating google sheet client
	const googleSheetClient = await _getGoogleSheetClient();
	// Reading Google Sheet from a specific range
	const data = await _readGoogleSheet(googleSheetClient, sheetId, tabName, range);
	console.log(data);
	// Adding a new row to Google Sheet
	const dataToBeInserted = [ ['11', 'rohith', 'Rohith', 'Sharma', 'Active'], ['12', 'virat', 'Virat', 'Kohli', 'Active'] ]
	//await _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, dataToBeInserted);
}

async function _getGoogleSheetClient() {
	const auth = new google.auth.GoogleAuth({
		keyFile: serviceAccountKeyFile,
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});
	const authClient = await auth.getClient();
	return google.sheets({
		version: 'v4',
		auth: authClient,
	});
}

async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
	const res = await googleSheetClient.spreadsheets.values.get({
		spreadsheetId: sheetId,
		range: `${tabName}!${range}`,
	});
	return res.data.values;
}

async function _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
	await googleSheetClient.spreadsheets.values.append({
		spreadsheetId: sheetId,
		range: `${tabName}!${range}`,
		valueInputOption: 'USER_ENTERED',
		insertDataOption: 'INSERT_ROWS',
		resource: {
			"majorDimension": "ROWS",
			"values": data
		},
	})
}
//////////////////////////////////END 
//G-SHEETS/////////////////////////////////////////


async function getEmail(_id) {
	const file = Bun.file('./data.json');
	const data = await file.json();
	let result ='';
	data.forEach((user) => {
		if(user.id === _id)
			result = user.email;
	});
	return result;
}

async function checkAuth(_email, _password) {
	const file = Bun.file('./data.json');
	const data = await file.json();
	let result = {exist:false, user: {id:-1}};
	data.forEach((user) => {
		//console.log(user.email === _email, user.password === _password);
		//console.log(user.email === _email && user.password === _password);
		//console.log(user.email === _email & user.password === _password);
		if(user.email === _email && user.password === _password)
			result = {exist:true, user: user};
	});
	return result;
}
//console.log(await checkAuth('',''));
console.log(await checkAuth('admin@reddesignsystems.com',''));
console.log(await checkAuth('admin@reddesignsystems.com','6969'));
//console.log(await checkAuth('rh@reddesignsystems.com','6969'));
//console.log(await checkAuth('rh@reddesignsystems.com','nnnn'));

const app = new Hono();

app.use('/api/*', bearerAuth({ token: ofToken }));

app.get('/api/page', async (c) => {
	const { id } = c.req.query();
	const email = await getEmail(id);
	const {data,titles} = await _getGoogleSheetRow(email);
	return c.json({ message: 'You are authorized', score: data, titles: titles });
});

app.get('/login', async (c) => {
	const { email, password } = c.req.query();
	const {exist, user} = 	await checkAuth(email, password);
	const msj = exist ? 'You are loged' : 'Try again';
	return c.json({ response: msj, token: exist? ofToken :'', id: user.id });
});

app.get('/user/:id', (c) => {
	const id = c.req.param('id');
	return c.html(Bun.file('./public/user.html'));
});

app.get('/', (c) => {
	return c.html(Bun.file('./public/index.html'));
});

app.get("/public/*", async (ctx) => {
	const url = new URL(ctx.req.url);
	const filePath = '.' + (url.pathname === "/" ? "/index.html" : url.pathname);
	console.log(filePath, 'from ', url.pathname);
	const file = Bun.file( filePath);
	return new Response(file);
});

const server = Bun.serve({
	port: 5000,
	fetch: app.fetch,
});

console.log(`Listeniiing on localhost:${server.port}`);
