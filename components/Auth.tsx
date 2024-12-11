import { useEffect, useState } from 'react';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';
import Moralis from 'moralis';
import { Button } from './ui/button';

export const Auth = () => {
  const [user, setUser] = useState<{ address: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initMoralis = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_MORALIS_API_KEY) {
          throw new Error('Missing Moralis API key');
        }
        
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });

        // Create a public client
        const publicClient = createPublicClient({
          chain: mainnet,
          transport: http()
        });

      } catch (error) {
        console.error('Failed to initialize Moralis:', error);
      }
    };

    initMoralis();
  }, []);

  const handleLogin = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
      }

      // Create a wallet client
      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum)
      });

      // Request account access
      const [address] = await walletClient.requestAddresses();
      
      if (address) {
        setUser({ address });
        setIsAuthenticated(true);

        // You can now use the Moralis SDK to interact with the blockchain
        // Example:
        // const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
        //   address,
        //   chain: '0x1', // mainnet
        // });
      }

    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isAuthenticated && user) {
    return (
      <div>
        <p>Logged in as {user.address}</p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  return <Button onClick={handleLogin}>Connect Wallet</Button>;
};