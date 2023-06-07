const style = document.createElement('style')
style.textContent = /*css*/`

`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	
`
export default class zNumberInput extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))


	}
}

customElements.define('z-number-input', zNumberInput)