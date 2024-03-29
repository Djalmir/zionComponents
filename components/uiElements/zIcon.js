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
			display: block;
			min-width: ${ this.getAttribute('size') || this.size || 1 }rem;
			min-height: ${ this.getAttribute('size') || this.size || 1 }rem;
			width: ${ this.getAttribute('size') || this.size || 1 }rem;
			height: ${ this.getAttribute('size') || this.size || 1 }rem;
			color: inherit;
			fill: inherit;
			stroke: inherit;
		`

		let use = this.shadowRoot.querySelector('use')
		use.setAttribute('href', '/assets/svgLib.svg#' + (this.getAttribute('class') || this.class))
	}
}

customElements.define('z-icon', zIcon)