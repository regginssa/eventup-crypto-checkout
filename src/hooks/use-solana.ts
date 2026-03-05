import {
  Provider,
  useAppKitConnection,
} from "@reown/appkit-adapter-solana/react";
import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitNetworkCore,
  useAppKitProvider,
} from "@reown/appkit/react";
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token";
import { useToast } from "./use-toast";
import { solana } from "@reown/appkit/networks";

const DEPOSIT_ADDRESS = import.meta.env.VITE_DEPOSIT_SOL_WALLET_ADDRESS;
const USDT_MINT_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const CHRLE_MINT_ADDRESS = "G1ij1UjWBcUFtVHz5GVDAopPNMQcbwtdegH94LU6Jray";
const BABYU_MINT_ADDRESS = "7xAinob3Fmi6Sf1zA1kUDkuSuBh4KEVtuKqL6WM1DWKr";

const TOKENS = {
  "usdt-sol": {
    mint: new PublicKey(USDT_MINT_ADDRESS),
    decimals: 6,
  },
  "usdc-sol": {
    mint: new PublicKey(USDC_MINT_ADDRESS),
    decimals: 6,
  },
  chrle: {
    mint: new PublicKey(CHRLE_MINT_ADDRESS),
    decimals: 9,
  },
  babyu: {
    mint: new PublicKey(BABYU_MINT_ADDRESS),
    decimals: 9,
  },
};

export const useSolana = () => {
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { connection } = useAppKitConnection();
  const { switchNetwork } = useAppKitNetwork();
  const { toast } = useToast();

  const pay = async (
    tokenType: "sol" | "usdt-sol" | "usdc-sol" | "chrle" | "babyu",
    amount: string,
  ) => {
    if (!address) {
      toast?.({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed.",
      });
      return null;
    }

    if (!chainId || chainId !== solana.id) {
      try {
        await switchNetwork(solana);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Incorrect network",
          description: "Please switch your wallet to Solana Mainnet.",
        });
      }
      return null;
    }

    const wallet = new PublicKey(address);

    if (!wallet) {
      toast?.({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to proceed.",
      });
      return null;
    }

    try {
      const latestBlockhash = await connection.getLatestBlockhash();

      // create the transaction
      const transaction = new Transaction({
        feePayer: wallet,
        recentBlockhash: latestBlockhash.blockhash,
      });

      if (tokenType === "sol") {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: wallet,
            toPubkey: new PublicKey(DEPOSIT_ADDRESS),
            lamports: Number(amount) * LAMPORTS_PER_SOL,
          }),
        );
      } else {
        const token = TOKENS[tokenType];

        const senderTokenAccount = await getAssociatedTokenAddress(
          token.mint,
          wallet,
        );

        const receiverTokenAccount = await getAssociatedTokenAddress(
          token.mint,
          new PublicKey(DEPOSIT_ADDRESS),
        );

        const amountInSmallest = Number(amount) * Math.pow(10, token.decimals);

        transaction.add(
          createTransferInstruction(
            senderTokenAccount,
            receiverTokenAccount,
            wallet,
            amountInSmallest,
          ),
        );
      }

      const signature = await walletProvider.sendTransaction(
        transaction,
        connection,
      );

      return signature;
    } catch (err) {
      console.error("[pay solana error]: ", err);
      toast({ variant: "destructive", title: "Payment failed" });
      return null;
    }
  };

  return { pay };
};
