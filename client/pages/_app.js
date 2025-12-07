import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-green-50 font-sans text-gray-800">
      <nav className="border-b p-6 bg-green-100 shadow-md">
        <p className="text-4xl font-bold text-green-700 mb-4">Energy Token Marketplace</p>
      
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col items-start mb-4 md:mb-0 md:mr-6 w-full md:w-64">
         
            <Link href="/" passHref>
              <button className="mb-4 w-full text-white bg-green-600 hover:bg-green-700 active:bg-green-800 border border-green-700 rounded p-3 font-semibold shadow hover:shadow-lg transition duration-200">
                Home
              </button>
            </Link>
            
            <div className="flex flex-col space-y-2 w-full">
              <Link href="/peersGiveApproval" passHref>
                <button className="w-full text-green-100 bg-green-500 hover:bg-green-600 active:bg-green-700 border border-green-600 rounded p-3 font-semibold shadow hover:shadow-lg transition duration-200">
                  Give Approval to spend FT
                </button>
              </Link>
              <Link href="/create-and-list-nft" passHref>
                <button className="w-full text-green-100 bg-green-500 hover:bg-green-600 active:bg-green-700 border border-green-600 rounded p-3 font-semibold shadow hover:shadow-lg transition duration-200">
                  Sell a new NFT
                </button>
              </Link>
              <Link href="/my-nfts" passHref>
                <button className="w-full text-green-100 bg-green-500 hover:bg-green-600 active:bg-green-700 border border-green-600 rounded p-3 font-semibold shadow hover:shadow-lg transition duration-200">
                  My Bought NFTs
                </button>
              </Link>
              <Link href="/my-listed-nfts" passHref>
                <button className="w-full text-green-100 bg-green-500 hover:bg-green-600 active:bg-green-700 border border-green-600 rounded p-3 font-semibold shadow hover:shadow-lg transition duration-200">
                  My Listed NFTs
                </button>
              </Link>
            </div>
          </div>


          <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
           
           
            <div className="border border-green-300 bg-green-50 rounded p-4 flex-1 max-w-md w-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="mb-4 font-semibold text-left text-green-800">Only for REC responsible</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Link href="/addRECpeers" passHref>
                  <button className="w-full text-white bg-green-600 hover:bg-green-700 active:bg-green-800 border border-green-700 rounded p-2 font-semibold shadow hover:shadow-lg transition duration-200">
                    Initialize System
                  </button>
                </Link>
              </div>
            </div>
+
            <div className="border border-green-300 bg-green-50 rounded p-4 flex-1 max-w-md w-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="mb-4 font-semibold text-left text-green-800">Ask for suggestions</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Link href="/aiModule" passHref>
                  <button className="w-full text-white bg-green-600 hover:bg-green-700 active:bg-green-800 border border-green-700 rounded p-2 font-semibold shadow hover:shadow-lg transition duration-200">
                    Chat Box
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp


