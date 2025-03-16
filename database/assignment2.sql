/* 1 */
INSERT INTO public.account
    (account_firstname, account_lastname, account_email, account_password)
VALUES
    ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

/* 2 */

update account set account_type = 'Admin' where account_firstname = 'Tony'

/* 3 */

delete from account where account_firstname = 'Tony'

/* 4 */

update inventory set inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') where inv_make = 'GM' and inv_model = 'Hummer'

/* 5 */
select inv_make,inv_model from inventory i left join classification c on i.classification_id = c.classification_id where classification_name = 'Sport';

/* 6 */
UPDATE inventory 
SET Inv_image = REPLACE(Inv_image, 'images/', 'images/vehicles/'), 
    Inv_thumbnail = REPLACE(Inv_thumbnail, 'images/', 'images/vehicles/');