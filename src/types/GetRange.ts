import { Post } from "../models/post.model";

interface GetRange {
  postRange: Post[],
  totalPost: number
}

export default GetRange;