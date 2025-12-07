import Web3 from 'web3';
import Web3Modal from 'web3modal'
import MyERC20 from '../contracts/ethereum-contracts/MyERC20';

export default function initializeSystemTwo() {

   async function giveApproval() {
    const web3Modal = new Web3Modal()
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()
     const web3Ganache = new Web3('http://127.0.0.1:8545');
    const ganacheAccountsList = await web3Ganache.eth.getAccounts();
    const address = accounts[0];
    console.log ('address of account[0]', address)
    console.log ( 'ganacheAccountsList[1]',ganacheAccountsList[1]);
   {
    const myERC20ContractAddress = MyERC20.networks[networkId].address;
    const myERC20Contract = new web3.eth.Contract(MyERC20.abi, myERC20ContractAddress);
   
 await myERC20Contract.methods.approve(ganacheAccountsList[0], 100).send({from: accounts[0]}).on('receipt', function (receipt) {});
    console.log ( 'accounts [0] from metamask calls approve method');
    


   }
    }
  
  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <button onClick={giveApproval} className="font-bold mt-4 bg-teal-400 text-white rounded p-4 shadow-lg">
        giveApproval
        </button>
      </div>
    </div>
  )
}