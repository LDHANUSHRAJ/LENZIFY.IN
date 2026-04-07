-- SEED INITIAL CONTENT FOR LENZIFY
-- Synchronizing database with existing editorial design.

-- 1. SEED CATEGORIES
INSERT INTO public.categories (name, slug, description, image_url)
VALUES 
('Spectacles', 'spectacles', 'Precision engineered frames for daily clarity.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPJOFZOe3u0TQLIlFjJS59aDoiG9Z_j1KG7zZWvtJ6SRbyGHrdgaZtXs_ipzi61i8zoEczz4l3tDilIC557iERv3uoWcbBIrWoiUZtHTM4I4wAWU_2EF6luh1xx82lWeis7MDW-nkmQ2rUHRWfKoyQdSPym8MTXVhobxt-VWYBjEKQmMFS5Rjm9S8BwEfX17u15c43k4-YGqjFn1btVVNwwoH1XShyPqQLelcmQ0RGk_WRHpVRICKumJNkMrReUJDf3unNmIwaOL8'),
('Sunglasses', 'sunglasses', 'Maximum UV protection with high-fashion silhouettes.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh1Hk7QSY1WnDJ1zc1ZTo2ex_AxvD0Aa3SX6lKiO1MzqDAa2MLLaRoW1PikSfQV9pW-QAU8HO-sCJ1s2goKmSlfB0_fiJ3ifvUbMKRN22TRTgTr7ueAS6Xz8OYEYHhgd2V8ozY2bEn52Bh1tvdwae1S9ShFhJN7lXpppCIlV50aiNSJYRjsnwjqhO3QKx1iLj4RB_5vxbFRU4p4D9SV-Ds3nAChxq-k_wucxgzacGTYwndeB1idue7BHcgbvP5y67CH_iVMX0iC84'),
('Lenses', 'lenses', 'Advanced clinical optics for every prescription.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD47CclQ5KjyqEzUHC5xbDMqWc3vQ7wFScfHNyazUJazIXMt-4tFZWcf6GsLBdKAEa32aP7PycoAfGICWk576Vo426J3mO8KTqiEzdWwMnLIeZoJf_VG65t2JPYfxghtS22Xf2ONrIdF7FoUkv0gMVdfG1NURSsrdbGzUKXOmpybzLDxXwg2ZBqIGyuJ6o_ThLzt4KuwqmwXeZtllr0As-TvcmmL6RH6tafhHfz2v0Ia213SG-xNBYHBTPwtSxL8j7LpOGofNTJQMM'),
('Contact Lenses', 'contact-lenses', 'Breathable moisture-lock hydration for sensitive eyes.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPfiZ7Fa-dRXkhRrkOnrPABL-vOvUxT4j09uA4dDObbjCHoSZO5rzKiOJZhHvZ-NBiBYfLrMmRdzIaXjTxrTtnXQEMdxIpsaOWdLEIzabJbkhXFx4VfyOElz8-pK7AruLrVMOo7zw4seLIzRjWeD-mlp8PLQbkIWSiTrPwEcxjgOU4BWbr-m9yESFySl3sxgBeZ1jWjC1iWHsKkkzX4gnuzATtbxCdKxwQuKSpL0V_B4MzWANdMmrO_Y4lmK6MeRVsUB2B0gza804'),
('Accessories', 'accessories', 'Luxury protection and maintenance for your eyewear.', '/luxury_eyewear_case_editorial_1775378570621.png')
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED PRODUCTS
-- Aero Stealth Blue
INSERT INTO public.products (name, brand, price, offer_price, category_id, description, stock, is_featured, is_enabled, sku, primary_image)
SELECT 
'Aero Stealth Blue', 'Lenzify Elite', 4999, 6999, (SELECT id FROM categories WHERE slug = 'spectacles'), 
'Precision-engineered aerospace-grade titanium frames featuring advanced anti-reflective blue-cut optics.', 50, true, true, 'SKU-AERO-01', 
'https://lh3.googleusercontent.com/aida-public/AB6AXuCPJOFZOe3u0TQLIlFjJS59aDoiG9Z_j1KG7zZWvtJ6SRbyGHrdgaZtXs_ipzi61i8zoEczz4l3tDilIC557iERv3uoWcbBIrWoiUZtHTM4I4wAWU_2EF6luh1xx82lWeis7MDW-nkmQ2rUHRWfKoyQdSPym8MTXVhobxt-VWYBjEKQmMFS5Rjm9S8BwEfX17u15c43k4-YGqjFn1btVVNwwoH1XShyPqQLelcmQ0RGk_WRHpVRICKumJNkMrReUJDf3unNmIwaOL8'
ON CONFLICT (sku) DO NOTHING;

