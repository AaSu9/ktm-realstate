CREATE TABLE testimonials (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    role TEXT,
    comment TEXT NOT NULL,
    rating INT
);

INSERT INTO testimonials (name, role, comment, rating) VALUES
('Rajesh Shrestha', 'Property Investor', 'KTM Realstate helped me find the perfect investment property. Their market knowledge is exceptional.', 5),
('Priya Tamang', 'Homeowner', 'Professional service and transparent dealing. Found my dream home within my budget. Highly recommended!', 5),
('Dinesh Karki', 'Business Owner', 'Excellent support for commercial property purchase. The team guided us through every step.', 5);
