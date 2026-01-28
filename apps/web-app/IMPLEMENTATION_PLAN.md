# AetherLabs Web-App Feature Implementation Plan

## Status Overview - ALL COMPLETE

### Completed
- [x] Add new types to database.ts (Collections, Documentation, Transfers, Templates)
- [x] Create collection-service.ts
- [x] Build Collections.tsx main page
- [x] Build CollectionCard and CollectionForm components
- [x] Build CollectionDetail.tsx with artwork grid
- [x] Create documentation-service.ts
- [x] Build DocumentationTabs and provenance components
- [x] Create transfer-service.ts
- [x] Build transfer flow components
- [x] Create certificate-template-service.ts
- [x] Build CertificateDesigner with controls
- [x] Add Dialog and Tabs components to @aetherlabs/ui

---

## Features Built

1. **Artwork Documentation** - Provenance, exhibitions, conservation notes
2. **Change of Ownership** - Transfer with multi-party verification
3. **Certificate Design Space** - Full customization (colors, fonts, logo, backgrounds)
4. **Collections** - Organize artworks into shareable collections

---

## Files Created

### Services
- `apps/web-app/src/services/collection-service.ts`
- `apps/web-app/src/services/documentation-service.ts`
- `apps/web-app/src/services/transfer-service.ts`
- `apps/web-app/src/services/certificate-template-service.ts`

### Collections Feature
- `apps/web-app/src/features/collections/Collections.tsx`
- `apps/web-app/src/features/collections/CollectionForm.tsx`
- `apps/web-app/src/features/collections/CollectionDetail.tsx`
- `apps/web-app/src/features/collections/index.ts`

### Documentation Feature
- `apps/web-app/src/features/artworks/documentation/DocumentationTabs.tsx`
- `apps/web-app/src/features/artworks/documentation/ProvenanceTimeline.tsx`
- `apps/web-app/src/features/artworks/documentation/ProvenanceForm.tsx`
- `apps/web-app/src/features/artworks/documentation/ExhibitionList.tsx`
- `apps/web-app/src/features/artworks/documentation/ExhibitionForm.tsx`
- `apps/web-app/src/features/artworks/documentation/ConservationList.tsx`
- `apps/web-app/src/features/artworks/documentation/ConservationForm.tsx`
- `apps/web-app/src/features/artworks/documentation/index.ts`

### Transfers Feature
- `apps/web-app/src/features/transfers/PendingTransfers.tsx`
- `apps/web-app/src/features/transfers/TransferInitiateModal.tsx`
- `apps/web-app/src/features/transfers/TransferStatusCard.tsx`
- `apps/web-app/src/features/transfers/index.ts`

### Certificate Designer Feature
- `apps/web-app/src/features/certificates/designer/CertificateDesigner.tsx`
- `apps/web-app/src/features/certificates/designer/DesignerControls.tsx`
- `apps/web-app/src/features/certificates/designer/ColorPicker.tsx`
- `apps/web-app/src/features/certificates/designer/FontSelector.tsx`
- `apps/web-app/src/features/certificates/designer/LayoutSelector.tsx`
- `apps/web-app/src/features/certificates/designer/TemplateList.tsx`
- `apps/web-app/src/features/certificates/designer/LivePreview.tsx`
- `apps/web-app/src/features/certificates/designer/index.ts`

### Routes
- `apps/web-app/app/(Main)/collections/page.tsx`
- `apps/web-app/app/(Main)/transfers/page.tsx`
- `apps/web-app/app/(Main)/certificates/designer/page.tsx`

### Shared UI Components
- `packages/ui/src/primitives/dialog.tsx`
- `packages/ui/src/primitives/tabs.tsx`

### Types
- `apps/web-app/src/types/database.ts` (updated with new types)

---

## Database Tables Required

Run the migration in `packages/supabase/SQL/features-migration.sql`:

- `collection_artworks` - Junction table for collections
- `provenance_records` - Ownership history
- `exhibition_records` - Exhibition history
- `conservation_records` - Conservation notes
- `ownership_transfers` - Transfer workflow
- `certificate_templates` - Saved certificate designs

---

## Integration Points (Optional Future Work)

These are integrations that can be done to connect the features to existing pages:

1. **ArtworkDetails.tsx** - Add buttons for:
   - "Transfer Ownership" - Opens TransferInitiateModal
   - "Add to Collection" - Opens collection picker
   - Documentation tabs - Shows provenance/exhibition/conservation

2. **COAGenerationScreen.tsx** - Add template selection dropdown

3. **app-sidebar.tsx** - Add nav items for:
   - Transfers page
   - Certificate Designer

4. **Dashboard** - Add pending transfers widget

---

## Key Files Reference

### Types
All type definitions are in: `apps/web-app/src/types/database.ts`

Key types added:
- `Collection`, `CollectionWithArtworks`, `CollectionVisibility`
- `ProvenanceRecord`, `ExhibitionRecord`, `ConservationRecord`
- `OwnershipTransfer`, `TransferStatus`
- `CertificateTemplate`, `CertificateTemplateConfig`, `CertificateLayout`, `CertificateSealStyle`
