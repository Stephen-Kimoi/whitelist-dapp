// import Head from 'next/head' 
import styles from '../styles/Home.modules.css' 
import Web3Modal from "web3modal" 
import { providers, Contract } from "ethers" 
import { useEffect, useRef, useState } from "react"
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants'

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false); 
  const [joinedWhitelist, setJoinedWhitelist] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0); 
  // A reference to the web3 modal ( used to connect to metamask ) which persisits as long as the page is open
  const web3ModalRef = useRef(); 
  
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect(); // We need to acces the underlying object since web3modal is stored as a reference 
    const web3Provider = new providers.web3Provider(provider); 

    // Throw an error if the user is not connected to the goerli network 
    const { chainId } = await web3Provider.getNetwork(); 

    if (chainId !== 5){
      window.alert("Change the network to Goerli");
      throw new Error("Change the network to Goerli"); 
    } 

    if (needSigner) {
      const signer = web3Provider.getSigner(); 
      return signer
    }
    return web3Provider; 
  }
}
