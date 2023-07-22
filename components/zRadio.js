const style = document.createElement('style')
style.textContent = /*css*/`

:host {
	display: inline-block;
	vertical-align: middle;
	background: none !important;
	border: none !important;
	box-shadow: none !important;

	--primary: #0059ff;
	--primary-light: #4385ff;

	--secondary: #4e4e57;
	--secondary-light: #a5a5b3;

	--danger: #be0000;
	--danger-light: #ff5757;

	--success: #00921d;
	--success-light: #25e94c;

	--box-shadow: 1px 1px 2px #000000d0;

	--activeColor: var(--primary);
}

input {
	appearance: none;
	background: #fff;
	margin: 0;
	font: inherit;
	min-width: 1.15em;
	min-height: 1.15em;
	width: 1.15em;
	height: 1.15em;
	max-width: 1.15em;
	max-height: 1.15em;
	border: .15em solid #fff;
	border-radius: 50%;
	transform: translateY(-0.075em);
	display: grid;
	place-content: center;
	transition: .2s;
	cursor: pointer;
	box-shadow: 1px 1px 2px #000000d0;
}

input:hover,
input.hover,
input:focus {
	box-shadow: 1px 2px 5px #000000d0;
	border: .15em solid var(--activeColor);
}

input:active,
input.active {
	box-shadow: 1px 2px 5px -2px #000000d0;
	background: var(--activeColor);
	filter: brightness(.8);
}

input:checked {
	background: var(--activeColor);
	border: .15em solid var(--activeColor);
}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<input type="radio"/>
`
export default class zRadio extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		// const globalStyles = [...Array.from(document.querySelectorAll('[rel=stylesheet]')), ...Array.from(document.querySelectorAll('head style'))]
		// globalStyles.map((style) => {
		// 	this.shadowRoot.appendChild(style.cloneNode(true))
		// })
		this.shadowRoot.appendChild(style.cloneNode(true))

		let themeClasses = ['primary', 'primary-light', 'secondary', 'secondary-light', 'danger', 'danger-light', 'success', 'success-light']
		Array.from(this.classList).map((className) => {
			if (themeClasses.includes(className)) {
				this.shadowRoot.host.style.setProperty('--activeColor', `var(--${ className })`)
			}
		})
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.input = this.shadowRoot.querySelector('input')
		Array.from(this.attributes).map(attr => {
			this.input.setAttribute(attr.name, attr.value)
		})

		this.input.addEventListener('click', (e) => { e.stopPropagation() })

		this.label = null
		if (this.shadowRoot.host.parentElement.tagName == 'LABEL')
			this.label = this.shadowRoot.host.parentElement
		else if (this.getRootNode().querySelector(`[for="${ this.id }"]`))
			this.label = this.getRootNode().querySelector(`[for="${ this.id }"]`)
		if (this.label) {
			this.label.addEventListener('mouseenter', () => {
				this.input.classList.add('hover')
			})
			this.label.addEventListener('touchstart', () => {
				this.input.classList.add('hover')
			})
			this.label.addEventListener('mouseleave', () => {
				this.input.classList.remove('hover')
				this.input.classList.remove('active')
			})
			this.label.addEventListener('touchend', () => {
				this.input.classList.remove('hover')
				this.input.classList.remove('active')
			})
			this.label.addEventListener('mousedown', () => {
				this.input.classList.add('active')
			})
			this.label.addEventListener('mouseup', () => {
				this.input.classList.remove('active')
			})
			this.label.addEventListener('click', () => { this.input.click() })
		}

		this.input.addEventListener('change', (e) => {
			this.checked = e.target.checked
			this.dispatchEvent(new Event('change'))
		})
	}

	get name() {
		return this.input.name
	}
	set name(value) {
		this.input.name = value
	}

	get value() {
		return this.input.value
	}
	set value(value) {
		this.input.value = value
	}

	get checked() {
		return this.input.checked
	}
	set checked(val) {
		this.input.checked = val
		if (val && this.name) {
			const radioButtons = [...document.querySelectorAll(`z-radio[name="${ this.name }"]`), ...this.getRootNode().querySelectorAll(`z-radio[name="${ this.name }"]`)]
			radioButtons.forEach(button => {
				if (button !== this) {
					button.checked = false
				}
			})
		}
	}

	static get observedAttributes() {
		return ['checked']
	}

	attributeChangedCallback(attribute, oldValue, newValue) {
		switch (attribute) {
			case 'checked':
				this.input.checked = newValue
				break
		}
	}
}

customElements.define('z-radio', zRadio)