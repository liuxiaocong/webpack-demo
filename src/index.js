import _ from 'lodash';
import './style.css';
import iconUrl from './icon.jpg';
import Data from './data.xml';

function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  var icon = new Image();
  icon.src = iconUrl;
  element.appendChild(icon);
  console.log(Data);
  return element;
}

document.body.appendChild(component());