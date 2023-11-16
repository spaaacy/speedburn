'use-client';

import Image from "next/image";
import UserImage from "./UserImage";
import { formatAddress, formatDate } from "@/util/helpers";
import { useEffect, useState } from "react";

const ExpandedPost = ({ expandedPostRef, post, user }) => {

    const [commentField, setCommentField] = useState("");
    const [comment, setComment] = useState();

    const fetchComments = async () => {
        await fetch(`/api/comments?post_id=${post._id}`, {
            method: "GET"
        })
    }

    const createComment = async () => {
        await fetch(`api/comments/create`, {
            method: "POST",
            body: JSON.stringify({
                comment: commentField
            })
        })
    }



    useEffect(() => {
        fetchComments();
    })

    return (
        <div className="w-full h-full fixed bg-jet bg-opacity-20 z-10">
            <div ref={expandedPostRef} className="absolute min-w-[640px] w-[35%] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex flex-col rounded-md bg-pale p-6 gap-4">
                <div className="flex items-center gap-3">
                    <UserImage displayPicture={user.image} />
                    <p className="font-semibold">{user.username ?? formatAddress(user.address)}</p>
                    <p className="font-light ml-auto ">{formatDate(post.createdAt)}</p>
                </div>
                <p className="mt-2 ">{post.title}</p>
                <p className="mt-2 ">{post.body}</p>
                <div className="flex items-center mt-2 px-2 gap-2">
                    <Image src={'/assets/icons/heart.svg'} width={20} height={20} />
                    <p>20</p>
                    <Image className="ml-10" src={'/assets/icons/comments.svg'} width={20} height={20} />
                    <p>20</p>
                    <Image className="ml-auto" src={'/assets/icons/report.svg'} width={20} height={20} />
                </div>
                <hr />

                <div className="flex gap-2">
                    <textarea
                        className="p-3 rounded-lg resize-none h-[50px] flex-1"
                        placeholder="Comment on post"
                        type="text"
                        onChange={(e) => setCommentField(e.target.value)}
                    />
                    <button type="button" onClick={createComment} className="bg-jet rounded-full px-4 text-sm text-white">Submit</button>
                </div>
                {comment &&
                    <>
                        <hr />
                        <div className="bg-white flex flex-col p-4 rounded-lg">
                        </div>
                    </>
                }
            </div>
        </div >
    )
}

export default ExpandedPost