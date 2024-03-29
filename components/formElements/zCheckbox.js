const style = document.createElement('style')
style.textContent = /*css*/`
:host {
	display: inline-block;
	vertical-align: middle;
	background: none !important;
	border: none !important;
	outline: none !important;
	box-shadow: none !important;

	--primary: #0059ff;
	--primary-light: #4385ff;

	--secondary: #4e4e57;
	--secondary-light: #a5a5b3;

	--danger: #be0000;
	--danger-light: #ff5757;

	--success: #00921d;
	--success-light: #25e94c;

	--dark-font1: #1a1a1a;
	--dark-font2: #333333;

	--light-font1: #dddddd;
	--light-font2: #fdfdfd;

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
	border: .15em solid #fff;
	outline: none;
	border-radius: .2rem;
	transform: translateY(-0.075em);
	display: grid;
	place-content: center;
	transition: .2s ease-in-out;
	cursor: inherit;
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
		// const globalStyles = [...Array.from(document.querySelectorAll('[rel=stylesheet]')), ...Array.from(document.querySelectorAll('head style'))]
		// globalStyles.map((style) => {
		// 	this.shadowRoot.appendChild(style.cloneNode(true))
		// })
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

		this.input = this.shadowRoot.querySelector("[type='checkbox']")
		if (this.getAttribute('id'))
			this.input.id = this.getAttribute('id')
		Array.from(this.classList).map((className) => {
			this.input.classList.add(className)
		})
		this.input.checked = this.getAttribute('checked') || this.checked

		this.input.addEventListener('click', (e) => { e.stopPropagation() })
		this.input.addEventListener('change', () => {
			this.dispatchEvent(new Event('change'))
		})

		this.label = null
		if (this.shadowRoot.host.parentElement?.tagName == 'LABEL')
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
	}

	get checked() {
		return this.input.checked
	}
	set checked(val) {
		this.input.checked = val
	}

	static get observedAttributes() {
		return ['checked', 'onblur', 'onchange', 'onclick', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseup', 'ontouchcancel', 'ontouchend', 'ontouchmove', 'ontouchstart']
	}

	attributeChangedCallback(attribute, oldValue, newValue) {
		let element = this.input
		if (element && attribute.startsWith('on')) {
			element.addEventListener(attribute.slice(2), eval(newValue))
		}
		else if (element && element.hasAttribute(attribute)) {
			element.setAttribute(attribute, newValue)
		}
	}
}

customElements.define('z-checkbox', zCheckbox)