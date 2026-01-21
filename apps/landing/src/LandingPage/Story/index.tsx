"use client";

import React, { useState, useEffect, useRef } from 'react';

// Tooltip component for technical terms
interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="border-b border-dotted border-current cursor-help">
        {children}
      </span>
      {isVisible && (
        <span 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 
                     bg-aether-dark text-white text-sm rounded-lg shadow-lg
                     min-w-[250px] max-w-[300px] text-center z-50
                     font-libre leading-relaxed"
          style={{ 
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 
                          border-8 border-transparent border-t-aether-dark" />
        </span>
      )}
    </span>
  );
};

// Animated element that fades in on scroll
interface FadeInElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  group?: boolean;
}

const FadeInElement = ({ children, delay = 0, className = '', group = false }: FadeInElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {children}
    </div>
  );
};

// User group card component
interface UserGroupCardProps {
  title: string;
  line1: string;
  line2: string;
  color: string;
  delay: number;
}

const UserGroupCard = ({ title, line1, line2, color, delay }: UserGroupCardProps) => (
  <FadeInElement delay={delay} className="mb-8">
    <div 
      className="pl-6 py-2"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <h3 
        className="font-libre text-xl mb-2"
        style={{ color }}
      >
        {title}
      </h3>
      <p className="font-cormorant text-xl text-aether-dark leading-relaxed">
        {line1}
      </p>
      <p className="font-cormorant text-xl text-aether-dark leading-relaxed">
        {line2}
      </p>
    </div>
  </FadeInElement>
);

