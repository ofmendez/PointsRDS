export function uniqueModal() {
	const trigger = document.querySelector('[of-modal]');
	const closers = document.querySelectorAll('[of-modal-hide]');
	const idModal = trigger?.getAttribute('of-modal');
	const modal = document.getElementById(idModal);
	const bg = document.createElement('div');
	bg.setAttribute('of-modal-bg', true);
	bg.classList.add('hidden','bg-gray-900','bg-opacity-50','dark:bg-opacity-80','fixed','inset-0','z-40');
	document.body.appendChild(bg);
	
	trigger?.addEventListener('click', () => ShowModal(modal) );

	modal?.addEventListener('click', (e) => {
		if(e.target !== e.currentTarget) return;
		HideModal(modal);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') 
			HideModal(modal);
	});

	closers?.forEach((item) => {
		item?.addEventListener('click',()=> HideModal(modal) );
	});
}

function ShowModal(modal) {
	document.querySelector('[of-modal-bg]')?.classList.remove('hidden');
	modal?.classList.remove('hidden');
}

function HideModal(modal) {
	document.querySelector('[of-modal-bg]')?.classList.add('hidden');
	modal?.classList.add('hidden');
}

