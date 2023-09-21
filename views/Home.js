const style = document.createElement('style')
style.textContent = /*css*/`
section {
	margin: 35px 0;
	padding: 70px 5vw;
	overflow: hidden;
}

#previewsWrapper {
	overflow: auto;
}

#previews {
	margin: auto;
	display: flex;
	align-items: flex-start;
	gap: 35px;
	width: fit-content;
}

.card {
	background: linear-gradient(to bottom right, var(--dark-bg3), var(--dark-bg2));
	padding: 25px 17px 17px;
	border-radius: .5rem;
	width: 480px;
	max-width: 90vw;
	box-shadow: var(--box-shadow);
}

:host(.lightTheme) .card {
	background: linear-gradient(to bottom right, var(--light-bg2), var(--light-bg1));
}

b.title {
	font-size: 22px;
	line-height: 22px;
	display: block;
	text-align: center;
	margin-bottom: 22px;
}

.flexDiv {
	padding: 0;
	margin-bottom: 22px;
	display: flex;
	gap: 13px;
}

.input {
	flex: 1;
	/*transition: .2s;*/
}

.checkboxesGrid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	place-items: start;
	width: fit-content;
	margin: auto;
	gap: 17px;
}

.checkboxesGrid label {
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 7px;
}

.checkboxesGrid label span {
	font-weight: 500;
	font-size: 1em;
	line-height: 1em;
	text-transform: capitalize;
	white-space: nowrap;
}

#svgLibCard {
	width: 1920px;
	max-width: 90vw;
}

#searchInputWrapper {
	width: 100%;
	display: flex;
}

#iconSearchInput {
	margin-left: auto;
	width: 100%;
	max-width: 463px;
	min-width: 120px;
	/*transition: .2s;*/
}

#clearSearchButton {
	cursor: pointer;
	margin: 3px 3px 3px 5px;
}

#clearSearchButton:hover {
	fill: var(--primary-light);
	stroke: var(--primary-light);
}

#clearSearchButton:active {
	filter: brightness(.9);
}

#svgLib {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 17px;
	margin-top: 33px;
}

.svgCard {
	display: grid;
	grid-template-rows: 1fr;
	place-items: center;
	padding: 7px;
	gap: 7px;
	background: var(--dark-bg2);
	color: var(--light-font1); 
	fill: var(--light-font1);
	font-size: .9rem;
	text-align: center;
	border-radius: .4rem;
	cursor: pointer;
	/*transition: .2s;*/
	flex: 1;
	min-width: 100px;
	max-width: 160px;
	box-shadow: var(--box-shadow);
	user-select: none;
}

:host(.lightTheme) .svgCard {
	background: var(--light-bg1);
	color: var(--dark-font2); 
	fill: var(--dark-font2);
}

.svgCard:hover {
	background: var(--primary);	
	transition: .1s;
}

:host(.lightTheme) .svgCard:hover {
	background: var(--primary);
	color: var(--light-font1); 
	fill: var(--light-font1);
}

.svgCard:active {
	filter: brightness(.9);
	box-shadow: inset var(--box-shadow);
}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`	
	<label style="cursor: pointer; margin-left: 5vw">
		<z-checkbox z-model="darkTheme"></z-checkbox>
		Tema escuro
	</label>

	<section id="previewsWrapper">
		<div id="previews">
			<div class="card">
				<b class="title">Buttons</b>
				<div style="display: flex; align-items: center; justify-content: space-between; gap: 7px; flex-wrap: wrap;">
					<fragment z-for="className in themeClasses">
						<z-button class="{{className}}" style="min-width: 100px;">Clique aqui</z-button>
					</fragment>
				</div>
			</div>
			<div class="card">
				<b class="title">Inputs</b>
				<div class="flexDiv">
					<z-input placeholder="Nome" class="dark-bg2 input" z-model="name" autofocus></z-input>
					<z-input type="tel" placeholder="Whatsapp" z-oninput="setPhoneMask" class="dark-bg2 input">
						<!--<z-icon class="message-circle" size="1.5" slot="left-slot" style="transform: translateY(2px); padding: 0 3px; stroke: transparent"></z-icon>-->
					</z-input>
				</div>
				<div class="flexDiv">
					<z-input placeholder="Endereço" style="flex: 2;" class="dark-bg2 input" z-onchange="test"></z-input>
					<z-number-input type="number" placeholder="Número" class="dark-bg2 input" min="0" z-onchange="test"></z-number-input>
				</div>
				<div class="flexDiv">
					<z-textarea class="dark-bg2 input" placeholder="Observações" rows="5" style="max-width: 446px;" z-model="obs"></z-textarea>
				</div>
			</div>
			<div class="card">
				<b class="title">Checkboxes</b>
				<div class="checkboxesGrid">
					<label z-for="className in themeClasses">
						<z-checkbox class="{{className}}" checked="true" z-onchange="test"></z-checkbox>
						<span>{{className}}</span>
					</label>
				</div>
			</div>
			<div class="card">
				<b class="title">Radios</b>
				<div class="checkboxesGrid">
					<label z-for="className in themeClasses">
						<z-radio name="radiobuttons" z-model="radiobuttonsTheme" value="{{className}}" class="{{className}}" z-onchange="test2"></z-radio>
						<span>{{className}}</span>
					</label>
				</div>
			</div>		
		</div>
	</section>

	<section>
		<div id="svgLibCard">
			<b class="title">Icones</b><br/>
			<div id="searchInputWrapper">
				<z-input placeholder="Pesquisa" z-model="iconSearch" class="${ app.darkTheme ? 'light-bg2' : 'dark-bg2' }" id="iconSearchInput">
					<div slot="left-slot" style="display: grid; place-items:center; padding: 3px 5px;">
						<z-icon class="search" size="1.5"></z-icon>
					</div>
					<div slot="right-slot" style="display: grid; place-items:center;">
						<z-icon id="clearSearchButton" class="x" z-if="iconSearch" size="1.2" z-onclick="()=>{ this.iconSearch = ''}"></z-icon>
					</div>
				</z-input>
			</div>
			<div id="svgLib">
				<fragment z-for="svgId in filteredSvgLib">
					<div class="svgCard" id="{{svgId}}" tabindex="0" z-onclick="copyIcon">
						<z-icon class="{{svgId}}" size="2.5" style="pointer-events: none;"></z-icon>
						<span style="pointer-events: none;">{{svgId}}</span>
					</div>
				</fragment>
			</div>
		</div>
	</section>
