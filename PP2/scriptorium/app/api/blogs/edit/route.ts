import prisma from "@/utils/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/utils/auth";

// Define types for request body
interface UpdateBlogRequest {
    id: number;
    title: string;
    description: string;
    content: string;
    tags: string;
    templateIds: number[];
}
export async function PUT(req: NextRequest) {
    const authResult = auth(req);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const { id, title, description, content, tags, templateIds }: UpdateBlogRequest = await req.json();

        const parsedId = Number(id);
        if (isNaN(parsedId)) {
            throw new TypeError("Invalid type for 'id'. Expected a number.");
        }

        // Ensure each templateId is a number
        const validatedTemplateIds = templateIds.map((id: number) => {
            const parsedTemplateId = Number(id);
            if (isNaN(parsedTemplateId)) {
                throw new TypeError("Invalid type for 'templateId'. Expected a number.");
            }
            return parsedTemplateId;
        });

        const updatedBlogPost = await prisma.blogPost.update({
            where: { id: parsedId },
            data: {
                title,
                description,
                content,
                tags,
                templates: { set: validatedTemplateIds.map((id) => ({ id })) },
            },
        });

        return NextResponse.json(updatedBlogPost, { status: 200 });
    } catch (error) {
        console.error("Error updating blog post:", error);

        return NextResponse.json(
            {
                error: 'Failed to update blog post',
                details: (error instanceof Error) ? error.message : 'Unknown error'
            },
            { status: 400 }
        );
    }
}