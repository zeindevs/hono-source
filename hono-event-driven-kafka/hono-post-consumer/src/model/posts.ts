import mongoose from "mongoose";

interface IPost {
  title: string;
  content: string;
}

const postSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const PostModel = mongoose.models.Post || mongoose.model("Post", postSchema);
export default PostModel;
