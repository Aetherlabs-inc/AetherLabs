'use client'

import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';

const WaitlistSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email) {
            toast({
                title: "Email required",
                description: "Please enter your email address.",
                variant: "destructive",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/waitlist/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name || null,
                    role: formData.role || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to join waitlist');
            }

            setIsSubmitted(true);
            toast({
                title: "Welcome to AetherLabs! 🎉",
                description: "You're on the list. We'll be in touch soon.",
            });

        } catch (error) {
            console.error('Error submitting waitlist:', error);
            toast({
                title: "Something went wrong",
                description: error instanceof Error ? error.message : "Failed to join waitlist. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="waitlist" className="w-full py-20 md:py-28 px-6 md:px-12 bg-white">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl border border-aether-gray/10 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-aether-dark to-aether-dark/90 px-8 py-10 text-center">
                        <p className="font-playfair text-2xl md:text-3xl text-white leading-relaxed font-medium mb-3">
                            This is the future we are building.
                        </p>
                        <p className="font-cormorant text-xl text-aether-gold">
                            We would love you to be part of it.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-10">
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="font-libre text-sm text-aether-dark block mb-2"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-aether-gray/30 rounded-xl
                                                     font-cormorant text-lg text-aether-dark
                                                     focus:outline-none focus:border-aether-gold focus:ring-2 focus:ring-aether-gold/20
                                                     transition-all bg-white"
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="font-libre text-sm text-aether-dark block mb-2"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-aether-gray/30 rounded-xl
                                                     font-cormorant text-lg text-aether-dark
                                                     focus:outline-none focus:border-aether-gold focus:ring-2 focus:ring-aether-gold/20
                                                     transition-all bg-white"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="role"
                                        className="font-libre text-sm text-aether-dark block mb-2"
                                    >
                                        I am a...
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-aether-gray/30 rounded-xl
                                                 font-cormorant text-lg text-aether-dark
                                                 focus:outline-none focus:border-aether-gold focus:ring-2 focus:ring-aether-gold/20
                                                 transition-all bg-white cursor-pointer appearance-none"
                                        required
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232A2121' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 16px center'
                                        }}
                                    >
                                        <option value="">Select your role</option>
                                        <option value="artist">Artist</option>
                                        <option value="gallery">Gallery</option>
                                        <option value="dealer">Dealer</option>
                                        <option value="collector">Collector</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-aether-gold text-white font-libre text-base font-medium
                                             rounded-xl hover:bg-aether-dark transition-colors duration-300
                                             shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed
                                             mt-4"
                                >
                                    {isSubmitting ? 'Joining...' : 'Join the waitlist'}
                                </button>

                                <p className="font-cormorant text-sm text-aether-gray text-center mt-4">
                                    Early access members get priority onboarding and special pricing.
                                </p>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-aether-gold/20 
                                              flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-aether-gold" />
                                </div>
                                <p className="font-playfair text-2xl text-aether-dark mb-3">
                                    Welcome to the future.
                                </p>
                                <p className="font-cormorant text-xl text-aether-gray">
                                    We will be in touch shortly.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WaitlistSection;