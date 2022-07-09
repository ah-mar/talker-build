import { TwitterTweetEmbed } from "react-twitter-embed";
import { Comment, CommentBody, Tweet } from "../typings";
import TimeAgo from "react-timeago";
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { fetchComments } from "../lib/fetchComments";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Props {
  tweet: Tweet;
}

function TweetItem({ tweet }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const [input, setInput] = useState("");
  const { data: session } = useSession();

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);

    setComments(comments);
  };

  useEffect(() => {
    refreshComments();
  }, []);

  const postComment = async () => {
    const commentInfo: CommentBody = {
      comment: input,
      username: session?.user?.name || "Unknown user",
      profileImg:
        session?.user?.image ||
        "https://images.unsplash.com/photo-1656274990019-979c5d603bb5?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTcyMzM5NDc&ixlib=rb-1.2.1&q=80",
      tweet: {
        _ref: tweet._id,
        _type: "reference",
      },
    };

    const result = await fetch(`/api/addComment`, {
      body: JSON.stringify(commentInfo),
      method: "POST",
    });

    const json = await result.json();
    await refreshComments();

    toast("Comment Posted", {
      icon: ";)",
    });
    return json;
  };

  const handleCommentSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postComment();

    setInput("");

    setCommentBoxVisible(false);
  };

  return (
    <div className="flex flex-col space-x-3 border-y p-5 border-gray-100">
      <div className="flex space-x-3">
        <img
          className="h-10 w-10 rounded-full object-cover bg-black hover:scale-150 transition-all transform duration-200 ease-out"
          src={tweet?.profileImg}
          alt=""
        />

        <div>
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet?.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet?.username.replace(/\s+/g, "").toLowerCase()} .
            </p>
            <TimeAgo
              className="text-sm text-gray-500"
              date={tweet?._createdAt}
            />
          </div>

          <p className="pt-1">{tweet?.text}</p>
          {tweet?.image && (
            <img
              className="m-5 ml-0 mb-1 max-h-[400px] rounded-lg object-cover shadow-xl"
              src={tweet.image}
              alt=""
            />
          )}
        </div>
      </div>

      <div
        onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
        className="mt-5 px-10 flex justify-between  "
      >
        <div className="flex items-center space-x-3 text-gray-400 cursor-pointer">
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments?.length}</p>
        </div>
        <div className="flex items-center space-x-3 text-gray-400 cursor-pointer">
          <SwitchHorizontalIcon className="h-5 w-5" />
        </div>
        <div className="flex items-center space-x-3 text-gray-400 cursor-pointer">
          <HeartIcon className="h-5 w-5" />
        </div>
        <div className="flex items-center space-x-3 text-gray-400 cursor-pointer">
          <UploadIcon className="h-5 w-5" />
        </div>
      </div>
      {commentBoxVisible && (
        <form
          onSubmit={(e) => handleCommentSubmit(e)}
          className="mt-3 flex space-x-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1  rounded-lg bg-gray-100 p-2 outline-none"
            type="text"
            placeholder="Write a Comment"
          />
          <button
            type="submit"
            disabled={!session || !input}
            className="text-twitter disabled:text-gray-200"
          >
            Post
          </button>
        </form>
      )}

      {comments?.length > 0 && (
        <div className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5">
          {comments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-2">
              <hr className="absolute left-5 top-10 h-8 border-x border-twitter/30" />
              <img
                className=" mt-2 w-7 h-7 rounded-full object-cover hover:scale-150 transition-all duration-200 "
                src={comment.profileImg}
                alt=""
              />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold">{comment.username}</p>
                  <p className="hidden text-sm text-gray-500 lg:inline">
                    @{comment.username.replace(/\s+/g, "").toLowerCase()} .
                  </p>
                  <TimeAgo
                    className="text-sm text-gray-500"
                    date={comment?._createdAt}
                  />
                </div>

                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default TweetItem;
