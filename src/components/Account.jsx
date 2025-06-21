
import { useAccount, useBalance, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { connect } from 'wagmi/actions'

export function Account() {
    const { address,connector } = useAccount()
    const { disconnect } = useDisconnect()

    const balance = useBalance({
      address
    })
  
    return (
      <div style={{
        
      }}>
        {address && <div>
          Your address - {address}
          Your balance - {balance.data?.formatted}
        </div>}
        
        <button onClick={() => disconnect()}>Disconnect</button>
        
      </div>
    )
  }