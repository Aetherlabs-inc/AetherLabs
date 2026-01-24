'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, Button } from '@aetherlabs/ui'
import { FolderOpen, Layers, Share2, Tag, Bell } from 'lucide-react'

const features = [
  {
    icon: Layers,
    title: 'Organize by Series',
    description: 'Group related artworks into collections and series for better organization.',
  },
  {
    icon: Share2,
    title: 'Share Collections',
    description: 'Share curated collections with galleries, collectors, or the public.',
  },
  {
    icon: Tag,
    title: 'Custom Tags',
    description: 'Add custom tags and metadata to organize your work your way.',
  },
]

export default function CollectionsComingSoon() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Collections</h1>
          <p className="text-muted-foreground mt-1">
            Organize your artworks into curated collections
          </p>
        </div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-dashed border-[#BC8010]/30 bg-[#BC8010]/5">
            <CardContent className="py-12">
              <div className="text-center max-w-md mx-auto">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#BC8010]/10 flex items-center justify-center">
                    <FolderOpen className="w-10 h-10 text-[#BC8010]" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#2A2121] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Collections Coming Soon
                </h2>
                <p className="text-muted-foreground mb-6">
                  We&apos;re working on a powerful way to organize your artworks into collections.
                  Get notified when this feature launches.
                </p>

                <Button
                  className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me When Ready
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Preview */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            What&apos;s Coming
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              >
                <Card className="h-full border border-border bg-card hover:border-[#BC8010]/20 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <h4 className="font-medium text-foreground mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preview Mockup */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border border-border bg-muted/30 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-muted" />
                  <div>
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-20 bg-muted rounded mt-1" />
                  </div>
                </div>
                <div className="h-8 w-20 bg-muted rounded" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg" />
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-t from-background via-background/80 to-transparent h-16 -mt-16 relative z-10" />
          </Card>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Preview of collection view
          </p>
        </motion.div>
      </div>
    </div>
  )
}
