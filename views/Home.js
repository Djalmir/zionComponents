const style = document.createElement('style')
style.textContent = /*css*/`
#previewsWrapper {
	margin: 35px auto;
	padding: 70px 5vw;
	max-width: 100%;
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
	width: 480px;
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

.flexDiv{
	padding: 0;
	margin-bottom: 22px;
	display: flex;
	gap: 7px;
	justify-content: space-evenly;
}

#svgLibCard{
	width: 80%;
	margin: 0 auto;
}

#svgLib {
	display: grid;
	gap: 17px;
	grid-template-columns: repeat( auto-fit, minmax(100px, 1fr) );
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
	transition: .75s;
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
				<b class="title">Inputs de texto</b>
				<div class="flexDiv">
					<z-input placeholder="Nome" z-model="name"></z-input>
					<z-input placeholder="Whatsapp" z-model="phone" z-oninput="setPhoneMask">
				</div>
				<div class="flexDiv">
					<z-input class="primary" placeholder="Nome" z-model="name"></z-input>
					<z-input class="primary-light" placeholder="Whatsapp" z-model="phone" z-oninput="setPhoneMask">
						<!--<button slot='left-slot'>Teste</button>
						<button slot='right-slot'>Teste</button>-->
					</z-input>
				</div>
				<div class="flexDiv">
					<z-input class="secondary" placeholder="Nome" z-model="name"></z-input>
					<z-input class="secondary-light" placeholder="Whatsapp" z-model="phone" z-oninput="setPhoneMask">
					</z-input>
				</div>
				<div class="flexDiv">
					<z-input class="danger" placeholder="Nome" z-model="name"></z-input>
					<z-input class="danger-light" placeholder="Whatsapp" z-model="phone" z-oninput="setPhoneMask">
					</z-input>
				</div>
				<div class="flexDiv">
					<z-input class="success" placeholder="Nome" z-model="name"></z-input>
					<z-input class="success-light" placeholder="Whatsapp" z-model="phone" z-oninput="setPhoneMask">
					</z-input>
				</div>
			</div>

			<div class="card">
				<b class="title">Checkboxes</b>
				<div class="flexDiv">
					<label style="cursor: pointer;">
						<z-checkbox z-model="rememberUser" class="primary"></z-checkbox>
						Lembrar usuário
					</label>
					<label style="cursor: pointer;">
						<z-checkbox z-model="rememberUser" class="primary-light"></z-checkbox>
						Lembrar usuário
					</label>
				</div>
				<div class="flexDiv">
					<label style="cursor: pointer;">
						<z-checkbox z-model="rememberUser" class="secondary"></z-checkbox>
						Lembrar usuário
					</label>
					<label style="cursor: pointer;">
						<z-checkbox z-model="rememberUser" class="secondary-light"></z-checkbox>
						Lembrar usuário
					</label>
				</div>
				<div class="flexDiv">
					<label style="cursor: pointer;">
						<z-checkbox z-model="rememberUser" class="danger"></z-checkbox>
						Lembrar usuário
					</label>
					<label style="cursor: pointer;">
						<z-checkbox z-model="rememberUser" class="danger-light"></z-checkbox>
						Lembrar usuário
					</label>
				</div>
				<div class="flexDiv">
					<label style="cursor: pointer;">
						<z-checkbox z-model="rememberUser" class="success"></z-checkbox>
						Lembrar usuário
					</label>
					<label style="cursor: pointer;">
						<z-checkbox z-model="rememberUser" class="success-light"></z-checkbox>
						Lembrar usuário
					</label>
				</div>
			</div>
		
		</div>

	</section>

	<section>
		<div id="svgLibCard" class="card">
			<b class="title">Icones</b><br/>
			<div id="svgLib">
				<div z-for="svgId in svgLib" class="svgCard">
					<z-icon class="{{svgId}}" size="2"></z-icon>
					<span>{{svgId}}</span>
				</div>
			</div>
		</div>
	</section>

</div>
`

import zInput from '../components/zInput.js'
import zCheckbox from '../components/zCheckbox.js'
import zIcon from '../components/zIcon.js'

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
			else
				app.darkTheme = this.darkTheme
		}

		this.name = ''
		this.phone = ''
		this.rememberUser = true

		// this.watch.rememberUser = () => {
		// 	console.log('remember user', this.rememberUser)
		// }

		this.setPhoneMask = (e) => setMask(e, 'cellphone')

		this.svgLib = ['']
		fetch('/assets/svgLib.svg')
			.then(res => res.text())
			.then((res) => {
				let arr = []
				res.match(/(id=".+?")/g).map((idStr) => {
					arr.push(idStr.replace(`id="`, '').replace(`"`, ''))
				})
				this.svgLib = arr
			})
	}

	connectedCallback() {
		setTimeout(() => {
			Array.from(this.shadowRoot.querySelectorAll('.card')).map((card) => {
				card.style.transition = '.4s'
			})
		}, 0)
	}
}

customElements.define('view-home', Home)