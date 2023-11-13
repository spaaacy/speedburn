import Post from "@/models/post";
import { connectToDb } from "@/util/database";

export const GET = async (req, res) => {
  try {
    const community = req.nextUrl.searchParams.get("community_id");
    await connectToDb();
    const posts = await Post.find({ community }).populate("author");
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
