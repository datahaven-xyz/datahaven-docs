function initNetworkModal() {
  /** Grab the main element so we can append the modal to it */
  const main = document.querySelector('main');
  if (!main) {
    return;
  }

  /** Create the modal */
  const networkModalContainer = document.createElement('div');
  const networkModal = document.createElement('div');
  const networkModalHeader = document.createElement('h3');
  const networkModalMessage = document.createElement('p');
  const closeNetworkModal = document.createElement('span');

  /** Add classes to modal elements so we can find and update as needed */
  networkModalContainer.className = 'network-modal-container';
  networkModalHeader.className = 'network-modal-header';
  networkModal.className = 'network-modal';
  networkModalMessage.className = 'network-message';
  closeNetworkModal.className = 'close-modal';

  /** Set the display to none to hide the modal until it is needed */
  networkModalContainer.style.display = 'none';

  networkModalHeader.innerHTML = `Please select a network to connect to your Ethereum-compatible wallet:`;

  /** Set generic header for the network modal */
  networkModalMessage.innerHTML = `
    <div class="md-typeset button-wrapper">
      <a href="#" class="md-button connect-network" data-value="datahavenTestnet">DataHaven Testnet</a>
    </div>
  `;

  // TODO: Enable the following DataHaven mainnet button once the production 'datahaven' network is live and supported.
  //   <div class="md-typeset button-wrapper">
  //     <a href="#" class="md-button connect-network" data-value="datahaven">DataHaven</a>
  //   </div>

  /** Set up close button */
  closeNetworkModal.innerHTML = '&times;';
  closeNetworkModal.onclick = () => {
    networkModalContainer.style.display = 'none';
  };

  /** Put the modal together and append it to the main area on the page */
  networkModal.appendChild(closeNetworkModal);
  networkModal.appendChild(networkModalHeader);
  networkModal.appendChild(networkModalMessage);
  networkModalContainer.appendChild(networkModal);
  main.append(networkModalContainer);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNetworkModal);
} else {
  initNetworkModal();
}
