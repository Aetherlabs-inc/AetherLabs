# Common Patterns

## Supabase Client Setup

### Client-side (React/Next.js)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Server-side (Next.js App Router)
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );
}
```

### React Native (Expo)
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
```

## Authentication

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name, user_type }
  }
});
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

### Get Session
```typescript
const { data: { session } } = await supabase.auth.getSession();
const user = session?.user;
```

### Listen for Auth Changes
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') { /* handle */ }
  if (event === 'SIGNED_OUT') { /* handle */ }
});
```

### Sign Out
```typescript
await supabase.auth.signOut();
```

## Protected Routes (Next.js Proxy)

```typescript
// proxy.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/artworks', '/certificates', '/profile'];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handlers */ } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}
```

## Two-Layer Component Pattern

### Layer 1: Shared Primitive (packages/ui)
```typescript
// packages/ui/src/primitives/sidebar.tsx
export function Sidebar({ children, collapsible, ...props }) {
  // Generic, no app-specific logic
  return (
    <aside {...props}>
      {children}
    </aside>
  );
}

export function SidebarHeader({ children }) { /* ... */ }
export function SidebarContent({ children }) { /* ... */ }
export function SidebarFooter({ children }) { /* ... */ }
```

### Layer 2: App Wrapper (apps/*/components)
```typescript
// apps/admin-app/src/components/AppSidebar.tsx
import { Sidebar, SidebarHeader, SidebarContent } from '@aetherlabs/ui';

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* App-specific branding */}
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {/* App-specific navigation */}
        <NavItem href="/dashboard">Dashboard</NavItem>
        <NavItem href="/waitlist">Waitlist</NavItem>
      </SidebarContent>
    </Sidebar>
  );
}
```

## React Context Pattern (Auth)

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

## Zustand Store Pattern (Mobile)

```typescript
// store/useNewArtworkStore.ts
import { create } from 'zustand';

interface NewArtworkState {
  title: string;
  artist: string;
  year: string;
  imageUri: string | null;
  artworkId: string | null;

  setTitle: (title: string) => void;
  setArtist: (artist: string) => void;
  setYear: (year: string) => void;
  setImageUri: (uri: string | null) => void;
  setArtworkId: (id: string | null) => void;
  reset: () => void;
}

export const useNewArtworkStore = create<NewArtworkState>((set) => ({
  title: '',
  artist: '',
  year: '',
  imageUri: null,
  artworkId: null,

  setTitle: (title) => set({ title }),
  setArtist: (artist) => set({ artist }),
  setYear: (year) => set({ year }),
  setImageUri: (imageUri) => set({ imageUri }),
  setArtworkId: (artworkId) => set({ artworkId }),
  reset: () => set({
    title: '',
    artist: '',
    year: '',
    imageUri: null,
    artworkId: null,
  }),
}));
```

## Service Pattern

```typescript
// services/artwork-service.ts
class ArtworkService {
  async getArtworks(userId: string) {
    const { data, error } = await supabase
      .from('artworks')
      .select('*, certificates(*), nfc_tags(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createArtwork(artwork: Partial<Artwork>) {
    const { data, error } = await supabase
      .from('artworks')
      .insert(artwork)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteArtwork(id: string) {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const artworkService = new ArtworkService();
```

## Form Validation Pattern

```typescript
// Validation rules (web-app RegisterArtwork)
const validate = () => {
  const errors: Record<string, string> = {};

  if (!title || title.length < 2 || title.length > 120) {
    errors.title = 'Title must be 2-120 characters';
  }

  if (year && (!/^\d{4}$/.test(year) || parseInt(year) > new Date().getFullYear())) {
    errors.year = 'Invalid year';
  }

  if (description && (description.length < 280 || description.length > 500)) {
    errors.description = 'Description must be 280-500 characters';
  }

  return errors;
};
```
