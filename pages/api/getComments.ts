// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { groq, SanityClient } from "next-sanity";
import { sanityClient } from "../../lib/sanity.server";
import { Comment } from "../../typings";

type Data = {
  comments: Comment[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { tweetId } = req.query;

  const feedQuery = groq`
 *[_type == 'comment' && tweet._ref == '${tweetId}']{
        _id,
        ...
    } | order(_createdAt desc)
    `;
  const comments: Comment[] = await sanityClient.fetch(feedQuery);

  res.status(200).json({ comments });
}

/*  Do a placeholder insted of interpolation and pass params separately

  const feedQuery = groq`
 *[_type == 'comment' && tweet._ref == ${tweetId}]{
        _id,
        ...
    } | order(_createdAt desc)
    `;
const comments: Comment[] = await sanityClient.fetch(feedQuery, {
    tweetId,
});

*/
