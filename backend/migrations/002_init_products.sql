CREATE TABLE IF NOT EXISTS Products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  licenseType TEXT NOT NULL CHECK (licenseType IN ('Free', 'Academic', 'Commercial')),
  userEmail TEXT NOT NULL,
  comment TEXT NOT NULL DEFAULT '',
  createdAt TEXT NOT NULL
);