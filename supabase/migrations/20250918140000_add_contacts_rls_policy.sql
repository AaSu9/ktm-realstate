-- Grant all access to authenticated users
CREATE POLICY "Enable all access for authenticated users" 
ON public.contacts
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
