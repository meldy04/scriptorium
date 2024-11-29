'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/app/components/Footer/Footer';

interface ReportedContent {
    id: number;
    title: string;
    description: string;
    reportCount: number;
    user: {
        firstName: string;
        lastName: string;
    };
    type: string;
    isHidden: boolean;
}

const ReportedContentPage = () => {
    const { user, token } = useAuth();
    const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            setError('Unauthorized Access.');
            return;
        }

        const fetchReportedContent = async () => {
            try {
                const response = await axios.get('/api/admin/reported-content', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { contentType: 'BlogPost' },
                });
                setReportedContent(response.data);
            } catch (err) {
                console.error('Error fetching reported content:', err);
                setError('Failed to load reported content.');
            } finally {
                setLoading(false);
            }
        };
        fetchReportedContent();
    }, [token, user]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-10">
                <h1 className="text-2xl font-bold mb-4">Reported Content</h1>
                {reportedContent.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {reportedContent.map((content) => (
                            <div key={content.id} className="p-4 border rounded-lg">
                                <h2 className="text-xl font-bold">{content.title}</h2>
                                <p className="text-gray-600">By {content.user.firstName} {content.user.lastName}</p>
                                <p className="mt-2">{content.description}</p>
                                <p className="mt-2 text-sm text-red-500">Reports: {content.reportCount}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reported content found.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ReportedContentPage;