import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  FormEvent,
  MouseEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { fetchTweets } from "../lib/fetchTweets";
import { Tweet, TweetBody } from "../typings";

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

function TweetBox({ setTweets }: Props) {
  const [input, setInput] = useState<string>("");
  const { data: session } = useSession();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const addImageToTweet = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!imageInputRef.current?.value) return;
    setImageUrl(imageInputRef.current.value);

    imageInputRef.current.value = "";
    setImageUrlBoxIsOpen(false);
  };

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || "Unknown user",
      profileImg:
        session?.user?.image ||
        "https://images.unsplash.com/photo-1656274990019-979c5d603bb5?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTcyMzM5NDc&ixlib=rb-1.2.1&q=80",
      image: imageUrl,
    };

    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetInfo),
      method: "POST",
    });

    const json = await result.json();
    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast("Tweet Posted", {
      icon: ";)",
    });
    return json;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postTweet();

    setInput("");
    setImageUrl("");
    setImageUrlBoxIsOpen(false);
  };

  return (
    <div className="flex space-x-2 p-5">
      <img
        src={
          session?.user?.image ||
          "https://images.unsplash.com/photo-1656274990019-979c5d603bb5?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTcyMzM5NDc&ixlib=rb-1.2.1&q=80"
        }
        alt=""
        className="h-14 w-14 object-cover rounded-full object-bottom mt-4"
      />
      <div className="flex-1 items-center pl-2">
        <form
          className="flex flex-1 flex-col"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            className="h-24 w-full text-xl outline-none placeholder:text-xl"
            type="text"
            placeholder={`What's happening, ${session?.user?.name} ?`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center">
            <div className="flex space-x-2 text-twitter flex-1">
              <PhotographIcon
                onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
              />
              <SearchCircleIcon className="h-5 w-5" />
              <EmojiHappyIcon className="h-5 w-5" />
              <CalendarIcon className="h-5 w-5" />
              <LocationMarkerIcon className="h-5 w-5" />
            </div>
            <button
              disabled={!input || !session}
              className={`rounded-full px-5 py-2 bg-twitter text-white font-bold disabled:opacity-50`}
              type="submit"
            >
              Tweet
            </button>
          </div>
          {imageUrlBoxIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                className="flex-1 bg-transparent outline-none p-2 text-white placeholder:text-white"
                type="text"
                placeholder="Enter Image URL"
              />
              <button
                type="submit"
                onClick={(e)=>addImageToTweet(e)}
                className="font-bold  text-white"
              >
                Add Image
              </button>
            </form>
          )}
        </form>
        {imageUrl && (
          <div className="relative">
            {imageUrl && (
              <img
                className="mt-10 h-[400px] w-full rounded--xl shadow-lg object-cover"
                src={imageUrl}
                alt=""
              />
            )}
            <button
              onClick={() => setImageUrl("")}
              className="absolute top-0 right-0 py-1 px-2 m-1 text-sm text-white bg-twitter/50  font-bold cursor-pointer rounded-full"
            >
              X
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default TweetBox;
