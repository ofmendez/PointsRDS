import {google} from 'googleapis';
const serviceAccountKeyFile = "./steadfast-karma-177403-5484f69a7b47.json";
const sheetId = '1-ZMr0QiqK4Nqmq5-rq3KUPJt7vwIpPK4elSld5KmDNo'
const tabName = 'Septiembre'
const range = 'A:E'



async function main() {
  // Generating google sheet client
  const googleSheetClient = await _getGoogleSheetClient();

  // Reading Google Sheet from a specific range
  const data = await _readGoogleSheet(googleSheetClient, sheetId, tabName, range);
  console.log(data);

  // Adding a new row to Google Sheet
  const dataToBeInserted = [
     ['11', 'rohith', 'Rohith', 'Sharma', 'Active'],
     ['12', 'virat', 'Virat', 'Kohli', 'Active']
  ]
  await _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, dataToBeInserted);
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

const handle = async (req) =>{
    	const url = new URL(req.url);
	/*if (url.pathname === "/"){	  
//	    main().then(() => {
	    //await main();
	    console.log('Completed');
	    return new Response("<h1>Hi Fabian</hi>", {
		headers: {
		  "Content-Type": "text/html",
		},
	    });
	}else
	*/
	    return new Response('Hello Fabian!');

}

const server = Bun.serve({
    port: 5000,
    async fetch(req) {
	await main();
	return new Response("<h1>Hi Fabian</h1>");
    }
    /*
    fetch: async (req) => await handle
fetch(req) {
	const url = new URL(req.url);
	if (url.pathname === "/"){	  
//	    main().then(() => {
	    await main();
	    console.log('Completed');
	    return new Response("<h1>Hi Fabian</h1>", {
		headers: {
		  "Content-Type": "text/html",
		},
	    });
	}else
	    return new Response('Hello Fabian!');
    },
    */
});

console.log(`Listeniiing on localhost:${server.port}`);
