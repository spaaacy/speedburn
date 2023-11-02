import User from "@/models/user";
import { connectToDb } from "@/util/database";

export const POST = async (req, res) => {
  try {
    const { address, username, image } = await req.json();
    await connectToDb();
    console.log({address,username,image});
    await User.create({
      address: address,
      username: username,
      image: image,
    });
    return new Response("User has been created", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
