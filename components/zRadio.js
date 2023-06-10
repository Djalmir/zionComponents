const style = document.createElement('style')
style.textContent = /*css*/`
:host {
	display: inline-block;
	vertical-align: middle;
	background: none !important;
	border: none !important;
	box-shadow: none !important;
	--activeColor: var(--primary);
}

input {
	appearance: none;
	background: #fff;
	margin: 0;
	font: inherit;
	min-width: 1em;
	min-height: 1em;
	width: 1em;
	height: 1em;
	max-width: 1em;
	max-height: 1em;
	border: .15em solid #fff;
	border-radius: 50%;
	transform: translateY(-0.075em);
	display: grid;
	place-content: center;
	transition: .2s;
	cursor: pointer;
	box-shadow: var(--box-shadow)
}

input:hover,
input:focus {
	box-shadow: 1px 2px 5px #000000d0;
	border: .15em solid var(--activeColor);
}

input:active {
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
		const globalStyles = [...Array.from(document.querySelectorAll('[rel=stylesheet]')), ...Array.from(document.querySelectorAll('head style'))]
		globalStyles.map((style) => {
			this.shadowRoot.appendChild(style.cloneNode(true))
		})
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

		if (this.shadowRoot.host.parentElement.tagName == 'LABEL')
			this.shadowRoot.host.parentElement.addEventListener('click', () => { this.input.click() })
		else if (this.getRootNode().querySelector(`[for="${ this.id }"]`))
			this.getRootNode().querySelector(`[for="${ this.id }"]`).addEventListener('click', () => { this.input.click() })

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