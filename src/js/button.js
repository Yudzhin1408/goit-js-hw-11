import Server from './server';

const NewServer = new Server();
const button = document.querySelector('.load-more');

export default class ButtonPlusDataServer {
  buttonShow() {
    button.classList.remove('visually-hidden');
  }

  buttonPreLoadung() {
    button.textContent = `Loading ...`;
    this.buttonDisablet();
  }

  buttonLoadung() {
    button.textContent = `Load more`;
    button.removeAttribute('disabled');
  }

  buttonDisablet() {
    button.setAttribute('disabled', true);
  }

  buttonNoMoreHope() {
    button.classList.add('visually-hidden');
    this.buttonDisablet();
  }
}
