// nameInput.addEventListener('update', (e) => {
// 	console.log('update', e.detail)
// })

function mountApp(routes) {
	if (!(app instanceof HTMLElement)) {
		throw new ReferenceError('No router view element available for rendering')
	}

	app._darkTheme = true
	Object.defineProperty(app, 'darkTheme', {
		get: () => {
			return app._darkTheme
		},
		set: (value) => {
			app._darkTheme = value
			updateAppTheme()
			dispatchEvent('themeUpdated')
		}
	})

	function onRouteChanged() {
		const hash = window.location.hash

		app.view = new routes[hash.split('?')[0]]()

		app.view.shadowRoot.insertBefore(globalStyle, app.view.shadowRoot.firstElementChild)

		while (app.firstChild)
			app.removeChild(app.firstChild)
		app.appendChild(app.view)

		updateAppTheme()

		ZION(app.view)
	}

	let globalStyle = document.createElement('style')
	fetch('./app.css')
		.then((res) => { return res.text() })
		.then((res) => {
			globalStyle.textContent = res

			if (!window.location.hash)
				window.location.hash = '#/'


			onRouteChanged()
			window.addEventListener('hashchange', onRouteChanged)
		})
}

function updateAppTheme() {
	if (app.view) {
		if (app._darkTheme) {
			app.view.shadowRoot.querySelector('#view').classList.add('darkTheme')
			app.view.shadowRoot.querySelector('#view').classList.remove('lightTheme')
			app.view.shadowRoot.style = document.body.style = `
				background: var(--dark-bg2);
				color: var(--light-font1);
			`
		}
		else {
			app.view.shadowRoot.querySelector('#view').classList.add('lightTheme')
			app.view.shadowRoot.querySelector('#view').classList.remove('darkTheme')
			app.view.shadowRoot.style = document.body.style = `
				background: var(--light-bg2);
				color: var(--dark-font1);
			`
		}
	}
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

function dispatchEvent(eventName, detail) {
	document.dispatchEvent(new CustomEvent(eventName, { detail: detail }))
}