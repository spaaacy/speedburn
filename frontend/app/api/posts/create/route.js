import Post from "@/models/post";
import { connectToDb } from "@/util/database";

export const POST = async (req, res) => {
  try {
    const { title, body, author, community } = await req.json();
    await connectToDb();
    await Post.create({
      title: title,
      body: body,
      author: author,
      community: community,
    });
    return new Response("Post has been created", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
