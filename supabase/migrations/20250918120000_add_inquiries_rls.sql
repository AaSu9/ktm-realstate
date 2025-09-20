-- Allow public anonymous access to create inquiries
CREATE POLICY "Allow public access to create inquiries"
ON public.inquiries
FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to manage inquiries
CREATE POLICY "Allow authenticated users to manage inquiries"
ON public.inquiries
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
