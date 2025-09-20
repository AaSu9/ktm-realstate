DROP POLICY "Enable all access for authenticated users" ON public.contacts;

CREATE POLICY "Allow authenticated users to manage the single contact entry"
ON public.contacts
FOR ALL
TO authenticated
USING (id = 1)
WITH CHECK (id = 1);
