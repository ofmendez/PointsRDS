console.log('main.js');
window.TryLogin = (form)=>{
	//console.log('TryLogin', form.email.value, form.password.value);
	let formdata = new URLSearchParams({
    email: form.email.value,
    password: form.password.value,
	});
	let requestOptions = {
		method: 'GET',
	};
	fetch("/login?"+formdata , requestOptions)
		.then(response => response.text())
		.then(result => ProcessLogin(result))
		.catch(error => console.log('error', error));
	return false;
}

function ProcessLogin(result){
	console.log('ProcessLogin', result);
	let json = JSON.parse(result);
	if(json.response==='You are loged' && json.token !== ''){
		localStorage.setItem('token', json.token);
		localStorage.setItem('id', json.id);
		window.location.href = '/user/'+json.id;
	}
}
