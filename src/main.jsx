import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import {observer} from 'mobx-react';
import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';


@observer
class AppContainer extends React.Component {
    render() {
        return  <App/>
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <AppContainer/>
);

