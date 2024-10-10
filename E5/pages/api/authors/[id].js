export async function handler(req, res) {
    if (req.method === "PUT") {
      const { id } = req.query;

      const auth = await prisma.author.findUnique({
        where: { id: parseInt(id) },
      });

      if (!auth) {
        return res.status(404).json({error: 'ID not found'});
      }
      
      try {
        const { firstName, lastName, bio } = req.body;
        const updateData = {};

        if (firstName) {
            updateData.firstName = firstName;
        }
        if (lastName) {
            updateData.lastName = lastName;
        }
        if (bio) {
            updateData.bio = bio;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({error: 'No fields to update.'});
        }

        const updatedAuthor = await prisma.author.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        return res.status(200).json(updatedAuthor);
      } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Error updated author'});
        }
    } else if (req.method === "DELETE") {
        try {
            const auth = await prisma.author.findUnique({
                where: { id: parseInt(id) },
              });
        
              if (!auth) {
                return res.status(404).json({error: 'ID not found'});
              }

              await prisma.author.delete({
                where: { id: parseInt(id) },
              });
              return res.status(200).json({ message: 'Author successfully deleted'});
        } catch (error) {
            return res.status(500).json({ error: 'Error deleting author'});
        }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }