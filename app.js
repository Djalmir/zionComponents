import Home from './views/Home.js'
import About from './views/About.js'

app.routes = {
	'#/': Home,
	'#/about': About
}

mountApp(app.routes)