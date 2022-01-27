import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const patients = await prisma.patient.findMany();
      res.status(200).json(patients);
      break;
    default:
      res.status(405).json({ error: `method ${req.method} Not Allowed` });
  }
};
