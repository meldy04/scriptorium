import React from 'react';
import NavBar from "@/app/components/Navbar/Navbar";
import prisma from '@/utils/db';

export const metadata = {
    title: 'Blogs - Scriptorium',
    description: 'Browse blog posts on Scriptorium.',
};

async function fetchBlogs() {
    const blogs = await prisma.blogPost.findMany({
        where: { isHidden: false },
        orderBy: { id: 'desc' },
        select: {
            id: true,
            title: true,
            description: true,
            user: { select: { firstName: true } },
            votes: true,
            comments: true,
        },
    });
    return blogs;
}

interface Blog {
    id: number;
    title: string;
    description: string;
    votes: number;
    user: {
        firstName: string;
    };
    comments: {
        id: number;
        content: string;
        userId: number;
        isHidden: boolean;
        blogPostId: number;
    }[];
}

function BlogCard({ blog }: { blog: Blog }) {
    return (
        <div className="border p-4 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold">{blog.title}</h2>
            <p className="text-gray-600 text-sm">By {blog.user.firstName}</p>
            <p className="mt-2">{blog.description.substring(0, 150)}...</p>
            <p className="mt-2 text-sm text-gray-500">Votes: {blog.votes}</p>
            <p className="mt-2 text-sm text-gray-400">
                Comments: {blog.comments.length}
            </p>
        </div>
    );
}


const BlogsPage = async () => {
    const blogs = await fetchBlogs();

    return (
        <div>
            <NavBar />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6">Blogs</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogsPage;
