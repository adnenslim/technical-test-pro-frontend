import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const availabilities = await prisma.availability.findMany({
        where: { practitionerId: Number(req.query.practitionerId) },
      });
      res.status(200).json(availabilities);
      break;
    case 'DELETE':
      const { id } = JSON.parse(req.body);
      const availability = await prisma.availability.delete({
        where: {
          id,
        },
      });
      res.status(200).json(availability);
      break;
    default:
      res.status(405).json({ error: `method ${req.method} Not Allowed` });
  }
};
