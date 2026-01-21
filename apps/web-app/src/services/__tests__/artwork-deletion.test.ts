import { ArtworkService } from '../artwork-service'

// Mock Supabase client
jest.mock('@/src/lib/supabase', () => ({
    createClient: () => ({
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { user: { id: 'test-user-id' } }
            })
        },
        from: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
                data: { image_url: 'https://example.com/test-image.jpg' }
            }),
            delete: jest.fn().mockReturnThis(),
            storage: {
                from: jest.fn().mockReturnValue({
                    remove: jest.fn().mockResolvedValue({})
                })
            }
        })
    })
}))

describe('ArtworkService.deleteArtwork', () => {
    it('should delete artwork and related data', async () => {
        const mockSupabase = require('@/src/lib/supabase').createClient()

        await ArtworkService.deleteArtwork('test-artwork-id')

        // Verify that the artwork was queried for image_url
        expect(mockSupabase.from).toHaveBeenCalledWith('artworks')
        expect(mockSupabase.from().select).toHaveBeenCalledWith('image_url')
        expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'test-artwork-id')
        expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'test-user-id')

        // Verify that the artwork was deleted
        expect(mockSupabase.from().delete).toHaveBeenCalled()
    })

    it('should handle deletion without image gracefully', async () => {
        const mockSupabase = require('@/src/lib/supabase').createClient()
        mockSupabase.from().single.mockResolvedValueOnce({
            data: { image_url: null }
        })

        await ArtworkService.deleteArtwork('test-artwork-id')

        // Should not attempt to delete from storage
        expect(mockSupabase.storage.from().remove).not.toHaveBeenCalled()
    })

    it('should handle storage deletion errors gracefully', async () => {
        const mockSupabase = require('@/src/lib/supabase').createClient()
        mockSupabase.storage.from().remove.mockRejectedValueOnce(new Error('Storage error'))

        // Should not throw an error even if storage deletion fails
        await expect(ArtworkService.deleteArtwork('test-artwork-id')).resolves.not.toThrow()
    })
})
