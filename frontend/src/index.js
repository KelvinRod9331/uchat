import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import reducer from './reducer/rootreducer';
// import { createStore } from 'redux';
import registerServiceWorker from './registerServiceWorker';
// import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// const store = createStore(
//   reducer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// {/*<Provider store={store}></Provider>*/}
ReactDOM.render( 
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root'));
registerServiceWorker();
