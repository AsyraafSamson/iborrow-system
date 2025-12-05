-- Update local D1 passwords with correct bcrypt hashes
UPDATE users SET password_hash = '$2b$10$ywhbWeLUKSjcsXZE1wfaD.TZeqHzxmVN6Z0m9MgA1Dz4Z82omBOAC' WHERE email = 'admin@ilkkm.edu.my';
UPDATE users SET password_hash = '$2b$10$i4WKGOK3t1wyYpDqe4qQi.TR4qza.4tVBVEdVoOhbfyupEUSM7j7q' WHERE email = 'staffict@ilkkm.edu.my';
UPDATE users SET password_hash = '$2b$10$IKdBhvlQqeHFuGXHRa5rre./rNg6R8rSJ3xbGqoVXUSMlsLL0FVYG' WHERE email = 'ahmad@ilkkm.edu.my';
UPDATE users SET password_hash = '$2b$10$1z0qUtgTZ2v8JND8VGs7quQ4aEr4VsubjOYskSQWIak.0NzmBk5Ru' WHERE email = 'siti@ilkkm.edu.my';
UPDATE users SET password_hash = '$2b$10$DQwKE7UbbMRXA2A92tTMT.RdaBva8NNC7idPDjpolfz1Xq4I9iwKO' WHERE email = 'ali@ilkkm.edu.my';
