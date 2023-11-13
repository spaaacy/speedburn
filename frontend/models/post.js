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
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author must be provided"],
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: [true, "Community must be provided"],
    }
  },
  {
    timestamps: true,
  }
);

const Post = models.Post || model("Post", PostSchema);

export default Post;
