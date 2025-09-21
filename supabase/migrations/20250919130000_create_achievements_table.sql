CREATE TABLE achievements (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    icon TEXT,
    value TEXT NOT NULL,
    label TEXT NOT NULL
);

INSERT INTO achievements (icon, value, label) VALUES
('Building', '500+', 'Properties Sold'),
('Users', '1000+', 'Happy Clients'),
('Award', '15+', 'Years Experience'),
('Star', '4.9/5', 'Client Rating');
