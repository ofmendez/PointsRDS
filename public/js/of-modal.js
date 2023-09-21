export function uniqueModal() {
	const trigger = document.querySelector('[of-modal]');
	const closers = document.querySelectorAll('[of-modal-hide]');
	const idModal = trigger?.getAttribute('of-modal');
	const modal = document.getElementById(idModal);
	trigger?.addEventListener('click', () => {	
		console.log('trigger click');
		modal?.classList.remove('hidden');
	});
	modal?.addEventListener('click', (e) => {
		if(e.target !== e.currentTarget) return;
			modal?.classList.add('hidden');
	});
	console.log('modal', modal);
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') 
			modal?.classList.add('hidden');
	});
	closers?.forEach((item) => {
		item?.addEventListener('click', () => {
			modal?.classList.add('hidden');
		});
	});
}