`

import '../zionComponents.js'
import { zDialog } from '../zionComponents.js'

export default class Home extends HTMLElement {
	constructor() {
		super()
		this.watch = {}
		this.attachShadow({ mode: 'open' })

		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.autoUpdatingTheme = false
		this.darkTheme = app.darkTheme
		document.addEventListener('themeUpdated', () => {
			this.autoUpdatingTheme = true
			this.darkTheme = app.darkTheme
		})
		this.watch.darkTheme = () => {
			if (this.autoUpdatingTheme)
				this.autoUpdatingTheme = false
			else {
				app.darkTheme = this.darkTheme
				this.updateInputsTheme()
			}
		}

		this.name = ''
		this.watch.name = () => {
			console.log(`Nome: ${ this.name }`)
		}

		this.themeClasses = ['primary', 'primary-light', 'secondary', 'secondary-light', 'danger', 'danger-light', 'success', 'success-light']
		this.iconSearch = ''
		this.radiobuttonsTheme = 'primary'

		this.watch.iconSearch = () => {
			if (this.iconSearch.trim()) {
				let filteredArr = this.svgLib.filter(svg => svg.includes(this.iconSearch))
				if (!filteredArr.length)
					filteredArr = ['Nenhum icone encontrado']
				this.filteredSvgLib = filteredArr
			}
			else
				this.filteredSvgLib = this.svgLib
			// this.shadowRoot.querySelector('#svgLibCard').scrollIntoView({ block: 'start' })
		}

		this.setPhoneMask = (e) => setMask(e, 'cellphone')


		this.svgLib = sessionStorage.getItem('svgLib') ? JSON.parse(sessionStorage.getItem('svgLib')) : ['Carregando...']
		this.filteredSvgLib = this.svgLib

		if (this.svgLib.length == 1) {
			fetch(`/assets/svgLib.svg`)
				.then(res => res.text())
				.then((res) => {
					let arr = []
					res.match(/(id=".+?")/g).forEach((idStr) => {
						arr.push(idStr.replace(`id="`, '').replace(`"`, ''))
					})
					this.svgLib = arr
					this.filteredSvgLib = arr
					sessionStorage.setItem('svgLib', JSON.stringify(arr))
				})
		}

		this.obs = ''
		this.watch.obs = () => {
			console.log(`Obs: ${ this.obs }`)
		}

		this.test = (e) => {
			console.log('test', e.target.value || e.target.checked)
		}

		this.test2 = () => {
			setTimeout(() => {
				console.log(this.radiobuttonsTheme)
			}, 0)
		}
		// const testBt = this.shadowRoot.querySelector('#previews').insertBefore(document.createElement('z-button'), this.shadowRoot.querySelector('#previews').firstChild)
		// testBt.id = 'testBt'
		// testBt.setAttribute('class', 'primary-light')
		// testBt.style = `
		// 	border-radius: 50% !important;
		// 	background-color: white;
		// `
		// testBt.innerText = 'Teste'

		this.copyIcon = (e) => {
			// navigator.clipboard.writeText(`
			// 	<z-icon class="${ e.target.id }" size="1"></z-icon>
			// `)
			// 	.then(() => {
			// 		document.querySelector('#zDialog').showMessage('<b style="font-size: 26px;">Sucesso</b>', "<b style='margin-bottom: 17px; display: block;'>Componente Copiado</b>")
			// 	})
			let input = document.body.appendChild(document.createElement('input'))
			input.value = `<z-icon class="${ e.target.id }" size="1"></z-icon>`
			input.select()
			input.setSelectionRange(0, 99999)
			document.execCommand('copy')
			document.body.removeChild(input)
			document.querySelector('#zDialog').showMessage('<b style="font-size: 26px;">Sucesso</b>', "<b style='margin-bottom: 17px; display: block;'>Componente Copiado</b>")
		}

		this.updateInputsTheme = () => {
			Array.from(this.shadowRoot.querySelectorAll('.input')).forEach((input) => {
				input.classList.replace(`${ app.darkTheme ? 'light-bg3' : 'dark-bg2' }`, `${ app.darkTheme ? 'dark-bg2' : 'light-bg3' }`)
			})
			this.shadowRoot.querySelector('#iconSearchInput').classList.replace(`${ app.darkTheme ? 'light-bg1' : 'dark-bg2' }`, `${ app.darkTheme ? 'dark-bg2' : 'light-bg1' }`)
		}

		this.classList.add(app.darkTheme ? 'darkTheme' : 'lightTheme')
	}

	connectedCallback() {
		this.updateInputsTheme()
	}
}

customElements.define('view-home', Home)