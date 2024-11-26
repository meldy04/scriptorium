import prisma from '../../utils/db';

async function seed() {
    await prisma.blogPost.createMany({
        data: [
            {
                title: 'Welcome to Scriptorium',
                description: 'Learn more about our platform.',
                content: 'This is the full content of the blog post.',
                tags: 'welcome, platform',
                userId: 1,
                votes: 10,
            },
            {
                title: 'Tailwind Tips',
                description: 'Quick tips for styling with TailwindCSS.',
                content: 'Full blog content about Tailwind.',
                tags: 'tailwind, css',
                userId: 2,
                votes: 5,
            },
        ],
    });
    console.log('Seeding complete!');
    await prisma.$disconnect();
}

seed().catch((err) => {
    console.error(err);
    prisma.$disconnect();
});
