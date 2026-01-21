import React from "react";
import { Printer, Clock, Globe } from 'lucide-react';

const Problem = () => {
    const problems = [
        {
            icon: <Printer size={40} className="text-aether-gold" />,
            title: "Forgery is Embarrassingly Easy",
            description:
                "A decent printer. Some fancy paper. A fake signature. Congratulations—someone just &apos;authenticated&apos; a counterfeit of your work. And buyers can&apos;t tell the difference.",
        },
        {
            icon: <Clock size={40} className="text-aether-terracotta" />,
            title: "Time Destroys Everything",
            description:
                "Paper yellows. Ink fades. Storage floods. In 20 years, how will collectors prove they own the real thing? They won't.",
        },
        {
            icon: <Globe size={40} className="text-aether-gold" />,
            title: "Lost in Translation",
            description:
                "Your art travels the world, but documentation doesn't. After decades of sales and transfers, the paper trail goes cold, and your artwork's legitimacy dies with it.",
        },
    ];

    return (
        <section className="w-full py-24 px-6 md:px-12 bg-white">
            <div className="max-w-6xl mx-auto space-y-16">
                {/* Header Section */}
                <div>
                    <span className="inline-block text-sm font-libre tracking-wide uppercase text-aether-gray px-3 py-1">
                        The Problem
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start py-4">
                        <div className="space-y-3 w-2/3">
                            <h2 className="font-playfair text-3xl md:text-4xl font-medium tracking-tight text-aether-dark">
                                Your Art Deserves Better Than a Piece of Paper
                            </h2>
                        </div>
                        <p className="font-cormorant text-xl text-aether-gray leading-relaxed">
                            You poured your soul into your work. Meanwhile, counterfeiters are printing fake
                            certificates on their home printers. It&apos;s 2025. Why are we still authenticating
                            million-dollar art with technology from 1825?
                        </p>
                    </div>
                </div>

                {/* Problem List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {problems.map((problem, index) => (
                        <div
                            key={index}
                            className="flex flex-col space-y-4 bg-white p-8 rounded-2xl border border-aether-gray/30 hover:border-aether-gold/50 transition-all duration-300"
                        >
                            <div className="text-4xl">{problem.icon}</div>
                            <h3 className="font-libre text-xl font-medium text-aether-dark">{problem.title}</h3>
                            <p className="font-cormorant text-lg text-aether-dark leading-relaxed">{problem.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Problem;
