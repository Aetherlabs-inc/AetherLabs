/**
 * Utility functions for handling artist/creator information
 */

/**
 * Get display name for an artist, preferring full name over email
 * @param artistName - The artist name from the database
 * @param userEmail - The user's email as fallback
 * @returns A formatted display name
 */
export function getArtistDisplayName(artistName: string, userEmail?: string): string {
    // If the artist name is an email, extract the name part
    if (artistName.includes('@')) {
        const emailName = artistName.split('@')[0]
        // Convert email-style names to proper case
        return emailName
            .split('.')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ')
    }

    // If we have a proper name, return it
    if (artistName && artistName !== 'Unknown Artist') {
        return artistName
    }

    // Fallback to email name if available
    if (userEmail) {
        const emailName = userEmail.split('@')[0]
        return emailName
            .split('.')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ')
    }

    return 'Unknown Artist'
}

/**
 * Check if an artist name is likely an email address
 * @param name - The name to check
 * @returns True if the name contains an email pattern
 */
export function isEmailName(name: string): boolean {
    return name.includes('@')
}

/**
 * Format artist name for display with proper capitalization
 * @param name - The raw artist name
 * @returns Formatted name
 */
export function formatArtistName(name: string): string {
    if (!name || name === 'Unknown Artist') {
        return 'Unknown Artist'
    }

    // If it's an email, extract the name part
    if (name.includes('@')) {
        const emailName = name.split('@')[0]
        return emailName
            .split('.')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ')
    }

    // For regular names, just ensure proper capitalization
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}
