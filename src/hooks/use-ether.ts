import ERC20_ABI from "../abis/ERC20_ABI.json";
import { useToast } from "./use-toast";
import {
  BrowserProvider,
  Contract,
  JsonRpcSigner,
  Provider,
  getAddress,
  parseUnits,
} from "ethers";
import {
  useAppKitAccount,
  useAppKitNetworkCore,
  useAppKitProvider,
} from "@reown/appkit/react";
import { mainnet } from "@reown/appkit/networks";

const USDT_ADDRESS = getAddress("0xdac17f958d2ee523a2206206994597c13d831ec7");
const USDC_ADDRESS = getAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");

export const useEther = () => {
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { toast } = useToast();

  const pay = async (
    tokenType: "eth" | "usdt-eth" | "usdc-eth",
    amount: string,
    depositAddress: string,
  ) => {
    if (depositAddress === "") {
      toast?.({
        variant: "destructive",
        title: "Incorrect deposit address",
        description: "Please reload page.",
      });
      return null;
    }

    if (!address) {
      toast?.({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed.",
      });
      return null;
    }

    if (!chainId || chainId !== mainnet.id) {
      toast?.({
        variant: "destructive",
        title: "Incorrect network",
        description: "Switch your wallet to Ethereum Mainnet to continue.",
      });
      return null;
    }

    if (!depositAddress) {
      toast?.({
        variant: "destructive",
        title: "Deposit address unavailable",
        description: "Please refresh or try again later.",
      });
      return null;
    }

    try {
      const transaction = {
        to: depositAddress,
        value: parseUnits(amount, "ether"),
      };

      const provider = new BrowserProvider(walletProvider as any, chainId);
      const signer = new JsonRpcSigner(provider, address);

      if (tokenType === "eth") {
        const tx = await signer.sendTransaction(transaction);
        return tx;
      } else {
        const tokenContractAddress =
          tokenType === "usdt-eth" ? USDT_ADDRESS : USDC_ADDRESS;

        // Create a contract instance
        const tokenContract = new Contract(
          tokenContractAddress,
          ERC20_ABI,
          signer,
        );

        // Convert human-readable amount to token units
        const amountBigInt = parseUnits(amount, 6);

        // Send token
        const tx = await tokenContract.transfer(depositAddress, amountBigInt);
        return tx;
      }
    } catch (err) {
      console.error("[pay eth error]: ", err);
      toast({ variant: "destructive", title: "Payment failed" });
      return null;
    }
  };

  return {
    pay,
  };
};
