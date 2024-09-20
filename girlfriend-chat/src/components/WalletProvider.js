// src/components/WalletProvider.js
import React, { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider as AdapterWalletProvider
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';

// Default styles for wallet adapter (required for UI components like the wallet modal)
require('@solana/wallet-adapter-react-ui/styles.css');

// Your QuickNode RPC URL
const QUICKNODE_RPC_ENDPOINT = 'https://necessary-fragrant-layer.solana-mainnet.quiknode.pro/44f7f06404e25cebf9fefd30e336b5a3a7b14755';

const WalletProvider = ({ children }) => {
  // Use the QuickNode RPC endpoint directly
  const endpoint = useMemo(() => QUICKNODE_RPC_ENDPOINT, []);

  // Memoize the wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(), // Add more wallets here if needed
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <AdapterWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </AdapterWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
