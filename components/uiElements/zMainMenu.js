const style = document.createElement('style')
style.textContent = /*css*/`
	header {
		position: fixed;
		top: 0;
		background: var(--dark-bg2-transparent);
		/*transition: .2s;*/
		width: 100%;
		height: 40px;
		backdrop-filter: blur(7px);
		box-shadow: 0 1px 2px var(--dark-bg1);
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 7px;
	}

	#defaultTitle {
		font-size: 18px;
		white-space: nowrap;
		padding: 3px 17px;
	}

	:host(.lightTheme) header {
		background: var(--light-bg2-transparent);
		box-shadow: 0 1px 2px var(--dark-bg4-transparent);
	}

	#menuBtContainer {
		width: 40px;
		max-width: 300px;
		height: 100%;
		background: var(--dark-bg1-transparent);
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 4px;
		box-sizing: border-box;
		transition: width .4s ease-in-out/*, background .2s*/;
		box-shadow: 0 0 2px var(--dark-bg1);
	}

	:host(.lightTheme) #menuBtContainer {
		background: var(--light-bg1-transparent);
		box-shadow: 0 0 2px var(--dark-bg4-transparent);
	}
	
	#menuBt {
		position: relative;
		width: 32px;
		min-width: 32px;
		height: 32px;
		right: 0;
		border-radius: 0.2rem;
		border: none;
		outline: none;
		padding: 6px;
		background: transparent;
		cursor: pointer;
		/*transition: .1s;*/
		display: grid;
		place-items: center center;
		margin-left: 17px;
	}
	
	#menuSVG {
		width: 100%;
		height: 100%;
		transform-origin: center;
		transition: transform 0.8s, scale .2s;
		stroke: var(--light-bg1);
	}

	:host(.lightTheme) #menuSVG {
		stroke: var(--dark-bg4);
	}

	#menuBt:hover #menuSVG,
	#menuBt:focus #menuSVG{
		stroke: var(--light-bg4);
	}

	:host(.lightTheme) #menuBt:hover #menuSVG,
	:host(.lightTheme) #menuBt:focus #menuSVG{
		stroke: var(--dark-bg1);
	}

	#menuBt:active #menuSVG {
		filter: brightness(.7);
		scale: .7;
	}

	#menu {
		background: var(--dark-bg2-transparent);
		position: fixed;
		top: 40px;
		left: -310px;
		width: 100%;
		max-width: 300px;
		height: calc(100vh - 40px);
		padding: 43px 0 3px;
		box-sizing: border-box;
		transition: left .2s;
		user-select: none;
		box-shadow: 1px 1px 2px var(--dark-bg1);
		display: flex;
		flex-direction: column;
		backdrop-filter: blur(7px);
		overflow: hidden;
	}

	:host(.lightTheme) #menu {
		background: var(--light-bg2-transparent);
		box-shadow: 1px 1px 2px var(--dark-bg4-transparent);
	}

	#shadow {
		/*transform: scale(0);*/
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: var(--dark-bg1-transparent);
		opacity: 0;
		transition: opacity .2s, backdrop-filter .2s ease-in;
		display: block;
		pointer-events: none;
		backdrop-filter: blur(0px);
	}

	:host(.lightTheme) #shadow {
		background: var(--dark-bg4-transparent);
	}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<div id="shadow"></div>

	<nav id="menu">
		<slot name="menu">
			<z-menuitem icon="home" path="#/">Home</z-menuitem>
			<z-menuitem icon="info" path="{
				name: 'About', 
				params: { 
					workWithParams: true,
					rateIt: 10
				}
			}">About</z-menuitem>
		</slot>
	</nav>

	<header>
		<div id="menuBtContainer" style="fill: red; color: red;">
			<img id="logo" src="/assets/logo.svg" style="height: 32px; margin: 1px auto 0 7px;"/>
			<button id="menuBt">
				<svg id="menuSVG" viewBox="0 0 32 27">
					<g style="stroke-width:6; stroke-linecap:round;">
						<line x1="3" y1="3" x2="29" y2="3">
							<animate class="showAnimation" attributeType="XML" attributeName="x1" begin="indefinite" from="3" to="18" dur=".4s" fill="freeze" />
							<animate class="showAnimation" attributeType="XML" attributeName="y2" begin="indefinite" from="3" to="13" dur=".4s" fill="freeze" />
							<animate class="hideAnimation" attributeType="XML" attributeName="x1" begin="indefinite" from="10" to="3" dur=".4s" fill="freeze" />
							<animate class="hideAnimation" attributeType="XML" attributeName="y2" begin="indefinite" from="13" to="3" dur=".4s" fill="freeze" />
						</line>
						<line x1="3" y1="13" x2="29" y2="13" />
						<line x1="3" y1="23" x2="29" y2="23">
							<animate class="showAnimation" attributeType="XML" attributeName="x1" begin="indefinite" from="3" to="18" dur=".4s" fill="freeze" />
							<animate class="showAnimation" attributeType="XML" attributeName="y2" begin="indefinite" from="23" to="13" dur=".4s" fill="freeze" />
							<animate class="hideAnimation" attributeType="XML" attributeName="x1" begin="indefinite" from="10" to="3" dur=".4s" fill="freeze" />
							<animate class="hideAnimation" attributeType="XML" attributeName="y2" begin="indefinite" from="13" to="23" dur=".4s" fill="freeze" />
						</line>
					</g>
				</svg >
			</button>
		</div>
		<slot name="header">
			<b id="defaultTitle"></b>
		</slot>
	</header>
`
export default class zMainMenu extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.showMenu = () => {
			this.showingMenu = !this.showingMenu
			let shadowDiv = this.shadowRoot.querySelector('#shadow')
			let menuBtContainer = this.shadowRoot.querySelector('#menuBtContainer')
			let menuSVG = this.shadowRoot.querySelector('#menuSVG')
			let menu = this.shadowRoot.querySelector('#menu')
			let logo = this.shadowRoot.querySelector('#logo')
			if (this.showingMenu) {
				// shadowDiv.style.transform = 'scale(1)'
				shadowDiv.style.pointerEvents = 'all'
				shadowDiv.style.opacity = '1'
				shadowDiv.onclick = this.showMenu
				menuBtContainer.style.width = '300px'
				menu.style.left = '0'
				logo.src = `${app.darkTheme? '/assets/logo.svg' : '/assets/white-logo.svg'}`
				setTimeout(() => {
					let animationElements = Array.from(this.shadowRoot.querySelectorAll('.showAnimation'))
					animationElements.map((element) => {
						element.beginElement()
					})
					menuSVG.style.transform = "rotateZ(180deg)"
					setTimeout(() => {
						shadowDiv.style.backdropFilter = 'blur(5px)'
					}, 75)
				}, 125)
			}
			else {
				shadowDiv.style.backdropFilter = 'blur(0px)'
				setTimeout(() => {
					shadowDiv.style.opacity = '0'
					shadowDiv.addEventListener('transitionend', this.removeShadow)
					shadowDiv.onclick = null
					menuBtContainer.style.width = '40px'
					menu.style.left = '-310px'

					let animationElements = Array.from(this.shadowRoot.querySelectorAll('.hideAnimation'))
					animationElements.map((element) => {
						element.beginElement()
					})
					menuSVG.style.transform = "rotateZ(0deg)"
				}, 200)
			}
		}

		this.removeShadow = () => {
			let shadowDiv = this.shadowRoot.querySelector('#shadow')
			shadowDiv.removeEventListener('transitionend', this.removeShadow)
			// shadowDiv.style.transform = 'scale(0)'
			shadowDiv.style.pointerEvents = 'none'
		}

		setTimeout(() => {
			this.classList.add(app.darkTheme ? 'darkTheme' : 'lightTheme')
		}, 0)
	}

	connectedCallback() {
		this.shadowRoot.querySelector('#menuBt').onclick = this.showMenu
		this.shadowRoot.querySelector('#shadow').onclick = this.showMenu
		this.shadowRoot.querySelector('#defaultTitle').textContent = document.title
		window.addEventListener('hashchange', () => {
			if (this.showingMenu) {
				setTimeout(() => {
					this.showMenu()
				}, 0)
			}
		})
	}
}

customElements.define('z-mainmenu', zMainMenu)