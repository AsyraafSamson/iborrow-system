-- Password Migration SQL
-- Generated: 2025-12-04T01:16:34.697Z

UPDATE users SET password_hash = '$2b$10$07TjoI0KgDzLZm.ZSuZphuebf8sJevzjmTqPyAEFAharZHGhkGIg.' WHERE id = 'user_001';
UPDATE users SET password_hash = '$2b$10$nkaoq.66KpBWptHcl96Mbe4FMEeZ3OWNid6Zp.Sq3KKqh2ZKKF4z2' WHERE id = 'user_002';
UPDATE users SET password_hash = '$2b$10$aJ4pSNY9i.A3WZ8nY3qCPuEdzAiagSMivQUPqPO3w7kID0AwUlaaq' WHERE id = 'user_003';
UPDATE users SET password_hash = '$2b$10$y4Himg6OfDkRYW123xU/xODEfd3VRTva5jZeM2OLAIiGAz8jyAPDi' WHERE id = 'user_004';
UPDATE users SET password_hash = '$2b$10$mGwnMsSKJYp3I9xKL2CZZ.qpA00mcNH3va1J/PuDo1zsW/mATkeKG' WHERE id = 'user_005';
