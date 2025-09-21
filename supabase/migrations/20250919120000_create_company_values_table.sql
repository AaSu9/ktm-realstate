CREATE TABLE company_values (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    icon TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO company_values (icon, title, description) VALUES
('Shield', 'Trust & Transparency', 'We believe in complete transparency in all our dealings, ensuring our clients make informed decisions.'),
('Heart', 'Client-Centric Approach', 'Your satisfaction is our priority. We go above and beyond to exceed your expectations.'),
('TrendingUp', 'Market Expertise', 'Deep understanding of Nepal''s real estate market trends and opportunities.'),
('CheckCircle', 'Quality Assurance', 'Every property in our portfolio is thoroughly verified and meets our quality standards.');
