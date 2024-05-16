-- TONY STARK
-- Query 1 (Insert)
INSERT INTO account (
	account_firstname, 
	account_lastname, 
	account_email, 
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- Query 2 (Modify)
UPDATE account
	SET account_type = 'Admin'
	WHERE account_firstname = 'Tony';

-- Query 3 (Delete)
DELETE FROM account WHERE account_firstname = 'Tony';

Testing
SELECT * FROM account;

-- CARS
-- Query 4 (Modify)
UPDATE 
  inventory 
SET 
  inventory_description = REPLACE(inventory_description, 'small interiors', 'a huge interior')
WHERE 
  inventory_make = 'GM';

-- Test
-- SELECT * FROM inventory WHERE inventory_make = 'GM';

-- Query 5 (Inner Join)
SELECT inventory_make, inventory_model, classification_name
FROM inventory
	JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- Query 6 (File Path)
UPDATE inventory
	SET inventory_image = REPLACE(inventory_image, 'images/', 'images/vehicles/'),
	inventory_thumbnail = REPLACE(inventory_image, 'images/', 'images/vehicles/');

-- Test
SELECT inventory_image, inventory_thumbnail FROM inventory;

