// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  fetch(
    "https://j4g8pylc.api.sanity.io/v2021-10-21/data/query/production?query=*%5B%20_type%20%3D%3D%20%22tweet%22%5D%7B%0A%20%20_id%2C%0A%20%20text%2C%0A%20%20username%2C%0A%20%20%22comments%22%3A%20*%5B%20_type%20%3D%3D%20%22comment%22%20%26%26%20tweet._ref%20%3D%3D%20%5E._id%20%5D%7B%0A%20%20%20%20comment%2C%0A%20%20username%0A%20%20%7D%0A%7D"
  )
    .then((res) => res.json())
    .then((data) => console.log("data is", data))
    .catch((error) => console.error(error));

  res.status(200).json({ name: "John Doe" });
}
