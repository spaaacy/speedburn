import User from "@/models/user";
import { connectToDb } from "@/util/database";

export const PATCH = async (req, { params }) => {
  try {
    const details = {};
    const { username, image } = await req.json();
    if (username.length > 0) details.username = username;
    if (image.length > 0) details.image = image;
    await connectToDb();
    await User.updateOne({ address: params.address }, details);
    return new Response("User details has been updated", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};