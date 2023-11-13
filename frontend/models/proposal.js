import { Schema, models, model } from "mongoose";

const ProposalSchema = Schema({
  proposalId: {
    type: String,
    required: [true, "Proposal must have an ID!"],
    required: [true, "Proposal already exists!"],
  },
  proposer: {
    type: String,
    required: [true, "Proposer must be provided!"],
  },
  voteStart: {
    type: String,
    required: [true, "Vote start must be provided!"],
  },
  voteEnd: {
    type: String,
    required: [true, "Vote end must be provided!"],
  },
  description: {
    type: String,
    required: [true, "Description must be provided!"],
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