-- Carbon Ony
INSERT INTO public.products (name, brand, price, category_id, description, stock, is_featured, is_enabled, sku, primary_image)
SELECT 
'Carbon Onyx', 'Lenzify Pro', 3500, (SELECT id FROM categories WHERE slug = 'spectacles'), 
'Matte-finish aerospace carbon fiber frames, hand-engineered for extreme durability and ultra-minimalist style.', 40, true, true, 'SKU-CARBON-01', 
'https://lh3.googleusercontent.com/aida-public/AB6AXuA57Msf_SWudMTbYaZWXNU35tFeZ_lMgK9uV7VOHhQqopfRwq0jgqisoZd4HgJssWmDqcMpVFrp-xqxfVupJP6OEmInkUC5IlYFY62wX373LQc7wNewDbTLMLBXLFvDrjXfaiFg_yur3r1vFrntUmTIW8Ern8sRNQG_HxnW2JfDCF78SRPFMzZQDnXa2y_EHAjlKwg5qHqyzuNwLnIFS3GyiUQHhxDOylzJXdLV6k3UWwicPGt-mE0J4IJ2DtEL6C2gaso650MqUyY'
ON CONFLICT (sku) DO NOTHING;

-- Noir Aviator X
INSERT INTO public.products (name, brand, price, offer_price, category_id, description, stock, is_featured, is_enabled, sku, primary_image)
SELECT 
'Noir Aviator X', 'Lenzify Luxe', 7500, 9999, (SELECT id FROM categories WHERE slug = 'sunglasses'), 
'Polarized midnight black aviators featuring hand-polished gold accents and maximum-spectrum UV protection.', 25, true, true, 'SKU-SUN-01', 
'https://lh3.googleusercontent.com/aida-public/AB6AXuCh1Hk7QSY1WnDJ1zc1ZTo2ex_AxvD0Aa3SX6lKiO1MzqDAa2MLLaRoW1PikSfQV9pW-QAU8HO-sCJ1s2goKmSlfB0_fiJ3ifvUbMKRN22TRTgTr7ueAS6Xz8OYEYHhgd2V8ozY2bEn52Bh1tvdwae1S9ShFhJN7lXpppCIlV50aiNSJYRjsnwjqhO3QKx1iLj4RB_5vxbFRU4p4D9SV-Ds3nAChxq-k_wucxgzacGTYwndeB1idue7BHcgbvP5y67CH_iVMX0iC84'
ON CONFLICT (sku) DO NOTHING;

-- Prism Flare
INSERT INTO public.products (name, brand, price, category_id, description, stock, is_featured, is_enabled, sku, primary_image)
SELECT 
'Prism Flare', 'Lenzify Sport', 5200, (SELECT id FROM categories WHERE slug = 'sunglasses'), 
'Wraparound sports sunglasses with high-contrast amber lenses for peak visual performance.', 30, false, true, 'SKU-SUN-02', 
'https://lh3.googleusercontent.com/aida-public/AB6AXuApQwkt-_DK_EaIU-yQv-pbgpHLltlKQpkfyvkwwZyWMaKwNSCRZfjASuO0pH7XC7-kDIsjx6fEEEnCN4xjihYhc1p5H6aW0c_LMTFEXHQdMFg3pLMTh7ixA9QgQEpb5SqEnti_sLrf2ZsiFojH3R2ueuL403sWmoYNdmoOE382ekENSuDifWNqDfZ9iLAHSOyB73-smYkv1tLFXbkU33FZiLWmsyNd6k0j3P_jA9CYI6rk_b3GCAs9KHhO1Hh-LBH0IG82v_GylhY'
ON CONFLICT (sku) DO NOTHING;

