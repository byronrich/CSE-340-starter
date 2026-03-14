-- 1. Insert Tony Stark
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Update Tony Stark to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3. Delete Tony Stark
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4. Update GM Hummer description using REPLACE()
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. INNER JOIN for Sport vehicles
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification
  ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- 6. Update image paths to include /vehicles
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
