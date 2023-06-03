const style = document.createElement('style')
style.innerText = /*css*/`
	:host {
		border: none!important;
		background: transparent!important;
		box-shadow: none!important;
		display: inline-block;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	label {
		position: relative;
		width: 100%;
		margin: 22px 0;
		background: #fff;
		color: #000;
		padding: 2px;
		border: inherit;
		border-radius: .2rem;
		display: flex;
	}

	input {
		width: 100%;
		border-radius: .1rem;
		padding: 8px 7px;
		border: none;
		outline: none;
		transition: box-shadow .2s;
		background: inherit;
		color: inherit;
	}

	input::placeholder {
		opacity: 0;
		color: transparent;
	}

	input:focus,
	input:not(:placeholder-shown) {
		box-shadow: inset 0 0 5px #00000070;
	}

	b {
		position: absolute;
		bottom: 100%;
		left: 5px;
		font-size: 14px;
		transition: all .2s ease-out, background 0s, color 0s;
		white-space: nowrap;
		background: inherit;
		color: inherit;
		border-radius: .2rem .2rem 0 0;
		padding: 2px 5px 0;
		line-height: 15px;
	}

	input:placeholder-shown:not(:focus) ~ b {
		bottom: 0;		
		transform: translateY(-50%);
		left: 12px;
		border: none;
		padding: 0;
		font-size: 16px;
		line-height: 18px;
		cursor: text;
	}
	
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<label>
		<input type="text">
		<b></b>
	</label>
`

export default class zInput extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({mode: 'open'})
		const globalStyles = [...Array.from(document.querySelectorAll('[rel=stylesheet]')), ...Array.from(document.querySelectorAll('head style'))]
		globalStyles.map((style) => {
			this.shadowRoot.appendChild(style.cloneNode(true))
		})
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.shadowRoot.querySelector('label').id = this.getAttribute('id')
		this.shadowRoot.querySelector('label').classList.add(this.getAttribute('class'))
		this.shadowRoot.querySelector('input').value = this.getAttribute('value') || this.value
		this.shadowRoot.querySelector('input').placeholder = this.getAttribute('placeholder') || this.placeholder
		if (this.getAttribute('maxlength') || this.maxLength)
			this.shadowRoot.querySelector('input').maxLength = this.getAttribute('maxlength') || this.maxLength
		this.shadowRoot.querySelector('b').innerText = this.getAttribute('placeholder') || this.placeholder
	}

	get placeholder() {
		return this.shadowRoot.querySelector('b').innerText
	}
	set placeholder(val) {
		this.shadowRoot.querySelector('b').innerText = val
	}

	get value() {
		return this.shadowRoot.querySelector('input').value
	}
	set value(val) {
		this.shadowRoot.querySelector('input').value = val
	}

	get maxLength() {
		return this.shadowRoot.querySelector('input').getAttribute('maxlength')
	}
	set maxLength(val) {
		this.shadowRoot.querySelector('input').setAttribute('maxlength', val)
	}

	static get observedAttributes() {
		return ['placeholder', 'value', 'maxlength']
	}

	attributeChangedCallback(attribute, oldValue, newValue) {
		switch (attribute) {
			case 'placeholder':
				this.shadowRoot.querySelector('b').innerText = newValue
				break
			case 'value':
				this.shadowRoot.querySelector('input').value = newValue
				break
			case 'maxlength':
				this.shadowRoot.querySelector('input').setAttribute('maxlength', newValue)
				break
		}
	}
}

customElements.define('z-input', zInput)