import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        const { firstName, lastName, bio } = req.body;

        if (!firstName || !lastName) {
          return res.status(400).json({error: 'First name and last name are required.'})
        }

        const newAuthor = await prisma.author.create({
          data: {
            firstName,
            lastName,
            bio,
          },
        });
        return res.status(201).json(newAuthor);
      } catch (error) {
        return res.status(500).json({error: 'Error creating author.'})
      }
    } else if (req.method === "GET") {
      try {
        const { id, firstName, lastName } = req.query;
        const authors = await prisma.author.findMany({
          where: {
            id: id ? { equals: id } : undefined,
            firstName: firstName ? { contains: firstName } : undefined,
            lastName: lastName ? { contains: lastName } : undefined,
          },
          include: { Book: true },
        });
        return res.status(200).json(authors);
      } catch (error) {
          console.error(error);
          return res.status(500).json({error: 'Issue filtering authors.'});
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
  }