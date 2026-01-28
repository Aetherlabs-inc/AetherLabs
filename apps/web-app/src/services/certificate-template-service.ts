import { createClient } from '@/src/lib/supabase'
import { CertificateTemplate, CertificateTemplateConfig } from '@/src/types/database'

const supabase = createClient()

// Default config matching COACertificateElegant
export const defaultCertificateConfig: CertificateTemplateConfig = {
    colors: {
        background: '#e8e4dc',
        text: '#3d3a35',
        accent: '#6b665c',
        border: '#c4bfb5',
    },
    font: 'playfair',
    show_qr: true,
    show_seal: true,
    background_blur: 4,
    invert_background: true,
    background_opacity: 90,
}

export class CertificateTemplateService {
    /**
     * Get all templates for a user
     */
    static async getTemplates(): Promise<CertificateTemplate[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('certificate_templates')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    }

    /**
     * Get a single template by ID
     */
    static async getTemplate(id: string): Promise<CertificateTemplate | null> {
        const { data, error } = await supabase
            .from('certificate_templates')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }
        return data
    }

    /**
     * Create a new template
     */
    static async createTemplate(data: {
        name: string
        config: CertificateTemplateConfig
        is_default?: boolean
    }): Promise<CertificateTemplate> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        // If this template is default, unset other defaults
        if (data.is_default) {
            await supabase
                .from('certificate_templates')
                .update({ is_default: false })
                .eq('user_id', user.id)
        }

        const { data: template, error } = await supabase
            .from('certificate_templates')
            .insert({
                user_id: user.id,
                name: data.name,
                config: data.config,
                is_default: data.is_default || false,
            })
            .select()
            .single()

        if (error) throw error
        return template
    }

    /**
     * Update a template
     */
    static async updateTemplate(
        id: string,
        data: Partial<{
            name: string
            config: CertificateTemplateConfig
            is_default: boolean
        }>
    ): Promise<CertificateTemplate> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        // If setting as default, unset other defaults first
        if (data.is_default) {
            await supabase
                .from('certificate_templates')
                .update({ is_default: false })
                .eq('user_id', user.id)
                .neq('id', id)
        }

        const { data: template, error } = await supabase
            .from('certificate_templates')
            .update(data)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return template
    }

    /**
     * Delete a template
     */
    static async deleteTemplate(id: string): Promise<void> {
        const { error } = await supabase
            .from('certificate_templates')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    /**
     * Set a template as the default
     */
    static async setDefaultTemplate(templateId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        // Unset all defaults for this user
        await supabase
            .from('certificate_templates')
            .update({ is_default: false })
            .eq('user_id', user.id)

        // Set the new default
        const { error } = await supabase
            .from('certificate_templates')
            .update({ is_default: true })
            .eq('id', templateId)

        if (error) throw error
    }

    /**
     * Get the user's default template
     */
    static async getDefaultTemplate(): Promise<CertificateTemplate | null> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('certificate_templates')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_default', true)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }
        return data
    }

    /**
     * Duplicate an existing template
     */
    static async duplicateTemplate(id: string, newName?: string): Promise<CertificateTemplate> {
        const original = await this.getTemplate(id)
        if (!original) throw new Error('Template not found')

        return this.createTemplate({
            name: newName || `${original.name} (Copy)`,
            config: original.config as CertificateTemplateConfig,
            is_default: false,
        })
    }

    /**
     * Get default config for a new template
     */
    static getDefaultConfig(): CertificateTemplateConfig {
        return defaultCertificateConfig
    }
}
