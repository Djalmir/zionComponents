// nameInput.addEventListener('update', (e) => {
// 	console.log('update', e.detail)
// })

function mountApp(routes) {
	let globalStyle = document.createElement('style')
	fetch('./app.css')
		.then((res) => {return res.text()})
		.then((res) => {
			globalStyle.textContent = res

			function onRouteChanged() {
				const hash = window.location.hash

				if (!(app instanceof HTMLElement)) {
					throw new ReferenceError('No router view element available for rendering')
				}

				app.view = new routes[hash.split('?')[0]]()

				app.view.shadowRoot.insertBefore(globalStyle, app.view.shadowRoot.firstElementChild)

				while (app.firstChild)
					app.removeChild(app.firstChild)
				app.appendChild(app.view)

				ZION(app.view)
			}

			if (!window.location.hash)
				window.location.hash = '#/'

			onRouteChanged()
			window.addEventListener('hashchange', onRouteChanged)
		})
}

function setMask(e, type) {
	let input = e.target
	switch (type.toLowerCase()) {
		case 'cnpj':
			input.maxLength = 18
			input.value = input.value
				.replace(/\D/g, '')
				.replace(/^(\d{2})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1/$2')
				.replace(/(\d{4})(\d)/, '$1-$2')
			break
		case 'cep':
			input.maxLength = 10
			input.value = input.value
				.replace(/\D/g, '')
				.replace(/^(\d{2})(\d)/, '$1.$2')
				.replace(/(\d{3})(\d)/, '$1-$2')
			break
		case 'cellphone':
			input.maxLength = 15
			input.value = input.value
				.replace(/\D/g, '')
				.replace(/^(\d{2})(\d)/, '($1) $2')
				.replace(/(\d{5})(\d)/, '$1-$2')
			break
	}
}