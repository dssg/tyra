import App from 'components/app/component'
import AppTesting from 'components/app-testing/component'
import ReactDOM from 'react-dom'

Object.defineProperty(window, 'App', { value: App })
Object.defineProperty(window, 'AppTesting', { value: AppTesting })
Object.defineProperty(window, 'ReactDOM', { value: ReactDOM })
