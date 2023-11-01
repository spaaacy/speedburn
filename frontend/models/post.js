import { Schema, models, model } from "mongoose";

const PostSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "Title cannot be left empty"],
    },
    body: {
      type: String,
      required: [true, "Body cannot be left empty"],
    },
    authorAddress: {
      type: String,
      required: [true, "Author address must be provided"],
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.virtual("author", {
  ref: "User",
  localField: "authorAddress",
  foreignField: "address",
  justOne: true,
});

const Post = models.Post || model("Post", PostSchema);

export default Post;
