const style = document.createElement('style')
style.textContent = /*css*/`
section {
	margin: 35px 0;
	padding: 70px 5vw;
	width: 100vw;
	overflow: hidden;
}

#previewsWrapper {
	overflow: auto;
}

#previews {
	margin: auto;
	display: flex;
	gap: 35px;
	width: fit-content;
}

.card {
	background: var(--dark-bg3);
	padding: 25px 17px 17px;
	border-radius: .5rem;
	width: 800px;
	max-width: 90vw;
	box-shadow: var(--box-shadow);
}

.lightTheme .card {
	background: var(--light-bg3);
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
	transition: .4s;
}

.checkboxesGrid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	place-items: center;
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

#searchInputWrapper {
	width: 100%;
	display: flex;
}

#iconSearchInput {
	margin-left: auto;
	width: 100%;
	max-width: 463px;
	min-width: 120px;
	transition: .4s;
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
	padding: 12px;
	gap: 7px;
	background: var(--secondary);
	color: var(--light-font1); 
	fill: var(--light-font1);
	font-size: .9rem;
	text-align: center;
	border-radius: .4rem;
	cursor: pointer;
	transition: .4s;
	flex: 1;
	min-width: 100px;
	max-width: 160px;
	box-shadow: var(--box-shadow);
}

.lightTheme .svgCard {
	background: var(--secondary-light);
	color: var(--dark-font2); 
	fill: var(--dark-font2);
}

.svgCard:hover {
	background: var(--secondary-light);
	color: var(--dark-font1); 
	fill: var(--dark-font1);
	transition: .1s;
}

.lightTheme .svgCard:hover {
	background: var(--secondary);
	color: var(--light-font1); 
	fill: var(--light-font1);
}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
<div id="view" class="${ app.darkTheme ? 'darkTheme' : 'lightTheme' }">
	
	<label style="cursor: pointer; margin-left: 5vw">
		<z-checkbox z-model="darkTheme"></z-checkbox>
		Tema escuro
	</label>

	<section id="previewsWrapper">

		<div id="previews">

			<div class="card">
				<b class="title">Inputs</b>
				<div class="flexDiv">
					<z-input placeholder="Nome" z-model="name" class="secondary input"></z-input>
					<z-input type="tel" placeholder="Whatsapp" z-model="phone" z-oninput="setPhoneMask" class="secondary input">
						<!--<z-icon class="message-circle" size="1.5" slot="left-slot" style="transform: translateY(2px); padding: 0 3px; stroke: transparent"></z-icon>-->
					</z-input>
				</div>
				<div class="flexDiv">
					<z-input placeholder="Endereço" z-model="address" style="flex: 2;" class="secondary input"></z-input>
					<z-number-input type="number" placeholder="Número" z-model="number" class="secondary input" min="0"></z-number-input>
				</div>				
			</div>

			<div class="card">
				<b class="title">Checkboxes</b>
				<div class="checkboxesGrid">
					<label z-for="className in themeClasses">
						<z-checkbox z-model="rememberUser" class="{{className}}"></z-checkbox>
						<span>Lembrar usuário</span>
					</label>
				</div>
			</div>

			<div class="card">
				<b class="title">Radios</b>
				<div class="checkboxesGrid" style="place-items: start; width: fit-content; margin: auto;">
					<label z-for="className in themeClasses">
						<z-radio z-model="radiobuttonsTheme" value="{{className}}" class="{{className}}"></z-radio>
						<span>{{className}}</span>
					</label>
				</div>
			</div>
		
		</div>

	</section>

	<section>
		<div id="svgLibCard" class="card">
			<b class="title">Icones</b><br/>
			<div id="searchInputWrapper">
				<z-input placeholder="Pesquisa" z-model="iconSearch" class="${ app.darkTheme ? 'secondary-light' : 'secondary' }" id="iconSearchInput">
					<div slot="left-slot" style="display: grid; place-items:center; padding: 3px 5px;">
						<z-icon class="search" size="1.5"></z-icon>
					</div>
					<div slot="right-slot" style="display: grid; place-items:center;">
						<z-icon id="clearSearchButton" class="close" z-if="iconSearch" size="1.2" z-onclick="()=>{ this.iconSearch = ''}"></z-icon>
					</div>
				</z-input>
			</div>
			<div id="svgLib">
				<div z-for="svgId in filteredSvgLib" class="svgCard">
					<z-icon class="{{svgId}}" size="2.5"></z-icon>
					<span>{{svgId}}</span>
				</div>
			</div>
		</div>
	</section>

</div>
`

import zInput from '../components/zInput.js'
import zNumberInput from '../components/zNumberInput.js'
import zCheckbox from '../components/zCheckbox.js'
import zIcon from '../components/zIcon.js'
import zRadio from '../components/zRadio.js'

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
				Array.from(this.shadowRoot.querySelectorAll('.input')).map((input) => {
					input.classList.replace(`${ app.darkTheme ? 'light-bg4' : 'secondary' }`, `${ app.darkTheme ? 'secondary' : 'light-bg4' }`)
				})
				this.shadowRoot.querySelector('#iconSearchInput').classList.replace(`${ app.darkTheme ? 'secondary-light' : 'secondary' }`, `${ app.darkTheme ? 'secondary' : 'secondary-light' }`)
			}
		}

		this.themeClasses = ['primary', 'primary-light', 'secondary', 'secondary-light', 'danger', 'danger-light', 'success', 'success-light']
		this.name = ''
		this.phone = ''
		this.address = ''
		this.number = null
		this.birthday = ''
		this.rememberUser = true
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

		this.svgLib = ['']
		this.filteredSvgLib = ['']
		fetch(`${ window.location.origin.includes('github.io') ? `/zionComponents` : '' }/assets/svgLib.svg`)
			.then(res => res.text())
			.then((res) => {
				let arr = []
				res.match(/(id=".+?")/g).map((idStr) => {
					arr.push(idStr.replace(`id="`, '').replace(`"`, ''))
				})
				this.svgLib = arr
				this.filteredSvgLib = arr
			})
	}

	connectedCallback() {
		setTimeout(() => {
			Array.from(this.shadowRoot.querySelectorAll('.card')).map((card) => {
				card.style.transition = 'background .4s, color .4s'
			})
		}, 0)
		Array.from(this.shadowRoot.querySelectorAll('.input')).map((input) => {
			input.classList.replace(`${ app.darkTheme ? 'light-bg4' : 'secondary' }`, `${ app.darkTheme ? 'secondary' : 'light-bg4' }`)
		})
		this.shadowRoot.querySelector('#iconSearchInput').classList.replace(`${ app.darkTheme ? 'secondary-light' : 'secondary' }`, `${ app.darkTheme ? 'secondary' : 'secondary-light' }`)
	}
}

customElements.define('view-home', Home)