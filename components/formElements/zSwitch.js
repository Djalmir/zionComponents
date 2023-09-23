const style = document.createElement('style')
style.textContent = /*css*/`

	#wrapper {
		
	}

`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<div id="wrapper">
		<z-icon id="left-icon" size="1.5"></z-icon>
		<div id="switch"></div>
		<z-icon id="right-icon" size="1.5"></z-icon>
	</div>
`
export default class zSwitch extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

	}
}

customElements.define('z-switch', zSwitch)