'use client'

import Loader from "@/components/Loader";
import UserImage from "@/components/UserImage";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"

const User = () => {
  const { address } = useParams();
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${address}`, {
        method: "GET"
      })
      setUser(await response.json());
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser();
  }, [])

  return (
    <main className="flex flex-1">
      {loading ? <Loader /> :
        <div className="max-width w-full flex">
          {user ?
            <div className="flex mt-6">
              <div>
                <UserImage size={300} displayPicture={user.image} />
              </div>
              <div className="flex flex-1 flex-col gap-4 ml-8">
                <h1 className="text-3xl font-bold text-fire mb-5">{`${user.username}'s profile`}</h1>
                <h2 className="font-semibold text-lg">{`Address: ${user.address}`}</h2>
                {/* TODO: Enumerate communities and NFTs */}
                <h2 className="text-2xl font-semibold text-fire">Communities:</h2>
                <h2 className="text-2xl font-semibold text-fire">Collection:</h2>
              </div>
            </div>
            :
            <div className="flex-1 flex justify-center items-center">
              <h1 className="font-semibold text-3xl">User does not exist 😓</h1>
            </div>
          }
        </div>
      }
    </main>
  )
}

export default User