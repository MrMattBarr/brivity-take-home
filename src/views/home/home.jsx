import FocusedPost from "../posts/FocusedPost";
import Posts from "../posts/Posts";

const Home = () => {
  return (
    <div id="home-page" className="flex flex-col overflow-hidden">
      <FocusedPost />
      <Posts />
    </div>
  );
};

export default Home;
