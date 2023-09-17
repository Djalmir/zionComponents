const style = document.createElement('style')
style.textContent = /*css*/`

	h1 {
		text-align: center;
		text-shadow: 1px 1px 1px #039;
	}

`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<div id='view' class='${ app.darkTheme ? 'darkTheme' : 'lightTheme' }'>

		<h1>{{message}}</h1>
		
	</div>
`
export default class About extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({mode: 'open'})
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.message = 'Hello World!'
	}
}

customElements.define('view-about', About)