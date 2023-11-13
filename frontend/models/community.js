import { Schema, models, model } from "mongoose";

const CommunitySchema = Schema({
    name: {
        type: String,
        required: [true, "Community must have a name"],
    },
    symbol: {
        type: String,
        required: [true, "Community must have a symbol"],
    },
    address: {
        type: String,
        unique: [true, "Community address must be unique!"],
        required: [true, "Community must have an address!"]
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: [true, "Address already exists!"],
    }
    ],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
}
)

const Community = models.Community || model("Community", CommunitySchema);

export default Community;