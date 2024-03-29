import { RefreshIcon } from "@heroicons/react/outline";
import { Tweet } from "../typings";
import TweetItem from "./TweetItem";
import TweetBox from "./TweetBox";
import { fetchTweets } from "../lib/fetchTweets";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  tweets: Tweet[];
}

function Feed({ tweets: tweetsProp }: Props) {
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp);

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing");
    const tweets = await fetchTweets();
    setTweets(tweets);

    toast.success("Feed updated", {
      id: refreshToast,
    });
  };

  return (
    <div className="lg:col-span-5 col-span-7 border-x max-h-screen overflow-scroll scrollbar-hide">
      <div className="flex items-center justify-between ">
        <h1 className="p-5 pb-0 text-xl font-bold">Home</h1>
        <RefreshIcon
          onClick={() => handleRefresh()}
          className="h-8 w-8 cursor-pointer text-twitter mr-5 mt-5 transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
        />
      </div>

      {/* Tweetbox */}
      <div>
        <TweetBox setTweets={setTweets} />
      </div>

      {/* Feed */}
      <div>
        {tweets.map((tweet) => (
          <TweetItem key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}
export default Feed;
