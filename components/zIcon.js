const template = document.createElement('template')
template.innerHTML = /*html*/`
<svg>
	<use></use>
</svg>
`
export default class zIcon extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		let svg = this.shadowRoot.querySelector('svg')
		svg.style = `
			border-radius: .4rem;
			min-width: ${ this.getAttribute('size') || this.size || 1 }rem;
			min-height: ${ this.getAttribute('size') || this.size || 1 }rem;
			width: ${ this.getAttribute('size') || this.size || 1 }rem;
			height: ${ this.getAttribute('size') || this.size || 1 }rem;
		`

		let use = this.shadowRoot.querySelector('use')
		console.log('origin:', window.location.origin)
		use.setAttribute('href', `${window.location.origin.includes('github.io')?'/zionComponents':''}/assets/svgLib.svg#` + (this.getAttribute('class') || this.class))
	}
}

customElements.define('z-icon', zIcon)