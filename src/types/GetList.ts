import { Post } from "../models/post.model";

interface GetList {
  postList: Post[],
  totalPost: number
}

export default GetList;