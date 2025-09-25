-- Enable RLS for all tables
ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."company_values" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."inquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."properties" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."stats" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;

-- Allow public read access to most tables
CREATE POLICY "Public read access" ON "public"."achievements" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "public"."company_values" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "public"."contacts" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "public"."properties" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "public"."stats" FOR SELECT USING (true);
CREATE POLICY "Public read access" ON "public"."testimonials" FOR SELECT USING (true);

-- Allow admin full access to most tables
CREATE POLICY "Admin full access" ON "public"."achievements" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON "public"."company_values" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON "public"."contacts" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON "public"."properties" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON "public"."stats" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON "public"."testimonials" FOR ALL USING (auth.role() = 'authenticated');

-- Inquiries policies
-- Allow public to create inquiries
CREATE POLICY "Allow public insert" ON "public"."inquiries" FOR INSERT WITH CHECK (true);
-- Allow admin to see all inquiries
CREATE POLICY "Admin full access" ON "public"."inquiries" FOR ALL USING (auth.role() = 'authenticated');