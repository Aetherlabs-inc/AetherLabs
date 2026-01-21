import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles, Zap, Shield, Users, Camera, Globe } from 'lucide-react';

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    status: 'coming-soon' | 'in-development' | 'beta';
    estimatedDate?: string;
}

const ComingSoon: React.FC = () => {
    const features: Feature[] = [
        {
            id: 'ai-artwork-analysis',
            title: 'AI Artwork Analysis',
            description: 'Advanced AI-powered analysis of artwork authenticity, style, and provenance using machine learning algorithms.',
            icon: <Sparkles className="h-6 w-6" />,
            status: 'coming-soon',
            estimatedDate: 'Q2 2024'
        },
        {
            id: 'blockchain-verification',
            title: 'Secure Certificate Verification',
            description: 'Cryptographically secured certificate verification system with tamper-proof digital records for artwork authenticity and ownership.',
            icon: <Shield className="h-6 w-6" />,
            status: 'in-development',
            estimatedDate: 'Q3 2024'
        },
        {
            id: 'collaborative-galleries',
            title: 'Collaborative Galleries',
            description: 'Create and manage virtual galleries with real-time collaboration features for curators and artists.',
            icon: <Users className="h-6 w-6" />,
            status: 'coming-soon',
            estimatedDate: 'Q4 2024'
        },
        {
            id: 'ar-viewer',
            title: 'AR Artwork Viewer',
            description: 'Augmented reality viewer to visualize artwork in your space before purchase or exhibition.',
            icon: <Camera className="h-6 w-6" />,
            status: 'beta',
            estimatedDate: 'Q1 2025'
        },
        {
            id: 'nft-integration',
            title: 'NFT Integration',
            description: 'Seamless integration with NFT marketplaces and digital art platforms for hybrid collections.',
            icon: <Globe className="h-6 w-6" />,
            status: 'coming-soon',
            estimatedDate: 'Q2 2025'
        },
        {
            id: 'advanced-analytics',
            title: 'Advanced Analytics',
            description: 'Comprehensive analytics dashboard for tracking artwork performance, market trends, and collection insights.',
            icon: <Zap className="h-6 w-6" />,
            status: 'coming-soon',
            estimatedDate: 'Q3 2025'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'coming-soon':
                return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600';
            case 'in-development':
                return 'bg-gray-200 text-gray-900 border-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500';
            case 'beta':
                return 'bg-black text-white border-gray-400 dark:bg-white dark:text-black dark:border-gray-500';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'coming-soon':
                return 'Coming Soon';
            case 'in-development':
                return 'In Development';
            case 'beta':
                return 'Beta Access';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
            <div className="container mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Clock className="h-4 w-4" />
                        Exciting Features Coming Soon
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        The Future of
                        <span className="text-gray-600 dark:text-gray-300 ml-3">
                            Art Management
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        We&apos;re building the next generation of tools for artists, collectors, and galleries.
                        Here&apos;s what&apos;s coming to revolutionize how you manage, authenticate, and showcase art.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <Card
                            key={feature.id}
                            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-black group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`${getStatusColor(feature.status)} border`}
                                    >
                                        {getStatusText(feature.status)}
                                    </Badge>
                                </div>

                                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    {feature.description}
                                </CardDescription>

                                {feature.estimatedDate && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Clock className="h-4 w-4" />
                                        <span>Expected: {feature.estimatedDate}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <Card className="max-w-2xl mx-auto bg-gray-900 dark:bg-white text-white dark:text-black border-0">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-bold mb-4">
                                Stay Updated on New Features
                            </h3>
                            <p className="text-gray-300 dark:text-gray-600 mb-6">
                                Be the first to know when these exciting features are released.
                                Join our community of early adopters and help shape the future of art management.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                                    Get Early Access
                                </button>
                                <button className="border border-gray-300 dark:border-gray-600 text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300">
                                    Join Newsletter
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Indicator */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full border">
                        <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Development in Progress
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
