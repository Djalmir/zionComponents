const style = document.createElement('style')
style.textContent = /*css*/`
	:host {
		box-sizing: border-box;
		width: 90%;
		margin: 7px auto;
		font-size: 18px;
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 7px 13px;
		color: var(--secondary-light);
		fill: var(--secondary-light);
		border-left: 1px solid var(--dark-bg3-transparent);
		border-top: 1px solid var(--dark-bg3-transparent);
		border-right: 1px solid var(--dark-bg1);
		border-bottom: 1px solid var(--dark-bg1);
		border-radius: .2rem;
		cursor: pointer;
	}

	:host(:hover) {
		background: var(--dark-bg1-transparent);
	}

	:host(.active),
	:host(:active) {
		background: var(--dark-bg1-transparent);
		border-top: 1px solid var(--dark-bg1);
		border-left: 1px solid var(--dark-bg1);
		border-right: 1px solid var(--dark-bg3-transparent);
		border-bottom: 1px solid var(--dark-bg3-transparent);
		fill: var(--light-font2);
		color: var(--light-font2);
	}

	:host(:active) {
		filter: brightness(0.9);
		color: var(--secondary-light);
		fill: var(--secondary-light);
	}

	:host(.lightTheme) {
		color: var(--dark-font2);
		fill: var(--dark-font2);
		border-left: 1px solid var(--light-bg2);
		border-top: 1px solid var(--light-bg2);
		border-right: 1px solid var(--dark-bg4-transparent);
		border-bottom: 1px solid var(--dark-bg4-transparent);
	}

	:host(.lightTheme:hover) {
		background: var(--light-bg1-transparent);
	}

	:host(.lightTheme.active),
	:host(.lightTheme:active) {
		background: var(--light-bg1-transparent);
		border-top: 1px solid var(--dark-bg4-transparent);
		border-left: 1px solid var(--dark-bg4-transparent);
		border-right: 1px solid var(--light-bg4);
		border-bottom: 1px solid var(--light-bg4);
		fill: var(--dark-font1);
		color: var(--dark-font1);
	}

	:host(.lightTheme:active)	{
		filter: brightness(0.9);
		color: var(--dark-font2);
		fill: var(--dark-font2);
	}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<z-icon></z-icon>
	<slot></slot>
`

export default class zMenuItem extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		if (this.attributes.icon) {
			let icon = this.shadowRoot.querySelector('z-icon')
			icon.class = this.attributes.icon.value
			icon.size = '1.5'
		}
		if (this.attributes.path) {
			this.onclick = () => {
				try {
					// deepSelectorAll('#mainMenu')[0].showMenu()
					location.hash = this.path
				}
				catch {
					console.error(`Path '${ path }' not found.`)
				}
			}
		}

		this.updateActiveClass = () => {
			if (app.darkTheme)
				this.classList.replace('lightTheme', 'darkTheme')
			else
				this.classList.replace('darkTheme', 'lightTheme')

			this.classList.remove('active')
			setTimeout(() => {
				if (location.hash == this.path) {
					this.classList.add('active')
				}
			}, 0)
		}

		window.addEventListener('hashchange', this.updateActiveClass)
		document.addEventListener('themeUpdated', this.updateActiveClass)
		this.classList.add(app.darkTheme ? 'darkTheme' : 'lightTheme')
	}

	connectedCallback() {
		const parseStringToObject = (str) => {
			if (!str.startsWith('{'))
				str = '{' + str
			if (!str.endsWith('}'))
				str = str + '}'

			str = str.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
			str = str.replace(/:\s*([a-zA-Z0-9_]+)([,}])/g, ':"$1"$2')
			str = str.replace(/'/g, '"')

			return JSON.parse(str)
		}

		setTimeout(() => {
			try {
				let path = parseStringToObject(this.attributes.path.value)
				if (path.name) {
					try {
						this.path = Object.entries(app.routes).find(e => e[1].name == path.name)[0] + `${ path.params ? `?${ Object.entries(path.params).map(e => `${ e[0] }=${ e[1] }`).join('&') }` : '' }`
					}
					catch {
						console.error(`Route named '${ path.name }' not found.`)
					}
				}
			}
			catch {
				this.path = this.attributes.path.value
			}

			if (location.hash == this.path) {
				this.classList.add('active')
			}
		}, 0)
	}
}

customElements.define('z-menuitem', zMenuItem)