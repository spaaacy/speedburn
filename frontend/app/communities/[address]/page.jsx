'use client'

import CreatePost from "@/components/CreatePost";
import Loader from "@/components/Loader";
import PostItem from "@/components/PostItem";
import UserImage from "@/components/UserImage";
import { Web3Context } from "@/context/Web3Context";
import { formatAddress } from "@/util/helpers";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const CommunityHome = () => {
  const [loading, setLoading] = useState(true)
  const { isInitialized, account, user } = useContext(Web3Context);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const { address } = useParams();

  const createCommunity = async () => {
    try {
      if (!account) throw "You must be signed in. Address cannot be null!";
      setLoading(true)
      await fetch("/api/communities/create", {
        method: "POST",
        body: JSON.stringify({
          address,
          user: user
        })
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }

  }

  const fetchCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${address}`,
        {
          method: "GET"
        });
      const community = await response.json();
      setCommunity(community)
      await fetchPosts(community._id);
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  }

  const fetchPosts = async (communityId) => {
    try {
      const response = await fetch(`/api/posts?community_id=${communityId}`, { method: "GET" });
      const results = await response.json();
      setPosts(results);
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  useEffect(() => {
    if (!isInitialized) return;
    fetchCommunity();
  }, [isInitialized]);

  return (
    <main className="flex flex-1">
      {
        loading ? <Loader /> :
          <div className="flex flex-col gap-4 justify-between max-width w-full">
            {community ?
              <>
                <h1 className="text-3xl text-fire font-bold">{community.name}<span className="text-jet text-2xl ml-4">{community.symbol}</span></h1>
                <div className="flex flex-1 gap-6">
                  <div className="flex flex-1 flex-col gap-4">
                    {/* TODO: Display if registered */}
                    <CreatePost communityId={community._id} />
                    {posts && posts.map((post, i) => (
                      <PostItem
                        key={i}
                        post={post}
                        user={post.author}
                      />
                    ))}
                  </div>
                  <div className="w-[25%] flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">
                      Members
                    </h3>
                    <ul>
                      {community.members.map((member) =>
                        <li key={member.address} className="flex gap-2 items-center">
                          <UserImage displayPicture={member.image} />
                          <a className="font-semibold" href={`/users/${member.address}`}>{member.username ? `${member.username} (${formatAddress(member.address)})` : `${formatAddress(member.address)}`}</a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </>
              :
              // TODO: Display only if address is valid ERC721 contract
              <div className="flex-1 flex justify-between">
                <h1 className="text-3xl font-bold text-fire">Community has not been created yet</h1>
                <button type="button" onClick={createCommunity} className="action-button h-min">Begin community 😄</button>
              </div>}
          </div>

      }
    </main>
  );
};

export default CommunityHome;
