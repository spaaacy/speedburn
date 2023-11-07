import Proposal from "@/models/proposal";
import { connectToDb } from "@/util/database";

export const GET = async (req, { params }) => {
  try {
    const { proposalId } = params;
    await connectToDb();
    const proposal = await Proposal.findOne({ proposalId }).populate("author");
    return new Response(JSON.stringify(proposal), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
