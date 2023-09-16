const style = document.createElement('style')
style.innerText = /*css*/`
	:host {
		border: none!important;
		background: transparent!important;
		box-shadow: none!important;
		display: inline-block;

		--dark-bg1: #1b1b1b;
		--dark-bg2: #242424;
		--dark-bg3: #3f3f3f;
		--dark-bg4: #6b6b6b;

		--light-bg1: #bdbdbd;
		--light-bg2: #dddddd;
		--light-bg3: #ededed;
		--light-bg4: #fefefe;

		--dark-font1: #1a1a1a;
		--dark-font2: #333333;

		--light-font1: #dddddd;
		--light-font2: #fdfdfd;

		--primary: #0059ff;
		--primary-light: #4385ff;

		--secondary: #4e4e57;
		--secondary-light: #a5a5b3;

		--danger: #be0000;
		--danger-light: #ff5757;

		--success: #00921d;
		--success-light: #25e94c;

		--box-shadow: 1px 1px 2px #000000d0;

		--input-left: 0;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	label {
		position: relative;
		width: 100%;
		background: #fff;
		color: #555;
		padding: 2px;
		border: inherit;
		border-radius: .2rem;
		display: flex;
		transition: inherit;
		box-shadow: var(--box-shadow);
	}

	textarea {
		width: 100%;
		border-radius: .1rem;
		padding: 5px 7px;
		border: none;
		outline: none;
		transition: box-shadow .2s;
		background: inherit;
		color: inherit;
		font-size: inherit;
	}

	textarea::placeholder {
		opacity: 0;
		color: transparent;
	}

	textarea:focus,
	textarea:not(:placeholder-shown) {
		box-shadow: inset 0 0 5px #00000070;
	}

	b {
		position: absolute;
		bottom: 100%;
		left: 7px;
		font-size: inherit;
		line-height: inherit;
		/*transition: all .2s ease-out, background 0s, color 0s;*/
		white-space: nowrap;
		background: inherit;
		color: inherit;
		border-radius: .2rem .2rem 0 0;
		padding: 2px 5px 0;
		transform: scale(.85) translate(-10%, 15%);
	}

	textarea:placeholder-shown:not(:focus) ~ b {
		bottom: 80%;
		transform: translateY(50%);
		left: var(--input-left);
		border: none;
		padding: 0;
		font-size: inherit;
		line-height: inherit;
		cursor: text;
	}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<label>
		<slot name="left-slot"></slot>
		<textarea></textarea>
		<b></b>
		<slot name="right-slot"></slot>
	</label>
`

