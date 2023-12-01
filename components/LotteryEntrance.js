import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const dispatch = useNotification()

    const {
        runContractFunction: enterLottery,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddresses[chainId],
        functionName: "enterLottery",
        params: [],
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddresses[chainId],
        functionName: "getEntranceFee",
        params: [],
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddresses[chainId],
        functionName: "getNumberOfPlayers",
        params: [],
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddresses[chainId],
        functionName: "getRecentWinner",
        params: [],
    })

    /**
     * @dev UI parameter check added to avoid error when changing chainId
     */
    async function updateUIValues() {
        if (isWeb3Enabled && contractAddresses[chainId]) {
            const entranceFeeFromCall = await getEntranceFee()
            const numberOfPlayersFromCall = await getNumberOfPlayers()
            const recentWinnerFromCall = await getRecentWinner()
            if (
                entranceFeeFromCall &&
                numberOfPlayersFromCall &&
                recentWinnerFromCall
            ) {
                setEntranceFee(entranceFeeFromCall.toString())
                setNumberOfPlayers(numberOfPlayersFromCall.toString())
                setRecentWinner(recentWinnerFromCall.toString())
            }
        }
    }

    /**
     *
     * @returns checkForWinner function added to update the "Recent winner" field
     */
    const checkForWinner = async () => {
        return await getRecentWinner()
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled, checkForWinner])

    useEffect(() => {
        console.log(`Current chainId is ${chainId.toString()}`)
        console.log(
            `Current lottery address is ${contractAddresses[
                chainId
            ].toString()}`
        )
    }, [chainId])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleSuccessNotification(tx)
        updateUIValues()
    }

    const handleSuccessNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction complete",
            title: "Transaction notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            {contractAddresses[chainId] ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ml-auto"
                        onClick={async () => {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter lottery</div>
                        )}
                    </button>
                    <div>
                        Entrance Fee:
                        {ethers.utils.formatUnits(
                            entranceFee,
                            "ether"
                        )} ETH{" "}
                    </div>
                    <div>Number of players: {numberOfPlayers}</div>
                    <div>Recent winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No lottery address detached</div>
            )}
        </div>
    )
}
