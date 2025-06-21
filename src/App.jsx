import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { WalletOptions } from "./components/WalletOptions";
import { Account } from "./components/Account";
import { SendTransaction } from "./components/SendTransaction";
import { ContractWrite } from "./components/ContractWrite";

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
       <WalletOptions/>
        <Account />
        <ContractWrite />
        <SendTransaction />
      </QueryClientProvider> 
    </WagmiProvider>
  )
}


export default App;