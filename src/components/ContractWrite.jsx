import * as React from "react";
import { useState } from "react";
import {
  useAccount,
  useContractRead,
  useWriteContract,
} from "wagmi";

// Replace with your actual deployed contract address on Sepolia
const contractAddress = "0xa1a697ab9c59390e3e57e4e37cfbb8cde5d338f2";

const contractABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export function ContractWrite() {
  const { isConnected, address } = useAccount();
  const { writeContract } = useWriteContract();

  const { data: storedValue, isLoading: isReading } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "getValue",
    enabled: isConnected,
    //auto refresh
    watch: true, 
  });

  const [txHash, setTxHash] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [error, setError] = useState(null);

  const handleSetValue = async () => {
    const newValue = document.getElementById("newValue").value;

    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!newValue || isNaN(newValue) || Number(newValue) < 0) {
      alert("Please enter a valid positive number");
      return;
    }

    try {
      setIsWriting(true);
      const tx = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "setValue",
        args: [BigInt(newValue)],
        account: address,
      });

      setTxHash(tx);
      alert("Transaction sent!");
    } catch (err) {
      console.error("Error calling writeContract:", err);
      setError(err);
      alert("Failed to send transaction.");
    } finally {
      setIsWriting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end", // Align to the right
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "400px", // Adjust as needed
          textAlign: "left", // Optional: align text inside to left
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Update Value in Smart Contract</h3>
  
        {!isConnected && (
          <p style={{ color: "red" }}>
            Wallet not connected! Please connect via Wallet Options.
          </p>
        )}
  
        {isReading ? (
          <p>Loading current value...</p>
        ) : (
          <p>Current Stored Value: {storedValue?.toString() || "N/A"}</p>
        )}
  
        <div style={{ marginBottom: "10px" }}>
          <input
            id="newValue"
            placeholder="Enter a number (e.g., 100)"
            type="number"
            style={{
              padding: "8px",
              width: "200px",
              marginRight: "10px",
            }}
            required
          />
          <button
            onClick={handleSetValue}
            disabled={isWriting || !isConnected}
            style={{ padding: "8px 16px", cursor: "pointer" }}
          >
            {isWriting ? "Updating..." : "Set Value"}
          </button>
        </div>
  
        {txHash && (
          <p>
            Transaction Hash:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txHash}
            </a>
          </p>
        )}
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      </div>
    </div>
  );
  
}
