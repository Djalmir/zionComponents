export default class zDialog extends HTMLElement {
	constructor() {
		super()

		this.attachShadow({ mode: 'open' })

		const link = this.shadowRoot.appendChild(document.createElement('link'))
		link.rel = 'stylesheet'
		link.href = 'app.css'

		const style = this.shadowRoot.appendChild(document.createElement('style'))
		style.textContent = /*css*/`
			#wrapper {
				position: fixed;
				inset: 73px 0 0;
				z-index: 8;
				display: none;
				justify-content: center;
				align-items: flex-start;
			}

			#shadow {
				z-index: 1;
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100vh;
				background: linear-gradient(to bottom, var(--dark-bg1), var(--dark-bg1-transparent));
				backdrop-filter: blur(2px);
			}

			:host(.lightTheme) #shadow {
				background: linear-gradient(to bottom, var(--dark-bg4), var(--dark-bg4-transparent));
			}

			#dialog {
				z-index: 2;
				padding: 7px;
				width: 90%;
				max-width: 400px;
				background: var(--dark-bg2);
				border-radius: .3rem;
				box-shadow: var(--box-shadow);
				user-select: none;
			}

			:host(.lightTheme) #dialog {
				background: var(--light-bg1);
				color: var(--dark-font1);
			}

			#header {
				border-radius: .3rem .3rem 0 0;
				font-size: 1.2em;
				font-weight: bold;
				color: var(--light-bg1);
				padding-left: 8px;
			}

			:host(.lightTheme) #header {
				color: var(--dark-font1);
			}

			#section {
				padding: 24px 8px;
				color: var(--light-bg1);
			}

			:host(.lightTheme) #section {
				color: var(--dark-font1);
			}

			#footer {
				display: flex;
				gap: 5px;
			}

			@keyframes fadeIn {
				from {
					opacity: 0;
				}
			}

			@keyframes fadeOut {
				to {
					opacity: 0;
				}
			}

			@keyframes rollIn {
				from {
					transform: translateY(-500px);
				}
			}

			@keyframes rollOut {
				to {
					transform: translateY(-500px);
				}
			}
		`

		const wrapper = this.shadowRoot.appendChild(document.createElement('div'))
		wrapper.id = 'wrapper'

		const shadow = wrapper.appendChild(document.createElement('div'))
		shadow.id = 'shadow'

		const dialog = wrapper.appendChild(document.createElement('div'))
		dialog.id = 'dialog'

		const header = dialog.appendChild(document.createElement('header'))
		header.id = 'header'
		header.innerText = 'Cabeçalho'

		const section = dialog.appendChild(document.createElement('section'))
		section.id = 'section'
		section.innerText = 'Seção'

		const footer = dialog.appendChild(document.createElement('footer'))
		footer.id = 'footer'

		const yBt = footer.appendChild(document.createElement('z-button'))
		yBt.id = 'yBt'
		yBt.setAttribute('class', 'primary')
		yBt.setAttribute('style', `
			margin: 0;
			flex: 1;
			width: 100%;
		`)

		const nBt = footer.appendChild(document.createElement('z-button'))
		nBt.id = 'nBt'
		nBt.setAttribute('class', 'secondary')
		nBt.setAttribute('style', `
			margin: 0;
			flex: 1;
			width: 100%;
		`)

		this.confirm = async (title, msg) => {
			yBt.innerText = 'Sim'
			nBt.innerText = 'Não'
			wrapper.style.display = 'flex'
			shadow.style.animation = 'fadeIn .2s linear'
			dialog.style.animation = 'rollIn .2s ease-in-out'
			header.innerText = title || 'Confirme'
			section.innerHTML = msg || 'Deseja mesmo fazer isso?'
			yBt.focus()
			return new Promise((res) => {
				yBt.onclick = () => {
					this.hide()
					res(true)
				}

				nBt.onclick = () => {
					this.hide()
					res(false)
				}
			})
		}

		this.prompt = async (title, prompts) => {
			yBt.innerText = 'Ok'
			nBt.innerText = 'Cancelar'
			wrapper.style.display = 'flex'
			shadow.style.animation = 'fadeIn .2s linear'
			dialog.style.animation = 'rollIn .2s ease-in-out'
			header.innerText = title || ''
			section.innerHTML = ''
			if (prompts.length) {
				prompts.map((prompt) => {
					let input = section.appendChild(document.createElement('z-input'))
					input.placeholder = prompt.prompt
					input.value = prompt.value
					input.addEventListener('input', () => { prompt.value = input.value })
					input.style = `
						width: 100%;
					`
				})
			}
			else {
				console.warn("The zDialog prompt function expects a title and an array of prompts. Each prompt in the array should be an object containing the properties 'prompt' and 'value'. Usually the value should start as an empty string.")
			}
			section.firstChild.focus()
			return new Promise((res) => {
				yBt.onclick = () => {
					this.hide()
					res(prompts.reduce((obj, curr) => {
						obj[curr.prompt] = curr.value
						return obj
					}, {}))
				}

				nBt.onclick = () => {
					this.hide()
					res(false)
				}
			})
		}

		this.showMessage = (title, msg) => {
			yBt.innerText = 'Ok'
			footer.removeChild(nBt)
			footer.style = `
				width: 50%;
				margin-left: auto;
			`
			wrapper.style.display = 'flex'
			shadow.style.animation = 'fadeIn .2s linear'
			dialog.style.animation = 'rollIn .2s ease-in-out'
			header.innerHTML = title || ''
			section.innerHTML = msg || ''

			yBt.focus()

			yBt.onclick = () => {
				this.hide()
			}

			shadow.onclick = () => {
				this.hide()
			}
		}

		this.hide = () => {
			const removeWrapper = () => {
				this.shadowRoot.removeEventListener('animationend', removeWrapper)
				wrapper.style.display = 'none'
				footer.style = ''

				yBt.setAttribute('style', `
					margin: 0;
					flex: 1;
					width: 100%;
				`)

				if (!footer.querySelector('#nBt'))
					footer.appendChild(nBt)

				nBt.setAttribute('style', `
					margin: 0;
					flex: 1;
					width: 100%;
				`)

				shadow.onclick = null
			}

			const removeDialog = () => {
				this.shadowRoot.removeEventListener('animationend', removeDialog)
				dialog.style.animation = 'rollOut .4s ease-out forwards'
				this.shadowRoot.addEventListener('animationend', removeWrapper)
			}
			shadow.style.animation = 'fadeOut .2s linear forwards'
			this.shadowRoot.addEventListener('animationend', removeDialog)
		}

		this.onkeydown = (e) => {
			if (e.key == 'Enter')
				yBt.click()
			else if (e.key == 'Escape')
				if (footer.querySelector('#nBt'))
					nBt.click()
				else
					yBt.click()
		}

		setTimeout(() => {
			this.classList.add(app.darkTheme ? 'darkTheme' : 'lightTheme')
		}, 0)
	}
}

customElements.define('z-dialog', zDialog)