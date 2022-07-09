export type TweetBody = {
  text: string;
  username: string;
  profileImg: string;
  image?: string;
};

export interface Tweet {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _type: "tweet";
  blockTweet: boolean;
  text: string;
  username: string;
  profileImg: string;
  image?: string;
}

export interface Comment {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _type: "comment";
  comment: string;
  username: string;
  profileImg: string;
  tweet: {
    _ref: string;
    _type: "reference";
  };
}

export interface CommentBody {
  comment: string;
  username: string;
  profileImg: string;
  tweet: {
    _ref: string;
    _type: "reference";
  };
}
