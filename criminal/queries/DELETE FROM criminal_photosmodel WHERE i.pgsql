DELETE FROM criminal_photosmodel WHERE id IN (SELECT id FROM criminal_criminal);
DELETE FROM criminal_identikitsmodel WHERE id IN (SELECT id FROM criminal_criminal);
DELETE FROM criminal_criminal;
TRUNCATE criminal_criminal_identikits;
TRUNCATE criminal_criminal_photos;
TRUNCATE images_images;
TRUNCATE sketches_sketches;