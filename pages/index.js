import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
// import ManualHeader from "../components/ManualHeader"
import LotteryEntrance from "../components/LotteryEntrance"
// import { useMoralis } from "react-moralis"

// const supportedChains = ["31337", "11155111"]

export default function Home() {
    // const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className={styles.container}>
            <Head>
                <title>Lottery App</title>
                <meta
                    name="description"
                    content="Lottery smart contract frontend"
                />
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    )
}
