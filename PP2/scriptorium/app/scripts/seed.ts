import bcrypt from 'bcryptjs';
import prisma from '../../utils/db';

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomTags() {
    const tags = ['coding', 'javascript', 'typescript', 'tailwind', 'css', 'design', 'html', 'react', 'node', 'backend', 'frontend', 'web development'];
    const numberOfTags = getRandomInt(1, 3); // Select 1-3 random tags
    const selectedTags: string[] = [];

    for (let i = 0; i < numberOfTags; i++) {
        const randomTag = tags[getRandomInt(0, tags.length - 1)];
        if (!selectedTags.includes(randomTag)) {
            selectedTags.push(randomTag);
        }
    }

    return selectedTags.join(', ');
}

async function seed() {
    // Seed users (30 users)
    const users = Array.from({ length: 30 }).map((_, index) => ({
        email: `user${index + 1}@example.com`,
        password: `password${index + 1}`,
        firstName: `FirstName${index + 1}`,
        lastName: `LastName${index + 1}`,
    }));

    // Hash passwords for users
    const hashedUsers = await Promise.all(users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
    }));

    await prisma.user.createMany({
        data: hashedUsers,
    });

    console.log('Users seeded successfully!');

    // Seed blog posts (40 blog posts)
    const blogPosts = Array.from({ length: 40 }).map((_, index) => ({
        title: `Blog Post ${index + 1}: ${['Learn', 'Understanding', 'Mastering'][getRandomInt(0, 2)]} ${['JavaScript', 'CSS', 'React', 'Node.js'][getRandomInt(0, 3)]}`,
        description: `An in-depth look at ${['JavaScript', 'CSS', 'React', 'Node.js'][getRandomInt(0, 3)]}.`,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. This blog post discusses ${['JavaScript', 'CSS', 'React', 'Node.js'][getRandomInt(0, 3)]} and its relevance in modern web development.`,
        tags: generateRandomTags(),
        userId: getRandomInt(1, 30), // Randomly assign one of the 30 users
        votes: getRandomInt(0, 100),
    }));

    await prisma.blogPost.createMany({
        data: blogPosts,
    });

    console.log('Blog posts seeded successfully!');

    // Seed templates (40 templates)
    const templates = Array.from({ length: 40 }).map((_, index) => ({
        title: `Template ${index + 1}: ${['Starter', 'Advanced', 'UI Kit'][getRandomInt(0, 2)]}`,
        explanation: `A ${['simple', 'comprehensive', 'highly customizable'][getRandomInt(0, 2)]} template for ${['React', 'Vue', 'Node.js', 'Express'][getRandomInt(0, 3)]}`,
        tags: generateRandomTags(),
        code: `// Sample code for template ${index + 1}...`,
        language: ['JavaScript', 'TypeScript', 'Python', 'Java', 'PHP'][getRandomInt(0, 4)],
        userID: getRandomInt(1, 30),
        isPublic: Math.random() > 0.5, // Randomly assigning public or private status
    }));

    await prisma.template.createMany({
        data: templates,
    });

    console.log('Templates seeded successfully!');

    // Seed comments for blog posts (30-40 comments)
    const numberOfComments = getRandomInt(30, 40);
    const comments = Array.from({ length: numberOfComments }).map((_, index) => ({
        content: `This is comment #${index + 1} for blog post ${getRandomInt(1, 40)}`,
        userId: getRandomInt(1, 30),
        blogPostId: getRandomInt(1, 40),
    }));

    await prisma.comment.createMany({
        data: comments,
    });

    console.log('Comments seeded successfully!');

    // Seed reports (40 reports)
    const reports = Array.from({ length: 40 }).map((_, index) => ({
        explanation: `Report #${index + 1} explanation for blog post ${getRandomInt(1, 40)}`,
        userId: getRandomInt(1, 30),
        blogPostId: getRandomInt(1, 40),
        createdAt: new Date(),
    }));

    await prisma.report.createMany({
        data: reports,
    });

    console.log('Reports seeded successfully!');

    await prisma.$disconnect();
    console.log('Seeding complete!');
}

seed().catch((err) => {
    console.error(err);
    prisma.$disconnect();
});
