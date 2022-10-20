//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0; 

contract Whitelist {
    // Maximum number of whitelisted addresses allowed
    uint8 public maxWhitelistedAdresses; 
    
    // Mapping the whitelisted addresses to boolean, if whitelisted then 'true'
    // if not whitelisted then 'false' 
    mapping (address => bool) public whitelistedAddresses; 

    // keeping track of how many addreses have been whitelisted 
    uint8 public numAddressesWhitelisted; 

    // Setting up the maximum number of addresses to be whitelisted 
    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistedAdresses = _maxWhitelistedAddresses;  
    } 

    // Function for adding address of the sender to the whitelist
    function addAddressToWhiteList() public {
        // Ensure the user has already been whitelisted
        require(!whitelistedAddresses[msg.sender], "Sender has already been whitelisted"); 
        
        // Esnure the number of addresses whitelisted is less than maximum no of addresses that 
        // can be whitelisted 
        require(numAddressesWhitelisted < maxWhitelistedAdresses, "More addresses can't be added, limit reached"); 

        // Adding the address that called the function to the whitelisted address array 
        whitelistedAddresses[msg.sender] = true; 

        // Increase the number of whitelisted addresses 
        numAddressesWhitelisted += 1; 
    }
}