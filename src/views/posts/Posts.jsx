import { useContext } from "react";
import { PostsContext } from "../../contexts.js/postsContext";
import Post from "./Post";

const Posts = () => {
  const {
    state: { posts, meta },
    loadMorePosts,
  } = useContext(PostsContext);
  const morePosts = meta.total_entries > posts.length;
  return (
    <div id="posts-list-holder" className="grow overflow-auto">
      <div id="post-list" className="flex flex-wrap overflow-auto">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        {morePosts && (
          <button
            key="more-posts"
            className=" m-5 mt-0 p-5 rounded pointer bg-cyan-400 border border-black text-black font-bold text-xl self-stretch w-full"
            onClick={loadMorePosts}
          >
            Load More Posts
          </button>
        )}
      </div>
    </div>
  );
};

export default Posts;
