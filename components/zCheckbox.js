const style = document.createElement('style')
style.textContent = /*css*/`
:host {
	display: inline-block;
	vertical-align: middle;
	background: none !important;
	border: none !important;
	box-shadow: none !important;
	--activeColor: var(--primary);
	--checkColor: var(--light-font2);
}

input {
	appearance: none;
	background: #fff;
	margin: 0;
	font: inherit;
	width: 1.15em;
	min-width: 1.15em;
	height: 1.15em;
	min-height: 1.15em;
	border: .1em solid #fff;
	border-radius: .2rem;
	transform: translateY(-0.075em);
	display: grid;
	place-content: center;
	transition: .2s ease-in-out;
	cursor: inherit;
	box-shadow: 1px 1px 2px #000000d0;
}

input:hover,
input:focus {
	box-shadow: 1px 2px 5px #000000d0;
	border: .1em solid var(--activeColor);
}

input:active {
	box-shadow: 1px 1px 2px #000000d0;
}

input:checked {
	background: var(--activeColor);
	border: .1em solid var(--activeColor);
}

input::before {
	content: "";
	width: .85em;
	height: .85em;
	transform: scale(0);
	transition: .18s transform ease-in-out;
	box-shadow: inset 1em 1em var(--checkColor);
	clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

input:checked::before {
	transform: scale(.8);
}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<input type="checkbox"/>
`

export default class zCheckbox extends HTMLElement {
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
				if (className.includes('light')) {
					this.shadowRoot.host.style.setProperty('--checkColor', `var(--dark-font1)`)
				}
			}
		})

		this.shadowRoot.appendChild(template.content.cloneNode(true))

		const checkbox = this.shadowRoot.querySelector("[type='checkbox']")
		if (this.getAttribute('id'))
			checkbox.id = this.getAttribute('id')
		Array.from(this.classList).map((className) => {
			checkbox.classList.add(className)
		})
		checkbox.checked = this.getAttribute('checked') || this.checked

		checkbox.addEventListener('click', (e) => { e.stopPropagation() })

		if (this.shadowRoot.host.parentElement.tagName == 'LABEL')
			this.shadowRoot.host.parentElement.addEventListener('click', () => { checkbox.click() })
		else if (app.view.shadowRoot.querySelector(`[for=${ this.id }]`))
			app.view.shadowRoot.querySelector(`[for=${ this.id }]`).addEventListener('click', () => { checkbox.click() })
	}

	get checked() {
		return this.shadowRoot.querySelector("[type='checkbox']").checked
	}
	set checked(val) {
		this.shadowRoot.querySelector("[type='checkbox']").checked = val
	}

	static get observedAttributes() {
		return ['checked']
	}

	attributeChangedCallback(attribute, oldValue, newValue) {
		switch (attribute) {
			case 'checked':
				this.shadowRoot.querySelector("[type='checkbox']").checked = eval(newValue)
				break
		}
	}
}

customElements.define('z-checkbox', zCheckbox)