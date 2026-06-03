CREATE INDEX IF NOT EXISTS idx_requests_userId ON Requests(userId);
CREATE INDEX IF NOT EXISTS idx_requests_status ON Requests(status);
CREATE INDEX IF NOT EXISTS idx_products_licenseType ON Products(licenseType);
CREATE INDEX IF NOT EXISTS idx_products_ownerUserId ON Products(ownerUserId);