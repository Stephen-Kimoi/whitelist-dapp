import Head from 'next/head' 
import styles from '../styles/Home.module.css';  
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers" 
import { useEffect, useRef, useState } from "react"
import { abi } from '../utils/Whitelist.json'
// import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants'

const WHITELIST_CONTRACT_ADDRESS = "0x4B30378F265A7d42c7596558fFd4A3fDF2e51ceD"

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false); 
  const [joinedWhitelist, setJoinedWhitelist] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0); 
  // A reference to the web3 modal ( used to connect to metamask ) which persisits as long as the page is open
  const web3ModalRef = useRef(); 
  
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect(); // We need to acces the underlying object since web3modal is stored as a reference 
    const web3Provider = new providers.Web3Provider(provider); 
    
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

  // Adding current connected wallet to the whitelist
  const addAddressToWhitelist = async () => {
    try {
      // parameter set to true since we need a signer
      const signer = await getProviderOrSigner(true); 

      // Creating a new instance of the contract with a signer 
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS, 
        abi, 
        signer
      ); 

      // Calling the address to whitelist from the contract 
      const tx = await whitelistContract.addAddressToWhiteList(); 
      setLoading(true); 

      // Waiting for the transaction to get mined 
      await tx.wait(); 
      setLoading(false); 

      // Get the updated number of addresses in the whitelist 
      await getNumberOfWhitelisted(); 
      setJoinedWhitelist(true); 

    } catch (err) {
      console.error(err); 
    }
  };   

  // Get the number of whitelist address
  const getNumberOfWhitelisted = async () => {
      try {
        // Getting the provider since we only want to read state from the blockchain 
        const provider = await getProviderOrSigner(); 

        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS, 
          abi, 
          provider
        ); 

        // Calling the number of Whitelisted address from the contract 
        const _numberofWhitelisted = await whitelistContract.numAddressesWhitelisted(); 
        setNumberOfWhitelisted(_numberofWhitelisted); 
      } catch (err) {
        console.error(err); 
      }
    }; 

    // Check if the address is in whitelist 
    const checkIfAddressInWhitelist = async () => {
      try {
        const signer = await getProviderOrSigner(true); 

        const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS, 
          abi, 
          signer
        ); 
        
        console.log(whitelistContract)
        
        // Get the address associated with signer connected in Metamask
        const address = await signer.getAddress(); 
        
        const _joinedWhitelist = await whitelistContract.whitelistedAddresses(address); 
        setJoinedWhitelist(_joinedWhitelist); 
      } catch (err) {
        console.error(err); 
      }
    }; 

    // Connect metamask wallet 
    const connectWallet = async () => {
      try {
        await getProviderOrSigner(); 
        setWalletConnected(true); 

        checkIfAddressInWhitelist(); 
        getNumberOfWhitelisted(); 
      } catch (err) {
        console.error(err); 
      }
    }

    // Returns the button based on the state of the dapp
    const renderButton = () => {
      if (walletConnected) {
        if (joinedWhitelist) {
          return (
            <div className={styles.description}>
              Thanks for joining the whitelist
            </div>
          ); 
        } else if (loading) {
          return <button className={styles.button}>Loading...</button>
        } else {
          return (
            <button onClick={addAddressToWhitelist} className={styles.button}>
               Join the Whitelist
            </button>
          ); 
        } 
      } else {
        return (
          <button onClick={connectWallet} className={styles.button}>
            Connect your wallet
          </button>
        )
      }
    }; 

    useEffect( () => {
      // If wallet is not connected create a new instance of web3modal and connect to Metamask wallet 
      if (!walletConnected) {
        web3ModalRef.current = new Web3Modal({
          network: "goerli", 
          providerOptions: {},
          disableInjectedProvider: false, 
        }); 
        connectWallet(); 
      }
    },[]); 

    return (
      <div>

        <Head>
           <title>Steve's Whitelist Dapp</title>
           <meta name="description" content="Whitelist-Dapp"/>
           <link rel="icon" href="./favicon.io" />
        </Head>

        <div className={styles.main}>
          <div className={styles.mainContainer1}>
            <h1 className={styles.title}>Steve's NFT</h1>
            <div className={styles.description}>
              This is an NFT collection for my NFT's. Join the whitelist to get notified once new NFTs are out!
            </div>
            <div className={styles.description}>
              {numberOfWhitelisted} have already joined the Whitelist
            </div>
            {renderButton()}
          </div>
          <div>
            <img className={styles.image} src="./crypto-devs.svg" /> 
          </div>
        </div>

        <footer className={styles.footer}>
          Made with &#10084; by Crypto Devs
        </footer>

      </div>
    )

  }
