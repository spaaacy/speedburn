'use client'

import Loader from "@/components/Loader"
import { Web3Context } from "@/context/Web3Context"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"

const Communities = () => {
    const { account } = useContext(Web3Context)
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true)

    const fetchNftsOwned = async () => {
        try {
            const response = await fetch(`/api/users/${account}/communities`, { method: "GET" })
            const result = await response.json();
            console.log(result);
            setCommunities(result);
            setLoading(false)
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNftsOwned();
    }, [])

    return (
        <main className="max-width w-full flex flex-col flex-1">
            {loading ? <Loader /> :
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl text-fire font-bold">Communities</h1>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {
                            communities.map((community, i) =>
                                <CommunityCard community={community} />
                            )
                        }
                    </div>
                </>
            }
        </main>
    )
}

const CommunityCard = ({ community }) => (
    <Link href={`/communities/${community.address}`} className="text-white transition bg-fire hover:bg-firedark shadow-xl rounded-xl p-4 flex justify-center items-center flex-col">
        <p className="font-semibold">
            {`${community.name} (${community.symbol})`}
        </p>
    </Link>
)

export default Communities