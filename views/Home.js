const style = document.createElement('style')
style.textContent = /*css*/`
form {
	background: var(--dark-bg3);
	padding: 17px;
	border-radius: .5rem;
	margin: 30px auto;
	width: fit-content;
	box-shadow: var(--box-shadow);
}

`

const template = document.createElement('template')
template.innerHTML = /*html*/`
<form action="javascript:void(0)">
	<div class="flexDiv">
		<z-input id="nameInput" class="primary" placeholder="Nome" z-model="name"></z-input>
		<z-input id="phoneInput" class="primary" placeholder="Whatsapp" z-model="phone" z-oninput="setPhoneMask"></z-input>
	</div>
	<label style="cursor: pointer;">
		<z-checkbox z-model="rememberUser" id="rememberUserCheckbox"></z-checkbox>
		Lembrar usuário
	</label>
</form>
`

import zInput from '/components/zInput.js'
import zCheckbox from '/components/zCheckbox.js'

export default class Home extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })

		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.name = ''
		this.phone = ''
		this.rememberUser = true

		this.setPhoneMask = (e) => setMask(e, 'cellphone')
	}

	connectedCallback() {

	}
}

customElements.define('view-home', Home)