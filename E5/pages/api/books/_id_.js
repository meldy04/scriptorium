export async function handler(req, res) {
    if (req.method === "PUT") {
      const { id } = req.query;
  
      // TODO: Use Prisma to update the book by ID
      const auth = await prisma.book.findUnique({
        where: { id: parseInt(id) },
      });

      if (!auth) {
        return res.status(404).json({error: 'ID not found'});
      }

      try {
        const { title, isbn, publishedDate, available } = req.body;
        
        const updateData = {};

        if (title) {
            updateData.title = title;
        }
        if (isbn) {
            updateData.isbn = isbn;
        }
        if (publishedDate) {
            updateData.publishedDate = publishedDate;
        }
        if (available) {
            updateData.available = available;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({error: 'No fields to update.'});
        }

        const updatedBook = await prisma.book.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        return res.status(200).json(updatedBook);
      } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Error updated author'});
        }
    } else if (req.method === "DELETE") {
        try {
            const auth = await prisma.book.findUnique({
                where: { id: parseInt(id) },
              });
        
              if (!auth) {
                return res.status(404).json({error: 'ID not found'});
              }

              await prisma.book.delete({
                where: { id: parseInt(id) },
              });
              return res.status(200).json({ message: 'Book successfully deleted'});
        } catch (error) {
            return res.status(500).json({ error: 'Error deleting book'});
        }
        } else {
            res.status(405).json({ message: "Method not allowed" });
        }
  }