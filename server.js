import {google} from 'googleapis';
import {Hono} from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { readFileSync } from 'node:fs';

const serviceAccountKeyFile = "./data/steadfast-karma-177403-5484f69a7b47.json";
const sheetId = '1Gpa2pbEs3cm1jKRB7MkDsMPV7mlzQ0RgJzmnO_v13rQ'
const tabName = 'Acumulado' //TODO change to Acumulado
const range = 'B:Z'


const ofToken = 'ofmendez-is-cool';
const dataPass = './data/data.json';
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
//////////////////////////////////END G-SHEETS/////////////////////////////////////////


async function getEmail(_id) {
	const data = JSON.parse(readFileSync(dataPass, 'utf8'));
	let result ='';
	data.forEach((user) => {
		if(user.id === _id)
			result = user.email;
	});
	return result;
}

async function checkAuth(_email, _password) {
	const data = JSON.parse(readFileSync(dataPass, 'utf8'));
	
	let result = {exist:false, user: {id:-1}};
	data.forEach((user) => {
		if(user.email.toLowerCase() === _email.toLowerCase() && user.password === _password)
			result = {exist:true, user: user};
	});
	return result;
}

//console.log(await checkAuth('',''));
console.log(await checkAuth('admin@reddesignsystems.com',''));
console.log(await checkAuth('admin@reddesignsystems.com','6969'));

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

app.get('/favicon.ico',(c)=>{return new Response(Bun.file('./public/images/favicon.ico'));});

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