-- Neural Clarity HD
INSERT INTO public.products (name, brand, price, category_id, description, stock, is_featured, is_enabled, sku, primary_image)
SELECT 
'Neural Clarity HD', 'AcuView', 1200, (SELECT id FROM categories WHERE slug = 'lenses'), 
'Next-generation multifocal lenses with adaptive focus technology for all-day comfort.', 100, false, true, 'SKU-LENS-01', 
'https://lh3.googleusercontent.com/aida-public/AB6AXuD47CclQ5KjyqEzUHC5xbDMqWc3vQ7wFScfHNyazUJazIXMt-4tFZWcf6GsLBdKAEa32aP7PycoAfGICWk576Vo426J3mO8KTqiEzdWwMnLIeZoJf_VG65t2JPYfxghtS22Xf2ONrIdF7FoUkv0gMVdfG1NURSsrdbGzUKXOmpybzLDxXwg2ZBqIGyuJ6o_ThLzt4KuwqmwXeZtllr0As-TvcmmL6RH6tafhHfz2v0Ia213SG-xNBYHBTPwtSxL8j7LpOGofNTJQMM'
ON CONFLICT (sku) DO NOTHING;

-- 3. SEED HOMEPAGE CONFIG
INSERT INTO public.homepage_config (section_key, content, sort_order, is_active)
VALUES 
('hero', '{
    "title": "THE LEGACY COLLECTION",
    "subtitle": "Lenzify Archive",
    "button_text": "Explore Catalogue",
    "button_link": "/products",
    "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCPJOFZOe3u0TQLIlFjJS59aDoiG9Z_j1KG7zZWvtJ6SRbyGHrdgaZtXs_ipzi61i8zoEczz4l3tDilIC557iERv3uoWcbBIrWoiUZtHTM4I4wAWU_2EF6luh1xx82lWeis7MDW-nkmQ2rUHRWfKoyQdSPym8MTXVhobxt-VWYBjEKQmMFS5Rjm9S8BwEfX17u15c43k4-YGqjFn1btVVNwwoH1XShyPqQLelcmQ0RGk_WRHpVRICKumJNkMrReUJDf3unNmIwaOL8"
}', 1, true),
('categories', '{
    "title": "Curated Categories",
    "subtitle": "The Collection",
    "items": [
        {"name": "The Heritage Series", "subtitle": "Classic silhouettes, reimagined.", "img": "/heritage_spectacles_editorial_1775377795216.png", "href": "/products?collection=heritage", "size": "large"},
        {"name": "Modern Minimalist", "subtitle": "Stripping back to the essentials.", "img": "/modern_minimalist_spectacles_editorial_1775379062591.png", "href": "/products?collection=minimalist", "size": "small"},
        {"name": "Avant-Garde", "subtitle": "Daring frames for the visionary.", "img": "/avant_garde_spectacles_editorial_1775377885089.png", "href": "/products?collection=avant-garde", "size": "small"}
    ]
}', 2, true),
('full_width_banner', '{
    "title": "NEURAL CLARITY HD",
    "subtitle": "Next-Gen Vision",
    "text": "Expressed through archival silence and meticulous engineering. Precision optics meets high-fashion aesthetics.",
    "button_text": "Explore The Legacy",
    "button_link": "/products?collection=legacy",
    "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuD47CclQ5KjyqEzUHC5xbDMqWc3vQ7wFScfHNyazUJazIXMt-4tFZWcf6GsLBdKAEa32aP7PycoAfGICWk576Vo426J3mO8KTqiEzdWwMnLIeZoJf_VG65t2JPYfxghtS22Xf2ONrIdF7FoUkv0gMVdfG1NURSsrdbGzUKXOmpybzLDxXwg2ZBqIGyuJ6o_ThLzt4KuwqmwXeZtllr0As-TvcmmL6RH6tafhHfz2v0Ia213SG-xNBYHBTPwtSxL8j7LpOGofNTJQMM"
}', 3, true),
('featured_products', '{
    "title": "EDITOR’S SELECTION",
    "subtitle": "Featured Frames"
}', 4, true);
