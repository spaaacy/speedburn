import { Schema, models, model } from "mongoose";

const ProposalSchema = Schema({
  proposalId: {
    type: String,
    required: true,
    unique: true,
  },
  proposer: {
    type: String,
    required: true,
  },
  voteStart: {
    type: String,
    required: true,
  },
  voteEnd: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

ProposalSchema.virtual("author", {
  ref: "User",
  localField: "proposer",
  foreignField: "address",
  justOne: true,
});

ProposalSchema.set("toJSON", { virtuals: true });
ProposalSchema.set("toObject", { virtuals: true });


const Proposal = models.Proposal || model("Proposal", ProposalSchema);

export default Proposal;
