checkAuth();
function checkAuth(){
	//if(localStorage.token === undefined || localStorage.token === '')
		//BackToHome();
	let myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${localStorage.token}`);
	let formdata = new URLSearchParams({ id: localStorage.id, });

	let requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};
	fetch("/api/page?"+formdata, requestOptions)
		.then(response => response.text())
		.then(result => ProcessData(result))
		.catch(e => {console.log('error', e); });

}
function BackToHome(){
	//window.location.href = '/';
	alert('You are not loged');
}
function ProcessData(result){
	console.log('ProcessData', result);
	let data = JSON.parse(result);
	if(data.message === 'You are authorized')
		FillData(data);
	else
		BackToHome();
}
function FillData(data){
	const name = data.score[1]+' '+data.score[2];
	//const tBody = document.getElementById('idTbody');
	const rowTemplate = document.getElementById('idRowTemplate');
	const rowFootTemplate = document.getElementById('idRowFootTemplate');
	data.titles.forEach((title, index) => {if(index > 2){
		const template = index === 14 ? rowFootTemplate : rowTemplate;
		const row = template.cloneNode(true);	
		row.removeAttribute('hidden');
		row.children[0].innerHTML = title;
		if(index ===12 || index === 13)
			row.children[0].classList.add('dark:bg-primary-700');
		row.children[1].innerHTML = data.score[index];
		template.parentElement.appendChild(row);
	}});

	document.getElementById('idUserName').innerHTML = name;
	
}
