import Home from './views/Home.js'
import About from './views/About.js'

const routes = {
	'#/': Home,
	'#/about': About
}

mountApp(routes)