const Story = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
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
    } catch (error) {
      console.error('Error submitting waitlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
    return (
    <div className="min-h-screen bg-white">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-libre { font-family: 'Libre Baskerville', serif; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        ::selection {
          background: #BC8010;
          color: white;
        }
      `}</style>
      
      <div className="max-w-3xl mx-auto px-6 py-24">
        
        {/* ============================================ */}
        {/* SECTION 1: THE PROBLEM                      */}
        {/* ============================================ */}
        
        <section className="mb-40">
          <FadeInElement delay={0}>
            <p className="font-cormorant text-3xl text-aether-dark leading-relaxed mb-8">
              Every piece of art carries a story.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={150}>
            <p className="font-cormorant text-2xl text-aether-gray leading-relaxed mb-8">
              Who made it. Who owned it. Where it&apos;s been.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={300}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-8">
              This story is what makes art real. It&apos;s proof that what you&apos;re holding is authentic.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={450}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-12">
              In the art world, this is called{' '}
              <Tooltip content="The documented history of an artwork — who created it, who owned it, and how it changed hands over time.">
                <span className="text-aether-gold font-medium">provenance</span>
              </Tooltip>
              {' '}— the chain of ownership that follows a piece through time.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={600}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-8">
              For over a century, we&apos;ve trusted paper certificates to carry that proof. A signature. A stamp. A promise.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={750}>
            <p className="font-playfair text-2xl text-aether-terracotta leading-relaxed mb-8 italic">
              But paper fades.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={900}>
            <p className="font-cormorant text-2xl text-aether-terracotta leading-relaxed mb-8">
              Papers get lost in moves, floods, forgotten boxes.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1050}>
            <p className="font-cormorant text-2xl text-aether-terracotta leading-relaxed mb-8">
              Signatures can be copied. Stamps can be forged.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1200}>
            <p className="font-cormorant text-2xl text-aether-terracotta leading-relaxed mb-12">
              And every year, forgeries slip through. Fakes get sold. Trust breaks.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1350}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-8">
              When the proof disappears, the story disappears with it.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1500}>
            <p className="font-cormorant text-2xl text-aether-gray leading-relaxed mb-8">
              The art is still beautiful. But something is missing.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1650}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-12">
              Its identity. Its history. Its value.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1800}>
            <p className="font-playfair text-3xl text-aether-dark leading-relaxed font-medium">
              Your legacy deserves better than a piece of paper.
            </p>
          </FadeInElement>
        </section>
        
        {/* ============================================ */}
        {/* SECTION 2: THE SOLUTION                     */}
        {/* ============================================ */}
        
        <section className="mb-40">
          <FadeInElement delay={0}>
            <p className="font-playfair text-3xl text-aether-gold leading-relaxed mb-12 italic">
              There&apos;s a better way.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={150}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-8">
              We built AetherLabs to protect what paper can&apos;t.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={300}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-12">
              A digital{' '}
              <Tooltip content="A document that confirms an artwork is genuine, usually signed by the artist or an authority.">
                <span className="text-aether-gold font-medium">certificate of authenticity</span>
              </Tooltip>
              {' '}that lives with your art. Not in a drawer. Not in a folder. With the piece itself.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={450}>
            <p className="font-playfair text-xl text-aether-gray leading-relaxed mb-8">
              Here&apos;s how it works.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={600}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-8">
              Every artwork gets a small{' '}
              <Tooltip content="Near Field Communication. A technology that lets devices share information with a simple tap.">
                <span className="text-aether-gold font-medium">NFC</span>
              </Tooltip>
              {' '}tag. A tap from any smartphone reveals everything — the artist, the history, the proof.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={750}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-8">
              No app to download. No account to create. Just tap and verify.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={900}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-16">
              The record is{' '}
              <Tooltip content="Protected using advanced math that makes the data nearly impossible to fake or alter.">
                <span className="text-aether-gold font-medium">cryptographically secured</span>
              </Tooltip>
              . It can&apos;t be forged. It can&apos;t be lost. It stays with the art, always.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1050}>
            <p className="font-playfair text-xl text-aether-gray leading-relaxed mb-10">
              Built for everyone in the art world:
            </p>
          </FadeInElement>
          
          {/* User Groups */}
          <div className="mb-16">
            <UserGroupCard 
              title="Artists"
              line1="You pour yourself into your work."
              line2="Protect it, build your portfolio, and follow your pieces wherever they go."
              color="#BC8010"
              delay={1200}
            />
            
            <UserGroupCard 
              title="Galleries"
              line1="Trust is your currency."
              line2="Authenticate every sale and show collectors the proof they need."
              color="#BC8010"
              delay={1350}
            />
            
            <UserGroupCard 
              title="Dealers"
              line1="One bad piece can cost everything."
              line2="Verify before you buy. Complete history. No surprises."
              color="#CA5B2B"
              delay={1500}
            />
            
            <UserGroupCard 
              title="Collectors"
              line1="Your collection tells a story."
              line2="Own it with proof. Every piece verified, every history preserved."
              color="#BC8010"
              delay={1650}
            />
          </div>
          
          <FadeInElement delay={1800}>
            <p className="font-playfair text-3xl text-aether-dark leading-relaxed font-medium">
              Your art&apos;s story, preserved. Permanently.
            </p>
          </FadeInElement>
        </section>
        
        {/* ============================================ */}
        {/* SECTION 3: THE VISION                       */}
        {/* ============================================ */}
        
        <section className="mb-32">
          <FadeInElement delay={0}>
            <p className="font-playfair text-2xl text-aether-gold leading-relaxed mb-12 italic">
              But we didn&apos;t stop at certificates.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={150}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-8">
              Authentication is just the beginning.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={300}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-8">
              Art doesn&apos;t exist in isolation. It moves between hands, across borders, through generations. It connects people.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={450}>
            <p className="font-cormorant text-2xl text-aether-dark leading-relaxed mb-12">
              We&apos;re building a place where those connections happen.
            </p>
          </FadeInElement>
          
          {/* Connection statements - group fade */}
          <FadeInElement delay={600} className="mb-12">
            <div className="space-y-4 pl-6 border-l-2 border-aether-gray">
              <p className="font-cormorant text-xl text-aether-dark leading-relaxed">
                Artists discover galleries that believe in their work.
              </p>
              <p className="font-cormorant text-xl text-aether-dark leading-relaxed">
                Collectors find emerging talent before the world catches on.
              </p>
              <p className="font-cormorant text-xl text-aether-dark leading-relaxed">
                Dealers transact with confidence, knowing every piece is real.
              </p>
              <p className="font-cormorant text-xl text-aether-dark leading-relaxed">
                Galleries build relationships that last beyond a single sale.
              </p>
            </div>
          </FadeInElement>
          
          <FadeInElement delay={750}>
            <p className="font-cormorant text-2xl text-aether-gold leading-relaxed mb-16">
              Everyone linked. Everyone trusted.
            </p>
          </FadeInElement>
          
          {/* Poetic ending */}
          <FadeInElement delay={900}>
            <p className="font-playfair text-2xl text-aether-dark leading-relaxed mb-6 italic">
              Imagine an art world where proof is built in.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1050}>
            <p className="font-playfair text-2xl text-aether-dark leading-relaxed mb-6 italic">
              Where every piece carries its story, wherever it goes.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1200}>
            <p className="font-playfair text-2xl text-aether-dark leading-relaxed mb-12 italic">
              Where connection replaces doubt. And trust is the foundation.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1350}>
            <p className="font-playfair text-3xl text-aether-dark leading-relaxed font-medium mb-4">
              This is the future we&apos;re building.
            </p>
          </FadeInElement>
          
          <FadeInElement delay={1500}>
            <p className="font-cormorant text-2xl text-aether-gold leading-relaxed mb-16">
              We&apos;d love you to be part of it.
            </p>
          </FadeInElement>
        </section>
        
        {/* ============================================ */}
        {/* WAITLIST FORM                               */}
        {/* ============================================ */}
        
        <FadeInElement delay={1650}>
          <section className="max-w-md mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="font-libre text-sm text-aether-dark block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-aether-gray rounded-lg
                               font-cormorant text-lg text-aether-dark
                               focus:outline-none focus:border-aether-gold transition-colors"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="font-libre text-sm text-aether-dark block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-aether-gray rounded-lg
                               font-cormorant text-lg text-aether-dark
                               focus:outline-none focus:border-aether-gold transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="font-libre text-sm text-aether-dark block mb-2">
                      I am a...
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-3 border border-aether-gray rounded-lg
                               font-cormorant text-lg text-aether-dark
                               focus:outline-none focus:border-aether-gold transition-colors
                               bg-white cursor-pointer"
                      required
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
                    className="w-full py-4 bg-aether-dark text-white font-libre text-base
                             rounded-lg hover:bg-aether-gold transition-colors duration-300
                             mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Joining...' : 'Join the waitlist'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <p className="font-playfair text-2xl text-aether-gold mb-4">
                  Welcome to the future.
                </p>
                <p className="font-cormorant text-xl text-aether-dark">
                  We&apos;ll be in touch soon.
                </p>
            </div>
            )}
          </section>
        </FadeInElement>
        
        {/* Footer spacer */}
        <div className="h-24"></div>
        
      </div>
    </div>
    );
};

export default Story;
