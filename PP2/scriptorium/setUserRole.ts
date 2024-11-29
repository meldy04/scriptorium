import prisma from '@/utils/db';

async function setUserRoleToAdmin(userId: number) {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role: 'ADMIN',
            },
        });

        console.log('User role updated:', updatedUser);
    } catch (error) {
        console.error('Error updating user role:', error);
    }
}

// Call this function with the user's ID you want to update
setUserRoleToAdmin(7); // Replace '1' with the actual user ID