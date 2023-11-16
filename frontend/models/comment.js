import { Schema, models, model } from "mongoose";

const CommentSchema = Schema(
    {
        body: {
            type: String,
            required: [true, "Body cannot be left empty"],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Author must be provided"],
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
        }
    },
    {
        timestamps: true,
    }
);

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
