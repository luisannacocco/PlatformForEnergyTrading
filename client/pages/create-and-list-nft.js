import { useState } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import { create  } from 'ipfs-http-client'
import Marketplace from '../contracts/ethereum-contracts/Marketplace.json'
import EnergyToken from '../contracts/ethereum-contracts/EnergyToken.json'

// Configura l'endpoint del tuo nodo IPFS
const client = create({ url: 'http://localhost:5001' });

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    // upload image to IPFS
    const file = e.target.files[0]
    console.log('file',file.name)
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `http://localhost:8080/ipfs/${added.path}`;
      console.log('40 in createAndList-nft url', url);
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) {
      return
    } else {
         // first, upload metadata to IPFS
         const data = JSON.stringify({
          name, description, image: fileUrl
        })
        try {
          const added = await client.add(data)
          const url = `http://localhost:8080/ipfs/${added.path}`;
  
           return url
      } catch (error) {
        console.log('Error uploading file: ', error)
      } 
    }
  }

async function listNFTForSale() {
  const web3Modal = new Web3Modal()
  const provider = await web3Modal.connect()
  const web3 = new Web3(provider)
  const url = await uploadToIPFS()
  const networkId = await web3.eth.net.getId()
  const accounts = await web3.eth.getAccounts()
  console.log('80 in createAndList-nft',accounts)
    // Connect the user and get the address of his current account

const address = accounts[0];
console.log ('address of account[0]', address)

    // Mint the NFT
    const energyTokensContractAddress = EnergyToken.networks[networkId].address
    const energyTokensContract = new web3.eth.Contract(EnergyToken.abi, energyTokensContractAddress)
    
    const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, Marketplace.networks[networkId].address)

    await energyTokensContract.methods.mint(url).send({ from: accounts[0] }).on('receipt', function (receipt) {
         console.log('minted');
       // List the NFT
      const tokenId = receipt.events.NFTMinted.returnValues[0];
        marketPlaceContract.methods.listNft(energyTokensContractAddress, tokenId, formInput.price)
            .send({ from: accounts[0]}).on('receipt', function () {
                console.log('listed')
                router.push('/')
            });
     });
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
      <label className="block text-gray-700">
           Location: Address and City
          </label>
        <input 
          placeholder="Location: Address and City"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
          <label className="block text-gray-700">
           Point of Delivery (POD) Code 
          </label>        
        <textarea
          placeholder="POD Code"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
          <label className="block text-gray-700">
           Energy Asset Price in hundredths
          </label>
        <input
          placeholder="Energy Asset Price in hundredths"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }

        <button onClick={listNFTForSale} className="font-bold mt-4 bg-teal-400 text-white rounded p-4 shadow-lg">
          Mint and list Energy Tokens
        </button>

      </div>
    </div>
  )
}