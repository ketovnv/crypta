import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import {observer} from 'mobx-react';

@observer
class AppContainer extends React.Component {
    render() {
        return  <App/>
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <AppContainer/>
);

