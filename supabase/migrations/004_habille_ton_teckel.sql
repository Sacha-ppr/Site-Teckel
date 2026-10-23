-- =====================================================================
-- Articles du mini-jeu « Habille ton teckel » absents du catalogue initial.
-- À exécuter dans SQL Editor. Idempotent.
-- Les autres vêtements du jeu existent déjà : pull-marin, manteau-saucisse, harnais-h.
-- =====================================================================

insert into public.products (slug, name, description, category, price_cents, stock, color) values
  ('beret-parisien', 'Béret parisien', 'Béret en laine bouillie avec élastique sous le menton, pour ne pas le perdre en balade.', 'vetements', 2200, 30, '#1a1a1a'),
  ('casquette-teckel', 'Casquette à oreilles', 'Casquette en coton avec deux ouvertures pour laisser passer les oreilles. Protège du soleil.', 'vetements', 1900, 25, '#2c4a6b'),
  ('lunettes-soleil', 'Lunettes de soleil canines', 'Verres filtrants anti-UV et sangle réglable, pour les teckels sensibles à la lumière.', 'accessoires', 2400, 15, '#111111'),
  ('pull-torsade', 'Pull en laine torsadée', 'Pull à torsades en laine mérinos, coupé long pour couvrir tout le dos sans gêner les pattes.', 'vetements', 4200, 20, '#e9dcc3'),
  ('foulard-rouge', 'Foulard rouge', 'Bandana en coton à nouer au cou, lavable en machine.', 'accessoires', 1400, 50, '#b3122a'),
  ('noeud-papillon', 'Nœud papillon', 'Nœud papillon à clipser sur le collier, pour les grandes occasions.', 'accessoires', 1200, 40, '#111111')
on conflict (slug) do nothing;
