import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { auth } from "@/utils/auth";

export async function POST(req) {
    try {
        const url = new URL(req.url);
        const pathParts = url.pathname.split('/');
        const idIndex = pathParts.indexOf('blogs') + 1;
        const id = pathParts[idIndex];

        if (!id || isNaN(parseInt(id))) {
            return NextResponse.json({ error: "Invalid blog post ID" }, { status: 400 });
        }

        const authResult = await auth(req);
        if (authResult instanceof NextResponse) {
            return authResult;
        }

        const user = authResult?.user;
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
        }

        const userExists = await prisma.user.findUnique({ where: { id: user.userId } });
        const blogPostExists = await prisma.blogPost.findUnique({ where: { id: parseInt(id) } });

        if (!userExists) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        if (!blogPostExists) {
            return NextResponse.json({ error: "Blog post does not exist" }, { status: 400 });
        }

        // Proceed with comment creation
        const comment = await prisma.comment.create({
            data: {
                content,
                userId: user.userId,
                blogPostId: parseInt(id),
            },
        });

        return NextResponse.json(comment, { status: 201 });

    } catch (error) {
        console.error("Error processing request:", error.message || error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 400 });
    }
}