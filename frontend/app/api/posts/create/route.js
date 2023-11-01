import Post from "@/models/post";
import { connectToDb } from "@/util/database";

export const POST = async (req, res) => {
  try {
    const { title, body, authorAddress } = await req.json();
    await connectToDb();
    await Post.create({
      title: title,
      body: body,
      authorAddress: authorAddress,
    });
    return new Response("Post has been created", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
