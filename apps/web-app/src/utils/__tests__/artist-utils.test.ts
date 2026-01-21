import { formatArtistName, getArtistDisplayName, isEmailName } from '../artist-utils'

describe('Artist Utils', () => {
    describe('formatArtistName', () => {
        it('should format regular names properly', () => {
            expect(formatArtistName('john doe')).toBe('John Doe')
            expect(formatArtistName('JANE SMITH')).toBe('Jane Smith')
            expect(formatArtistName('michael van der berg')).toBe('Michael Van Der Berg')
        })

        it('should handle email addresses', () => {
            expect(formatArtistName('john.doe@example.com')).toBe('John Doe')
            expect(formatArtistName('jane.smith@company.co.uk')).toBe('Jane Smith')
            expect(formatArtistName('michael.van.der.berg@art.com')).toBe('Michael Van Der Berg')
        })

        it('should handle unknown artist', () => {
            expect(formatArtistName('Unknown Artist')).toBe('Unknown Artist')
            expect(formatArtistName('')).toBe('Unknown Artist')
        })
    })

    describe('getArtistDisplayName', () => {
        it('should prefer full name over email', () => {
            expect(getArtistDisplayName('John Doe', 'john@example.com')).toBe('John Doe')
        })

        it('should format email names when no full name', () => {
            expect(getArtistDisplayName('john.doe@example.com', 'john@example.com')).toBe('John Doe')
        })

        it('should use email fallback', () => {
            expect(getArtistDisplayName('Unknown Artist', 'john.doe@example.com')).toBe('John Doe')
        })
    })

    describe('isEmailName', () => {
        it('should detect email addresses', () => {
            expect(isEmailName('john@example.com')).toBe(true)
            expect(isEmailName('jane.smith@company.co.uk')).toBe(true)
        })

        it('should not detect regular names as emails', () => {
            expect(isEmailName('John Doe')).toBe(false)
            expect(isEmailName('Jane Smith')).toBe(false)
            expect(isEmailName('Unknown Artist')).toBe(false)
        })
    })
})
