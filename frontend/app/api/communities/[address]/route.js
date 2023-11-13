import Community from "@/models/community";
import User from "@/models/user";
import { connectToDb } from "@/util/database";

export const GET = async (req, res) => {
  try {
    const { address } = res.params;
    await connectToDb();
    const community = await Community.findOne({ address }).populate("members");
  return new Response(JSON.stringify(community), { status: 200 });
} catch (error) {
  console.error(error);
  return new Response(error, { status: 500 });
}
};
