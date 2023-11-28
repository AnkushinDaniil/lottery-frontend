import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, web3 } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const dispatch = useNotification()

    const { runContractFunction: enterLottery } = useWeb3Contract({
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

    async function updateUIValues() {
        // if (isWeb3Enabled && lotteryAddress) {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numberOfPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        // }
    }

    // if (isWeb3Enabled) {
    //     const lotteryContract = new ethers.Contract(lotteryAddress, abi, web3)
    //     lotteryContract.on("*", (event) => {
    //         console.log(event)
    //         // await tx.wait(1)
    //         updateUIValues()
    //     })
    // }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

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
        <div>
            {lotteryAddress ? (
                <div>
                    <button
                        onClick={async () => {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter lottery
                    </button>
                    Entrance Fee:{" "}
                    {ethers.utils.formatUnits(entranceFee, "ether")} ETH Number
                    of players: {numberOfPlayers}
                    Recenr winner: {recentWinner}
                </div>
            ) : (
                <div>No lottery address detached</div>
            )}
        </div>
    )
}
