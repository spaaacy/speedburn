import Proposal from "@/models/proposal";
import { connectToDb } from "@/util/database";

export const POST = async (req, res) => {
  const proposal = await req.json();
  console.log(proposal);
  try {
    await connectToDb();
    await Proposal.create(proposal);
    return new Response("Proposal ${proposal.proposalId} has been created!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