export default class zTextarea extends HTMLElement {
	static get formAssociated() { return true }
	constructor() {
		super()
		this.internals = this.attachInternals()
		this.attachShadow({ mode: 'open' })
		// const globalStyles = [...Array.from(document.querySelectorAll('[rel=stylesheet]')), ...Array.from(document.querySelectorAll('head style'))]
		// globalStyles.map((style) => {
		// 	this.shadowRoot.appendChild(style.cloneNode(true))
		// })
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.themeStyle = null
		this.updateTheme = () => {
			let themeClasses = ['primary', 'primary-light', 'secondary', 'secondary-light', 'danger', 'danger-light', 'success', 'success-light', 'dark-bg1', 'dark-bg2', 'dark-bg3', 'dark-bg4', 'light-bg1', 'light-bg2', 'light-bg3', 'light-bg4']
			Array.from(this.classList).map((className) => {
				if (themeClasses.includes(className)) {
					if (this.themeStyle) {
						this.shadowRoot.removeChild(this.themeStyle)
					}
					this.themeStyle = document.createElement('style')
					this.themeStyle.textContent = /*css*/`
						.${ className } {
							background: var(--${ className });
							color: var(--${ className.includes('light') ? 'dark-font2' : 'light-font2' });
							fill: var(--${ className.includes('light') ? 'dark-font2' : 'light-font2' });
							stroke: var(--${ className.includes('light') ? 'dark-font2' : 'light-font2' });
						}

						textarea:-webkit-autofill,
						textarea:-webkit-autofill:hover,
						textarea:-webkit-autofill:focus {
							-webkit-box-shadow: inset 0 0 5px #000000d0, inset 0 0 0 1000px var(--${ className }) !important;
							box-shadow: inset 0 0 5px #000000d0, inset 0 0 0 1000px var(--${ className }) !important;
							-webkit-text-fill-color: var(--${ className.includes('light') ? 'dark-font2' : 'light-font2' }) !important;
						}
					`
					this.shadowRoot.appendChild(this.themeStyle)
				}

				this.shadowRoot.querySelector('label').classList.add(className)
			})
		}
		this.shadowRoot.appendChild(template.content.cloneNode(true))
		this.updateTheme()

		if (this.getAttribute('id'))
			this.shadowRoot.querySelector('label').id = this.getAttribute('id')

		this.textarea = this.shadowRoot.querySelector('textarea')
		if (this.attributes.length) {
			Array.from(this.attributes).map((attr) => {
				this.textarea.setAttribute(attr.name, attr.value)
			})
		}
		this.textarea.addEventListener('change', () => {
			this.dispatchEvent(new Event('change'))
		})
		this.shadowRoot.querySelector('b').innerText = this.getAttribute('placeholder') || this.placeholder

		this.checkValidity = () => {
			return this.textarea.checkValidity()
		}

	}

	get placeholder() {
		return this.shadowRoot.querySelector('b').innerText
	}
	set placeholder(val) {
		this.shadowRoot.querySelector('b').innerText = val
	}

	get value() {
		return this.shadowRoot.querySelector('textarea').value
	}
	set value(val) {
		this.shadowRoot.querySelector('textarea').value = val
	}

	get maxLength() {
		return this.shadowRoot.querySelector('textarea').getAttribute('maxlength')
	}
	set maxLength(val) {
		this.shadowRoot.querySelector('textarea').setAttribute('maxlength', val)
	}

	get type() {
		return this.shadowRoot.querySelector('textarea').getAttribute('type')
	}
	set type(val) {
		this.shadowRoot.querySelector('textarea').setAttribute('type', val)
	}


	static get observedAttributes() {
		return ['placeholder', 'value', 'maxlength', 'class', 'type', 'oninput', 'onblur', 'onchange', 'onclick', 'oncontextmenu', 'oncopy', 'ondblclick', 'onerror', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseup', 'onpaste', 'onsubmit', 'ontouchcancel', 'ontouchend', 'ontouchmove', 'ontouchstart']
	}

	attributeChangedCallback(attribute, oldValue, newValue) {
		let element
		switch (attribute) {
			case 'placeholder':
				element = this.shadowRoot.querySelector('b')
				break
			case 'class':
				if (this.getAttribute('class').length)
					this.updateTheme()
				break
			default:
				element = this.shadowRoot.querySelector('textarea')
		}
		if (element && attribute.startsWith('on')) {
			element.addEventListener(attribute.slice(2), eval(newValue))
		}
		else if (element && element.hasAttribute(attribute)) {
			element.setAttribute(attribute, newValue)
		}
	}


	connectedCallback() {
		setTimeout(() => {
			this.shadowRoot.host.style.setProperty('--input-left', this.shadowRoot.querySelector('textarea').getBoundingClientRect().x - this.getBoundingClientRect().x + 7 + 'px')
			setTimeout(() => {
				this.shadowRoot.querySelector('b').style.transition = 'all .2s ease-out, background 0s, color 0s'
			}, 250)
		}, 0)

		const { internals: { form } } = this

		this.shadowRoot.querySelector('textarea').addEventListener('keydown', (e) => {
			// console.log('this.internals', this.internals)
			if (e.key == 'Enter' && form)
				form.onsubmit()
		})

	}
}

customElements.define('z-textarea', zTextarea)
