import ReactDOM from 'react-dom';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import init from './init';

const render = async () => {
  const vdom = await init();

  ReactDOM.render(vdom, document.getElementById('root'));
};

render();
