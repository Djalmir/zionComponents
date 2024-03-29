function mountApp(routes) {
	if (!(app instanceof HTMLElement)) {
		throw new ReferenceError('No router view element available for rendering')
	}

	//			CSS:	 @media (prefers-color-scheme: dark)
	if (app._darkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches) {
		app.classList.add('darkTheme')
	}
	else {
		app.classList.add('lightTheme')
	}
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

		while (viewContainer.firstChild)
			viewContainer.removeChild(viewContainer.firstChild)
		viewContainer.appendChild(app.view)

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
	updateAppTheme()
}

function updateAppTheme() {
	if (app._darkTheme) {
		deepSelectorAll("[class='lightTheme']").map((element) => {
			element.classList.replace('lightTheme', 'darkTheme')
		})

		document.querySelector('html').style = `
			background: var(--dark-bg1);
		`
		document.body.style = `
			background: radial-gradient(var(--dark-bg3), var(--dark-bg1));
			background-attachment: fixed;
			color: var(--light-font1);
		`
	}
	else {
		deepSelectorAll("[class='darkTheme']").map((element) => {
			element.classList.replace('darkTheme', 'lightTheme')
		})

		document.querySelector('html').style = `
			background: var(--light-bg1);
		`
		document.body.style = `
			background: radial-gradient(var(--light-bg2), var(--light-bg1));
			background-attachment: fixed;
			color: var(--dark-font1);
		`
	}
	updateScrollbarTheme()
}

let currentTrackBg = 191919
let currentThumbBg = 404040
function updateScrollbarTheme() {
	if (app._darkTheme) {
		// if (currentTrackBg > 191919)
		// 	currentTrackBg -= 101010
		// if (currentThumbBg > 404040)
		// 	currentThumbBg -= 101010
		// document.body.style.setProperty('--scroll-track-bg', `#${ currentTrackBg }`)
		// document.body.style.setProperty('--scroll-thumb-bg', `#${ currentThumbBg }`)
		// document.body.style.setProperty('--scroll-thumb-hover-bg', '#454545')
		// document.body.style.setProperty('--scroll-thumb-active-bg', '#303030')
		// if (currentTrackBg > 191919)
		// 	setTimeout(() => {
		// 		updateScrollbarTheme()
		// 	}, 0)		
		document.body.style.setProperty('--scroll-track-bg', `transparent`)
		document.body.style.setProperty('--scroll-thumb-bg', `#404040`)
		document.body.style.setProperty('--scroll-thumb-hover-bg', '#454545')
		document.body.style.setProperty('--scroll-thumb-active-bg', '#303030')
	}
	else {
		// if (currentTrackBg < 999999)
		// 	currentTrackBg += 101010
		// if (currentThumbBg < 606060)
		// 	currentThumbBg += 101010
		// document.body.style.setProperty('--scroll-track-bg', `#${ currentTrackBg }`)
		// document.body.style.setProperty('--scroll-thumb-bg', `#${ currentThumbBg }`)
		// document.body.style.setProperty('--scroll-thumb-hover-bg', '#707070')
		// document.body.style.setProperty('--scroll-thumb-active-bg', '#505050')
		// if (currentTrackBg < 999999)
		// 	setTimeout(() => {
		// 		updateScrollbarTheme()
		// 	}, 0)		
		document.body.style.setProperty('--scroll-track-bg', `transparent`)
		document.body.style.setProperty('--scroll-thumb-bg', `#606060`)
		document.body.style.setProperty('--scroll-thumb-hover-bg', '#707070')
		document.body.style.setProperty('--scroll-thumb-active-bg', '#505050')
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

function deepSelectorAll(selector, root = document) {
	const elements = root.querySelectorAll(selector)
	const shadowElements = Array.from(root.querySelectorAll('*'))
		.filter(element => element.shadowRoot)
		.map(element => deepSelectorAll(selector, element.shadowRoot))
		.flat()

	return [...elements, ...shadowElements]
}