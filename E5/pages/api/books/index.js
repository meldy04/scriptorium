import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
      // TODO: Use Prisma to create a new book linked to an existing author
      try {
        const { title, isbn, publishedDate, authorId } = req.body;

        if (!title || !isbn || !publishedDate || !authorId) {
          return res.status(400).json({error: 'Each field is required.'});
        }

        const exists = await prisma.book.findUnique({
          where: { isbn },
        });

        if (exists) {
          return res.status(409).json({error: 'A book with this isbn already exists.'});
        }

        const author = await prisma.author.findUnique({
          where: { id: authorId },
        });

        if (!author) {
          return res.status(404).json({error: 'Author not found.'});
        }

        const newBook = await prisma.book.create({
          data: {
            title,
            isbn, 
            publishedDate: new Date(publishedDate), 
            author: {
              connect: { id: authorId },
            },
          },
        });
        return res.status(201).json(newBook);
      } catch (error) {
        return res.status(500).json({error: 'Error creating book.'});
      }
    } else if (req.method === "GET") {
      try {
        const { id, authorId, title, available } = req.query;
        const books = await prisma.book.findMany({
          where: {
            id: id ? { equals: id } : undefined,
            authorId: authorId ? { equals: authorId } : undefined,
            title: title ? { contains: title } : undefined,
            available: available ? { equals: available } : undefined,
          },
          include: { author: true },
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