import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
    const faqs = [
        {
            question: "What happens if the NFC tag is damaged or removed?",
            answer: "Your artwork's secure digital certificate remains permanently stored in our tamper-proof digital records regardless of the physical tag. We can send replacement tags that link to the same certificate. The permanent cloud storage includes tag replacement history for complete transparency."
        },
        {
            question: "Do buyers need an app to verify authenticity?",
            answer: "No! Any smartphone with NFC capability (most phones made after 2018) can tap the tag and instantly view the certificate through their web browser. No downloads, no accounts, no friction."
        },
        {
            question: "Can I transfer ownership when I sell my artwork?",
            answer: "Absolutely. Ownership transfers are built into the system. You can transfer via email invitation, and the new owner gets full access while the complete provenance history remains visible in our permanent cloud storage."
        },
        {
            question: "Is my artwork information private?",
            answer: "You control what's public. Artist name, title, and authenticity are visible to anyone who scans the tag. Private details like purchase price, owner information, and high-res images remain encrypted and visible only to authorized parties."
        },
        {
            question: "What file formats do you accept?",
            answer: "We accept JPG, PNG, TIFF, and HEIC files up to 50MB each. For 3D art or sculptures, you can upload multiple angles. We automatically optimize images while preserving quality for verification purposes."
        },
        {
            question: "When will AetherLabs launch?",
            answer: "We're planning Early Access in 2026. Waitlist members will get early access before public launch, plus early access pricing. Be among the first to join!"
        },
        {
            question: "What if I have more questions?",
            answer: "Email us at hello@aetherlabs.com. We respond to every message within 24 hours and would love to hear from you!"
        }
    ];

    return (
        <section className="w-full py-20 px-6 md:px-12 bg-white">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="font-playfair text-3xl md:text-4xl font-medium tracking-tight text-aether-dark">
                        Frequently Asked Questions
                    </h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-aether-gray/30">
                            <AccordionTrigger className="text-left text-lg font-libre font-medium text-aether-dark hover:text-aether-gold">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="font-cormorant text-lg text-aether-gray leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default FAQ;
