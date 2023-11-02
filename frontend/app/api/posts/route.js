import Post from "@/models/post";
import { connectToDb } from "@/util/database";

export const GET = async (req, res) => {
  try {
    await connectToDb();
    const posts = await Post.find({}).populate("author");
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
