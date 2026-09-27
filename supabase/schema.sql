-- ==============================================================================
-- GramVoice AI - PostgreSQL Database Schema for Supabase
-- ==============================================================================

-- 1. Voice Chats Table
CREATE TABLE IF NOT EXISTS public.voice_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    language TEXT DEFAULT 'hi-IN',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Mentor Bookings Table
CREATE TABLE IF NOT EXISTS public.mentor_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_name TEXT NOT NULL,
    user_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    business_type TEXT DEFAULT 'Rural Entrepreneurship',
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'Confirmed',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Saved Government Schemes Table
CREATE TABLE IF NOT EXISTS public.saved_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id TEXT NOT NULL,
    scheme_name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.voice_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;

-- 5. Open Access Policies (for anonymous public access / demo)
CREATE POLICY "Allow public read access on voice_chats" 
    ON public.voice_chats FOR SELECT USING (true);
CREATE POLICY "Allow public insert on voice_chats" 
    ON public.voice_chats FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on mentor_bookings" 
    ON public.mentor_bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on mentor_bookings" 
    ON public.mentor_bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on saved_schemes" 
    ON public.saved_schemes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on saved_schemes" 
    ON public.saved_schemes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on saved_schemes" 
    ON public.saved_schemes FOR DELETE USING (true);

-- 6. Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_voice_chats_created ON public.voice_chats (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mentor_bookings_created ON public.mentor_bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_schemes_created ON public.saved_schemes (created_at DESC);
