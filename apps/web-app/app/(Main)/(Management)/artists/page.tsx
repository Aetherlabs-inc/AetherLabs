import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Artists Management",
    description: "Manage artists in your AetherLabs account. View and manage artist profiles, artworks, and authentication records.",
    robots: {
        index: false,
        follow: false,
    },
};

const ArtistsPage: React.FC = () => {
    const dummyArtists = [
        { id: 1, name: 'Artist One', genre: 'Rock' },
        { id: 2, name: 'Artist Two', genre: 'Pop' },
        { id: 3, name: 'Artist Three', genre: 'Jazz' },
    ];

    return (
        <div>
            <h1>Artists Management</h1>
            <ul>
                {dummyArtists.map(artist => (
                    <li key={artist.id}>
                        {artist.name} - {artist.genre}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArtistsPage;