'use client';
import React from 'react';

const AboutAetherLabs: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            {/* Header with subtle animation */}
            <div className="mb-20 space-y-4">
                <h1 className="text-5xl font-semibold mb-4 relative">
                    About AetherLabs
                    <span className="absolute -bottom-2 left-0 w-24 h-1 bg-indigo-600/50 transform origin-left transition-all duration-300 hover:w-32"></span>
                </h1>
                <p className="text-xl font-light max-w-2xl">
                    Redefining art authentication through innovative technology and unwavering commitment to creativity.
                </p>
            </div>

            {/* Mission with highlight box */}
            <section className="mb-20 p-8 rounded-2xl border border-indigo-600/10 backdrop-blur-sm relative">
                <div className="absolute -top-3 left-8 px-4 py-1 bg-indigo-600/5 rounded-full text-sm font-medium text-indigo-600">
                    Our Mission
                </div>
                <p className="text-lg leading-relaxed">
                    At AetherLabs, we are redefining the way art is authenticated and experienced. Our mission is to bring authenticity to creativity by leveraging cutting-edge technology to safeguard the integrity of artworks.
                </p>
            </section>

            {/* Vision & Technology Grid */}
            <div className="grid md:grid-cols-2 gap-16 mb-20">
                {/* Vision */}
                <section className="group">
                    <h2 className="text-2xl font-medium mb-6 text-indigo-600 flex items-center space-x-2">
                        <span className="w-6 h-px bg-indigo-600 transform transition-all duration-300 group-hover:w-10"></span>
                        <span>Vision</span>
                    </h2>
                    <p className="leading-relaxed">
                        To create a future where artists, collectors, and art enthusiasts can trust and celebrate the authenticity of every creation, fostering a global community united by genuine art.
                    </p>
                </section>

                {/* Technology */}
                <section className="group">
                    <h2 className="text-2xl font-medium mb-6 text-indigo-600 flex items-center space-x-2">
                        <span className="w-6 h-px bg-indigo-600 transform transition-all duration-300 group-hover:w-10"></span>
                        <span>Technology</span>
                    </h2>
                    <ul className="space-y-4">
                        {['Seamless Authentication', 'Detailed Provenance', 'Secure Digital Certificates'].map((item, index) => (
                            <li key={index} className="flex items-center space-x-3 group/item">
                                <span className="w-2 h-2 rounded-full bg-indigo-600 transform transition-all duration-300 group-hover/item:w-3"></span>
                                <span className="leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* Features */}
            <section className="mb-20">
                <h2 className="text-2xl font-medium mb-8 text-indigo-600">Why AetherLabs?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Efficiency', desc: 'Instant verification anytime, anywhere.' },
                        { title: 'Security', desc: 'Robust systems to prevent counterfeiting.' },
                        { title: 'Sustainability', desc: 'A paperless solution for modern needs.' }
                    ].map((feature, index) => (
                        <div key={index}
                            className="group p-6 rounded-xl border border-indigo-600/10 hover:border-indigo-600/30 
                                      transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]">
                            <h3 className="font-medium mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed opacity-80">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Join Us */}
            <section className="border-t border-indigo-600/10 pt-20">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <h2 className="text-2xl font-medium text-indigo-600">Join Us</h2>
                    <p className="leading-relaxed">
                        Whether you&apos;re an artist looking to protect your work, a collector seeking peace of mind, or a gallery aiming to innovate, AetherLabs is here to support your journey.
                    </p>
                    <button className="px-8 py-2.5 border-2 border-indigo-600 rounded-lg 
                                     hover:bg-indigo-600 hover:text-white
                                     transition-all duration-300 ease-in-out
                                     transform hover:-translate-y-0.5">
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AboutAetherLabs;