const provider = window.ethereum;
const supportedNetworks = {
  //   datahaven: {
  //     name: 'datahaven',
  //     chainId: '0xDA7A',
  //     chainName: 'DataHaven',
  //     rpcUrls: ['/'],
  //     blockExplorerUrls: ['/'],
  //     nativeCurrency: {
  //       name: 'Have',
  //       symbol: 'HAVE',
  //       decimals: 18,
  //     },
  //   },
  datahavenTestnet: {
    name: 'datahavenTestnet',
    chainId: '0xDA7B',
    chainName: 'DataHaven Testnet',
    rpcUrls: ['https://services.datahaven-testnet.network/testnet'],
    blockExplorerUrls: ['http://testnet.dhscan.io/'],
    nativeCurrency: {
      name: 'Mock',
      symbol: 'MOCK',
      decimals: 18,
    },
  },
};

/*
  Add or switch to the specified network, then request accounts
  NOTE: This calls "eth_requestAccounts" at the end, which prompts for wallet connection
 */
const connectNetwork = async (network) => {
  try {
    const targetNetwork = { ...supportedNetworks[network] };
    delete targetNetwork.name; // 'name' property is used internally and needs to be removed for the request

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [targetNetwork],
    });
    // This line requests user accounts, which triggers a "connect" prompt if not already connected:
    await provider.request({ method: 'eth_requestAccounts' });
  } catch (e) {
    // Log all errors for debugging, including expected user actions (4001, -32002)
    console.error('MetaMask connectNetwork error:', e);
    // 4001: user rejected, -32002: request already pending
    if (e && e.code !== 4001 && e.code !== -32002) {
      handleError(e.message || String(e));
    }
  }
};

// Get the network that the user is currently connected to
const getConnectedNetwork = async () => {
  const chainId = await provider.request({ method: 'eth_chainId' });
  const connectedDataHavenNetwork = Object.values(supportedNetworks).find(
    (network) => network.chainId.toLowerCase() === chainId.toLowerCase()
  );
  if (connectedDataHavenNetwork) {
    const connectedDataHavenNetworkButton = document.querySelector(
      `.connect-network[data-value="${connectedDataHavenNetwork.name}"]`
    );
    return { connectedDataHavenNetwork, connectedDataHavenNetworkButton };
  } else {
    return {
      connectedDataHavenNetwork: null,
      connectedDataHavenNetworkButton: null,
    };
  }
};

// Display the account that is connected and the DataHaven network the account is connected to
const displayConnectedAccount = async (connectedNetwork, networkButton) => {
  if (!networkButton) {
    return;
  }

  let accounts = await provider.request({ method: 'eth_accounts' });

  // If no accounts are returned without prompting, optionally request them
  if (!accounts || accounts.length === 0) {
    try {
      accounts = await provider.request({ method: 'eth_requestAccounts' });
    } catch (e) {
      // 4001: user rejected, -32002: request already pending
      if (e.code !== 4001 && e.code !== -32002) {
        handleError(e.message);
      }
      return;
    }
  }
  if (!accounts || accounts.length === 0) return;

  const shortenedAccount = `${accounts[0].slice(0, 6)}...${accounts[0].slice(
    -4
  )}`;
  networkButton.innerHTML = `Connected to ${connectedNetwork.chainName}: ${shortenedAccount}`;
  networkButton.classList.add('disabled-button');
};

// Displays an error message to the user
const handleError = (message) => {
  const errorModalContainer = document.querySelector('.error-modal-container');
  const errorMessage = document.querySelector('.error-message');
  errorModalContainer.style.display = 'block';
  errorMessage.innerHTML = message;
};

/*
  Handles the logic for the Connect Wallet button in the top navigation.
  Shows modal and sets up .connect-network links inside the modal
*/

const connectMetaMaskNav = document.querySelector('.connectMetaMask-nav');
// if (!connectMetaMaskNav) {
//   console.warn('MetaMask connect button not found in DOM');
//   return;
// }
connectMetaMaskNav.addEventListener('click', async (e) => {
  e.preventDefault();

  const networkModalContainer = document.querySelector(
    '.network-modal-container'
  );

  if (provider) {
    networkModalContainer.style.display = 'block';
    const { connectedDataHavenNetwork, connectedDataHavenNetworkButton } =
      await getConnectedNetwork();
    const accounts = await provider.request({ method: 'eth_accounts' });

    if (connectedDataHavenNetwork && accounts.length > 0) {
      await displayConnectedAccount(
        connectedDataHavenNetwork,
        connectedDataHavenNetworkButton
      );
    }
  } else {
    const errorMessage = `It looks like you don't have any Ethereum-compatible wallets installed. Please install an Ethereum-compatible wallet, such as <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer noopener">MetaMask</a>, and try again.`;
    handleError(errorMessage);
  }

  // Attach click handlers to .connect-network buttons in the modal
  const dataHavenNetworkButtons = document.querySelectorAll('.connect-network');
  if (dataHavenNetworkButtons) {
    dataHavenNetworkButtons.forEach((button) => {
      if (!button.classList.contains('disabled-button')) {
        button.addEventListener('click', (ev) => {
          ev.preventDefault();
          connectNetwork(ev.target.getAttribute('data-value'));
          networkModalContainer.style.display = 'none';
        });
      }
    });
  }
});

/*
 Handles the logic for the buttons inside of content pages (i.e., the Connect MetaMask guide).
 Directly connect to the network specified in 'value'
 */
const connectMetaMaskBodyButtons =
  document.querySelectorAll('.connectMetaMask');
connectMetaMaskBodyButtons.forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!provider) {
      handleError(
        `No Ethereum-compatible wallet found. Please install MetaMask.`
      );
      return;
    }

    const network = btn.getAttribute('value');
    if (!network || !supportedNetworks[network]) {
      handleError(`The network "${network}" is not supported or not defined.`);
      return;
    }

    await connectNetwork(network);
    //Update the button to reflect the "connected" state
    btn.textContent = 'Connected';
    btn.classList.add('disabled-button');
  });
});

if (provider) {
  provider.on('chainChanged', () => {
    window.location.reload();
  });
  provider.on('accountsChanged', async (accounts) => {
    if (accounts.length > 0) {
      const { connectedDataHavenNetwork, connectedDataHavenNetworkButton } =
        await getConnectedNetwork();
      if (connectedDataHavenNetwork) {
        await displayConnectedAccount(
          connectedDataHavenNetwork,
          connectedDataHavenNetworkButton
        );
      }
    } else {
      window.location.reload();
    }
  });
}
