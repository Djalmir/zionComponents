const style = document.createElement('style')
style.textContent = /*css*/`
	h1 {
		text-align: center;
	}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<h1>{{message}}</h1>
	<form action="javascript:void(0)">
		<z-input id="nameInput" class="input" placeholder="Nome" z-model="name"></z-input>
		<z-input id="phoneInput" class="input" placeholder="Telefone" z-model="phone" z-oninput="setPhoneMask"></z-input>
	</form>
`

import zInput from '/components/zInput.js'

export default class Home extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		// const globalStyles = [...Array.from(document.querySelectorAll('[rel=stylesheet]')), ...Array.from(document.querySelectorAll('head style'))]
		// globalStyles.map((style) => {
		// 	this.shadowRoot.appendChild(style.cloneNode(true))
		// })
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.watch = {
			name: () => {
				console.log('app.view.name: ', this.name)
			}
		}
		this.message = 'Hello World!'
		this.name = ''
		this.phone = ''

		this.setPhoneMask = (e) => setMask(e, 'cellphone')
	}

	connectedCallback() {
		// this.shadowRoot.querySelector('z-input').value = this.name
	}
}

customElements.define('view-home', Home)