import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    await auth(req, res, async () => {
        if (req.method === 'PUT') {
            const { userId, firstName, lastName, avatar, phone } = req.body;
            
            try {
                if (req.user.userId !== userId) {
                    return res.status(403).json({ error: 'Denied - you can only edit your own profile' });
                }

                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: { firstName, lastName, avatar, phone },
                });
                return res.status(200).json(updatedUser);
            } catch (error) {
                res.status(400).json({ error: 'Profile update failed' });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }   
    });  
}