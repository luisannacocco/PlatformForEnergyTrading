
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal'
import Marketplace from '../contracts/ethereum-contracts/Marketplace.json'
import EnergyToken from '../contracts/ethereum-contracts/EnergyToken.json'
import MyERC20 from '../contracts/ethereum-contracts/MyERC20';

export default function initializeSystem() {

   async function addRECpeers() {
    const web3Modal = new Web3Modal()
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()
    // Connessione a Ganache in ascolto su localhost:7545 (default)
    const web3Ganache = new Web3('http://127.0.0.1:8545');
    const ganacheAccountsList = await web3Ganache.eth.getAccounts();


    // Connect the user and get the address 
    // //of his current account
    const address = accounts[0];//is the account connected to the dApp
    console.log ('address of account[0]', address)
    console.log ( 'ganacheAccountsList[1]',ganacheAccountsList[1]);
    if (ganacheAccountsList[0]==address){
    const myERC20ContractAddress = MyERC20.networks[networkId].address;
    const myERC20Contract = new web3.eth.Contract(MyERC20.abi, myERC20ContractAddress);
    const zeroA = await myERC20Contract.methods.mint(ganacheAccountsList[0], 100).send( { from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'Mined 100 ERC20 for ganacheAccountsList[01]');
    const firstA = await myERC20Contract.methods.mint(ganacheAccountsList[1], 100).send( { from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'Mined 100 ERC20 for ganacheAccountsList[1]');
    const secondA = await myERC20Contract.methods.mint(ganacheAccountsList[2], 100).send({ from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'Mined 100 ERC20 for ganacheAccountsList[2]');
    const thirdA = await myERC20Contract.methods.mint(ganacheAccountsList[3], 100).send({ from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'Mined 100 ERC20 for ganacheAccountsList[3]');
    const fourthA = await myERC20Contract.methods.mint(ganacheAccountsList[4], 100).send({ from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'Mined 100 ERC20 for ganacheAccountsList[4]');
    
    // Add peers to the REC
    const energyTokensContractAddress = EnergyToken.networks[networkId].address;
    const energyTokensContract = new web3.eth.Contract(EnergyToken.abi, energyTokensContractAddress);
    await energyTokensContract.methods.addPeers(ganacheAccountsList[0]).send({ from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'added Peer ganache Account [0]')
    await energyTokensContract.methods.addPeers(ganacheAccountsList[1]).send({ from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'added Peer ganache Account [1]')
    await energyTokensContract.methods.addPeers(ganacheAccountsList[2]).send({ from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'added Peer ganache Account [2]')
    await energyTokensContract.methods.addPeers(ganacheAccountsList[3]).send({ from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'added Peer ganache Account [3]')
    await energyTokensContract.methods.addPeers(ganacheAccountsList[4]).send({ from: accounts[0] }).on('receipt', function (receipt) {});
    console.log ( 'added Peer ganache Account [4]')
    console.log ( 'added the ganache Accounts [0],[1], [2], [3], [4]');  
  }
    }
  
  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <button onClick={addRECpeers} className="font-bold mt-4 bg-teal-400 text-white rounded p-4 shadow-lg">
        Initialize System
        </button>
      </div>
    </div>
  )
}