const style = document.createElement('style')
style.textContent = /*css*/`
:host {
	display: inline-block;
	vertical-align: middle;
	background: none !important;
	border: none !important;
	box-shadow: none !important;

	--dark-bg0: #161616;
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

}

button {
	padding: 8px;
	border: none;
	border-radius: .2rem;
	font-size: .9em;
	font-weight: bold;
	cursor: pointer;
	filter: brightness(.8);
	margin: 13px 0;
	transition: .1s;
	box-shadow: var(--box-shadow);
}

button:hover,
button:focus {
	filter: brightness(1);
	/* box-shadow: 2px 2px 4px #000000d0; */
}

button:active {
	filter: brightness(.8);
	/* transform: scale(.99); */
	box-shadow: inset 2px 2px 4px #000000d0;
}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<button>
		<slot></slot>
	</button>	
`
export default class zButton extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
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
						button.${ className } {
							background: var(--${ className });
							color: var(--${ className.includes('light') ? 'dark-font2' : 'light-font2' });
							fill: var(--${ className.includes('light') ? 'dark-font2' : 'light-font2' });
							stroke: var(--${ className.includes('light') ? 'dark-font2' : 'light-font2' });
						}
					`
					this.shadowRoot.appendChild(this.themeStyle)
					console.log(this.themeStyle)
				}

			})
		}
		this.shadowRoot.appendChild(template.content.cloneNode(true))
		if (this.getAttribute('id'))
			this.shadowRoot.querySelector('button').id = this.getAttribute('id')
		if (this.classList.length) {
			Array.from(this.classList).map((className) => {
				this.shadowRoot.querySelector('button').classList.add(className)
			})
		}
		if (this.getAttribute('style')){
			console.log(this.getAttribute('style'))
			this.shadowRoot.querySelector('button').style = this.getAttribute('style')
		}
		this.updateTheme()

	}

	// static get observedAttributes() {
	// 	return ['class']
	// }

	// attributeChangedCallback(attribute, oldValue, newValue) {
	// 	switch (attribute) {
	// 		case 'class':
	// 			if (this.getAttribute('class').length) {
	// 				this.shadowRoot.querySelector('button').class = this.getAttribute('class')
	// 				this.updateTheme()
	// 			}
	// 			break
	// 	}
	// }
}

customElements.define('z-button', zButton)