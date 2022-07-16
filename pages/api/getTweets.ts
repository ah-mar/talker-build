// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { groq, SanityClient } from "next-sanity";
import { sanityClient } from "../../lib/sanity.server";
import { Tweet } from "../../typings";

type Data = {
  tweets: Tweet[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const feedQuery = groq`
    *[_type == 'tweet' && blockTweet != true]{
        _id,
        ...
    } | order(_createdAt desc)
    `;
  const tweets: Tweet[] = await sanityClient.fetch(feedQuery);
console.log("tweets in api", tweets)
  res.status(200).json({ tweets });
}

// You can fetch it directly from getServerSIde Props to avoid double fetch call
// You can query tweets and comments together without passing id and all by using query such as
/*
*[ _type == "tweet"]{
  _id,
  text,
  username,
  "comments": *[ _type == "comment" && tweet._ref == ^._id ]{
    comment,
  username
  }
}

*/
