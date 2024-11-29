'use client';

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from '@/app/context/AuthContext';
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useRouter } from "next/navigation";

interface Blog {
    id: string;
    title: string;
    description: string;
    votes: number;
    comments: { id: string; text: string; isHidden: boolean }[];
    isHidden: boolean;
    user: { id: string; firstName: string };
}

const BlogsPage = () => {
    const { user, token } = useAuth();
    const router = useRouter();
    const isAdmin = user?.role === "ADMIN";

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [commentingBlogId, setCommentingBlogId] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [reportingBlogId, setReportingBlogId] = useState<string | null>(null);
    const [reportExplanation, setReportExplanation] = useState("");
    const [error, setError] = useState<string | null>(null);

    const blogsPerPage = 9;

    const fetchBlogs = useCallback(async () => {
        try {
            const response = await axios.get("/api/blogs", {
                params: { search: searchQuery },
            });
            setBlogs(response.data || []);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
            setBlogs([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleAddCommentClick = (blogId: string) => {
        if (!user || !token) {
            setError("You need to be logged in to add a comment.");
            return;
        }
        setCommentingBlogId(blogId);
        setError(null);
    };

    const submitComment = async () => {
        if (!commentingBlogId || !commentContent.trim()) {
            setError("Comment content cannot be empty.");
            return;
        }

        try {
            await axios.post(
                `/api/blogs/${commentingBlogId}/comments`,
                { content: commentContent },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Comment added successfully!");
            setCommentContent("");
            setCommentingBlogId(null);
            await fetchBlogs();
        } catch (error) {
            console.error("Failed to add comment:", error);
            alert("Failed to add comment.");
        }
    };

    const handleVote = async (id: string, voteType: 'up' | 'down', isBlog: boolean) => {
        if (!user || !token) {
            setError("You need to be logged in to vote.");
            return;
        }

        try {
            const url = isBlog
                ? `/api/blogs/${id}/vote`
                : `/api/comments/${id}/vote`;
            await axios.post(
                url,
                {voteType},
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            setBlogs(prevBlogs => prevBlogs.map(blog =>
                blog.id === id ? { ...blog, votes: blog.votes + (voteType === 'up' ? 1 : -1) } : blog
            ));
            fetchBlogs();
        } catch (error) {
            console.error("Failed to register vote:", error);
            alert("Failed to register vote.");
        }
    };

    const handleReportClick = (blogId: string) => {
        if (!user || !token) {
            setError("You need to be logged in to report a blog.");
            return;
        }
        setReportingBlogId(blogId);
        setError(null);
    };

    const submitReport = async () => {
        if (!reportingBlogId) return;

        try {
            await axios.post(
                "/api/report",
                {
                    explanation: reportExplanation,
                    userId: user?.id ?? "unknown",
                    blogPostId: reportingBlogId,
                    commentId: null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Report submitted successfully!");
        } catch (error) {
            console.error("Failed to submit report:", error);
            alert("Failed to submit report.");
        } finally {
            setReportingBlogId(null);
            setReportExplanation("");
        }
    };

    const handleHideContent = async (contentId: string, contentType: string) => {
        if (!isAdmin) {
            alert("Only administrators can perform this action.");
            return;
        }

        try {
            const response = await axios.post(
                `/api/admin/hideContent`,
                { contentId, contentType },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert(response.data.message);
            fetchBlogs();
        } catch (error) {
            console.error("Failed to hide content:", error);
            alert("Failed to hide content.");
        }
    };

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-6">Blogs</h1>

                <div className="search-bar mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search for blogs..."
                        className="p-2 border rounded"
                    />
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    {currentBlogs.length > 0 ? (
                        currentBlogs.map((blog) => {
                            const isVisible =
                                !blog.isHidden || blog.user.id === String(user) || isAdmin;

                            if (!isVisible) return null;

                            return (
                                <div
                                    key={blog.id}
                                    className={`p-4 rounded-lg shadow-md border-2 ${
                                        blog.isHidden ? "bg-gray-200" : " "
                                    }`}
                                >
                                    <h2 className="text-xl font-bold">{blog.title}</h2>
                                    <p className="text-sm">By {blog.user.firstName}</p>
                                    <p className="mt-2">{blog.description}</p>
                                    <p className="mt-2 text-sm text-gray-500">Votes: {blog.votes}</p>
                                    <p className="mt-2 text-sm text-gray-400">Comments: {blog.comments.filter(c => !c.isHidden).length}</p>

                                    {blog.isHidden && (
                                        <p className="mt-2 text-sm text-red-500 font-semibold">
                                            This content has been flagged as inappropriate.
                                        </p>
                                    )}

                                    {!blog.isHidden && (
                                        <>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => router.push(`/editor/${blog.id}`)}
                                                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                            >
                                                View Template
                                            </button>
                                            <button
                                                onClick={() => handleAddCommentClick(blog.id)}
                                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            >
                                                Add Comment
                                            </button>
                                            <button
                                                onClick={() => handleReportClick(blog.id)}
                                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                Report
                                            </button>
                                        </div>
                                        </>
                                    )}

                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={() => handleVote(blog.id, 'up', true)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            <FaThumbsUp />
                                        </button>
                                        <button
                                            onClick={() => handleVote(blog.id, 'down', true)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            <FaThumbsDown />
                                        </button>
                                    </div>

                                    {/* Comments and Voting */}
                                    {blog.comments.map((comment) => (
                                        !comment.isHidden && (
                                        <div key={comment.id} className="mt-4 p-4 border rounded-lg">
                                            <p>{comment.text}</p>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleVote(comment.id, 'up', false)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                                >
                                                    <FaThumbsUp/>
                                                </button>
                                                <button
                                                    onClick={() => handleVote(comment.id, 'down', false)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                >
                                                    <FaThumbsDown/>
                                                </button>
                                                <button
                                                    onClick={() => handleReportClick(comment.id)}  // report comment
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                >
                                                    Report Comment
                                                </button>
                                            </div>
                                        </div>
                                        )
                                    ))}

                                    {isAdmin && !blog.isHidden && (
                                        <button
                                            onClick={() => handleHideContent(blog.id, "BlogPost")}
                                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            Hide Content
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>No blogs found.</p>
                    )}
                </div>

                <div className="pagination flex justify-center mt-6">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded mr-2"
                    >
                        Previous
                    </button>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded"
                    >
                        Next
                    </button>
                </div>
            </div>

            {commentingBlogId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Add Comment</h2>
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Write your comment..."
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setCommentingBlogId(null)}
                                className="px-4 py-2 border rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitComment}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Submit Comment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {reportingBlogId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Report Blog</h2>
                        <textarea
                            value={reportExplanation}
                            onChange={(e) => setReportExplanation(e.target.value)}
                            placeholder="Explain why you are reporting this blog..."
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setReportingBlogId(null)}
                                className="px-4 py-2 border rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReport}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BlogsPage;
