import User from "@/models/user";
import { connectToDb } from "@/util/database";

export const GET = async (req, { params }) => {
  try {
    await connectToDb();
    const user = await User.findOne({ address: params.address });
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
