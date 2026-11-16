BEGIN;

-- ============================================================================
-- 1. CATEGORÍAS (8 base + 2 esenciales: cooling y cases)
-- ============================================================================
INSERT INTO categorias (id, nombre, icono, descripcion, estado, total_productos, fecha_creacion, fecha_actualizacion)
VALUES
('ram',         'Memorias RAM',            'memory',          'Módulos de memoria DDR4 y DDR5 para PC y Servidores', 'ACTIVA', 10, NOW(), NOW()),
('ssd',         'Almacenamiento SSD',      'storage',         'Unidades de estado sólido NVMe M.2 y SATA III', 'ACTIVA', 10, NOW(), NOW()),
('gpu',         'Tarjetas Gráficas (GPU)', 'Layers',          'Tarjetas de video GeForce RTX y AMD Radeon', 'ACTIVA', 10, NOW(), NOW()),
('cpu',         'Procesadores',            'Zap',             'Procesadores Intel Core y AMD Ryzen', 'ACTIVA', 10, NOW(), NOW()),
('motherboard', 'Placas Madre',            'Grid',            'Mainboards chipsets Intel y AMD', 'ACTIVA', 10, NOW(), NOW()),
('hdd',         'Discos Duros (HDD)',      'Database',        'Discos mecánicos para almacenamiento masivo y NAS', 'ACTIVA', 10, NOW(), NOW()),
('psu',         'Fuentes de Poder',        'BatteryCharging', 'Fuentes 80 Plus Bronze, Gold y Platinum ATX 3.0', 'ACTIVA', 10, NOW(), NOW()),
('usb',         'Memorias USB & Flash',    'Usb',             'Pen drives USB 3.2 y tarjetas MicroSD por paquete máster', 'ACTIVA', 10, NOW(), NOW()),
('cooling',     'Refrigeración y Coolers', 'Wind',            'Disipadores por aire, refrigeración líquida AIO y pasta térmica', 'ACTIVA', 10, NOW(), NOW()),
('cases',       'Gabinetes (Cases)',       'Box',             'Cases ATX, Micro-ATX y torres con flujo de aire optimizado', 'ACTIVA', 10, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    total_productos = EXCLUDED.total_productos,
    fecha_actualizacion = NOW();

-- Subcategorías para las 2 categorías nuevas (sin duplicar si ya existen)
INSERT INTO subcategorias (categoria_id, nombre)
SELECT v.cat_id, v.nombre
FROM (VALUES
    ('cooling', 'Refrigeración Líquida AIO'),
    ('cooling', 'Disipadores por Aire Torre'),
    ('cooling', 'Ventiladores ARGB 120mm/140mm'),
    ('cases',   'Mid-Tower ATX'),
    ('cases',   'Micro-ATX Compacto'),
    ('cases',   'Full-Tower Workstation')
) AS v(cat_id, nombre)
WHERE NOT EXISTS (
    SELECT 1 FROM subcategorias s WHERE s.categoria_id = v.cat_id AND s.nombre = v.nombre
);

-- ============================================================================
-- 2. INSERCIÓN DE 100 PRODUCTOS + FICHAS TÉCNICAS + IMÁGENES
-- ============================================================================
DO $$
DECLARE
    v_prov_id BIGINT;
    v_prod_id BIGINT;
    v_base_url TEXT := 'http://localhost:8080/api/v1/media/files/products/';
BEGIN
    SELECT id INTO v_prov_id FROM perfiles_proveedor ORDER BY id ASC LIMIT 1;
    IF v_prov_id IS NULL THEN
        RAISE EXCEPTION 'No existe ningún proveedor en perfiles_proveedor. Arranca el backend primero.';
    END IF;

    -- ========================================================================
    -- CATEGORÍA 1: RAM (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz CL30', 'Kit de memoria DDR5 de alto rendimiento con perfiles Intel XMP 3.0 y AMD EXPO para estaciones de trabajo y gaming.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x10 Kits', '10 kits', '1 caja (10 kits)', 112.00, 1120.00, 'USD', 150, 'Garantía limitada de por vida. Envío asegurado a nivel nacional.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','32 GB (2x16GB)'),(v_prod_id,'Tipo','DDR5'),(v_prod_id,'Frecuencia','6000 MHz'),(v_prod_id,'Latencia CAS','CL30');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-corsair-vengeance-32gb-ddr5.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'Crucial Pro 16GB DDR5 5600MHz UDIMM', 'Módulo DDR5 Plug-and-Play sin disipador voluminoso, ideal para ensamblajes corporativos y oficinas.', 'MAYORISTA_PURO', 'Bandeja OEM x20', '20 unidades', '1 bandeja (20 unid.)', 46.50, 930.00, 'USD', 240, 'Garantía de 3 años. Entrega inmediata en almacén Lima.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','16 GB'),(v_prod_id,'Tipo','DDR5'),(v_prod_id,'Frecuencia','5600 MHz'),(v_prod_id,'Voltaje','1.1V');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-crucial-pro-16gb-ddr5.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz', 'Memoria DDR5 premium con iluminación RGB direccionable y disipador de aluminio cepillado.', 'IMPORTADOR_DIRECTO', 'Caja Master x10 Kits', '10 kits', '1 caja (10 kits)', 128.00, 1280.00, 'USD', 80, 'Garantía de fábrica 5 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','32 GB (2x16GB)'),(v_prod_id,'Tipo','DDR5 RGB'),(v_prod_id,'Frecuencia','6400 MHz'),(v_prod_id,'Latencia CAS','CL32');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-gskill-tridentz5-32gb-ddr5.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'Kingston Fury Beast 16GB DDR4 3200MHz CL16', 'Módulo DDR4 de alta rotación para PCs de escritorio de gama media y renovaciones corporativas.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x20 Blísteres', '20 unidades', '1 caja (20 unid.)', 32.00, 640.00, 'USD', 400, 'Garantía directa 3 años.', 'ACTIVO', true, true, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','16 GB'),(v_prod_id,'Tipo','DDR4'),(v_prod_id,'Frecuencia','3200 MHz'),(v_prod_id,'Latencia CAS','CL16');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-kingston-fury-16gb-ddr4.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'TeamGroup T-Force Delta RGB 16GB (2x8GB) DDR4 3600MHz', 'Kit dual channel DDR4 con difusor RGB de 120 grados para ensamblajes gamer.', 'IMPORTADOR_DIRECTO', 'Caja Master x10 Kits', '10 kits', '1 caja (10 kits)', 44.00, 440.00, 'USD', 120, 'Garantía 3 años con distribuidor.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','16 GB (2x8GB)'),(v_prod_id,'Tipo','DDR4 RGB'),(v_prod_id,'Frecuencia','3600 MHz'),(v_prod_id,'Latencia CAS','CL18');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-teamgroup-delta-16gb-ddr4.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'ADATA XPG Spectrix D35G 16GB DDR4 3200MHz', 'Módulo compacto de perfil bajo con iluminación RGB compatible con placas madre principales.', 'MAYORISTA_PURO', 'Caja Master x20', '20 unidades', '1 caja (20 unid.)', 34.50, 690.00, 'USD', 180, 'Despacho en 24 horas.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','16 GB'),(v_prod_id,'Tipo','DDR4 RGB'),(v_prod_id,'Frecuencia','3200 MHz'),(v_prod_id,'Latencia CAS','CL16');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-adata-xpg-d35g-16gb-ddr4.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'Kingston ValueRAM 8GB DDR4 3200MHz SO-DIMM Laptop', 'Memoria para portátiles corporativas y mini PCs con estándar JEDEC.', 'DISTRIBUIDOR_OFICIAL', 'Bandeja x25 Blísteres', '25 unidades', '1 bandeja (25 unid.)', 17.50, 437.50, 'USD', 300, 'Garantía de 3 años.', 'ACTIVO', false, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','8 GB'),(v_prod_id,'Formato','SO-DIMM Laptop'),(v_prod_id,'Frecuencia','3200 MHz'),(v_prod_id,'Latencia CAS','CL22');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-kingston-sodimm-8gb-ddr4.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'Crucial 16GB DDR5 4800MHz SO-DIMM Laptop', 'Actualización DDR5 para laptops de última generación Intel Core 13ª/14ª y Ryzen 7000.', 'MAYORISTA_PURO', 'Caja Master x20', '20 unidades', '1 caja (20 unid.)', 44.00, 880.00, 'USD', 140, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','16 GB'),(v_prod_id,'Formato','SO-DIMM DDR5'),(v_prod_id,'Frecuencia','4800 MHz'),(v_prod_id,'Voltaje','1.1V');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-crucial-sodimm-16gb-ddr5.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'Corsair Dominator Titanium 64GB (2x32GB) DDR5 6000MHz', 'Kit de grado entusiasta y creación de contenido con barra superior intercambiable.', 'IMPORTADOR_DIRECTO', 'Caja Master x5 Kits', '5 kits', '1 caja (5 kits)', 255.00, 1275.00, 'USD', 45, 'Garantía de por vida Corsair.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','64 GB (2x32GB)'),(v_prod_id,'Tipo','DDR5'),(v_prod_id,'Frecuencia','6000 MHz'),(v_prod_id,'Latencia CAS','CL30');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-corsair-dominator-64gb-ddr5.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ram', 'Patriot Viper Venom 32GB (2x16GB) DDR5 6200MHz', 'Kit DDR5 con excelente relación costo-beneficio para integradores B2B.', 'MAYORISTA_PURO', 'Caja Master x10 Kits', '10 kits', '1 caja (10 kits)', 98.00, 980.00, 'USD', 110, 'Garantía 3 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','32 GB (2x16GB)'),(v_prod_id,'Tipo','DDR5'),(v_prod_id,'Frecuencia','6200 MHz'),(v_prod_id,'Latencia CAS','CL40');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ram-patriot-viper-32gb-ddr5.jpg', 1);

    -- ========================================================================
    -- CATEGORÍA 2: SSD (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'Samsung 990 PRO 1TB NVMe M.2 PCIe 4.0', 'SSD NVMe insignia con controlador Pascal y caché DRAM para workstations y gaming extremo.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 96.00, 960.00, 'USD', 160, 'Garantía 5 años Samsung.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','1 TB'),(v_prod_id,'Interfaz','PCIe 4.0 x4 NVMe'),(v_prod_id,'Lectura Secuencial','7450 MB/s'),(v_prod_id,'Escritura Secuencial','6900 MB/s');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-samsung-990pro-1tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'Kingston NV2 1TB M.2 2280 NVMe PCIe 4.0', 'Unidad NVMe de alta demanda y bajo consumo energético ideal para laptops y PCs de oficina.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x25', '25 unidades', '1 caja (25 unid.)', 54.00, 1350.00, 'USD', 350, 'Garantía 3 años.', 'ACTIVO', true, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','1 TB'),(v_prod_id,'Interfaz','PCIe 4.0 x4 NVMe'),(v_prod_id,'Lectura Secuencial','3500 MB/s'),(v_prod_id,'Factor de Forma','M.2 2280');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-kingston-nv2-1tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'WD Black SN850X 2TB NVMe PCIe 4.0', 'Almacenamiento de ultra velocidad para edición de video 4K y bibliotecas pesadas.', 'IMPORTADOR_DIRECTO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 148.00, 1480.00, 'USD', 90, 'Garantía 5 años Western Digital.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','2 TB'),(v_prod_id,'Interfaz','PCIe 4.0 x4 NVMe'),(v_prod_id,'Lectura Secuencial','7300 MB/s'),(v_prod_id,'Escritura Secuencial','6600 MB/s');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-wd-black-sn850x-2tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'Crucial P3 Plus 1TB M.2 NVMe PCIe 4.0', 'SSD Micron 3D NAND con equilibrio óptimo entre velocidad PCIe 4.0 y precio mayorista.', 'MAYORISTA_PURO', 'Caja Master x20', '20 unidades', '1 caja (20 unid.)', 58.00, 1160.00, 'USD', 210, 'Garantía 5 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','1 TB'),(v_prod_id,'Interfaz','PCIe 4.0 NVMe'),(v_prod_id,'Lectura Secuencial','5000 MB/s'),(v_prod_id,'TBW','220 TB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-crucial-p3plus-1tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'Kingston A400 480GB SATA III 2.5"', 'Unidad SATA III estándar para repotenciación masiva de equipos corporativos.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x25', '25 unidades', '1 caja (25 unid.)', 29.00, 725.00, 'USD', 500, 'Garantía 3 años.', 'ACTIVO', false, true, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','480 GB'),(v_prod_id,'Interfaz','SATA III 6Gb/s'),(v_prod_id,'Lectura Secuencial','500 MB/s'),(v_prod_id,'Factor de Forma','2.5 pulgadas');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-kingston-a400-480gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'Samsung 870 EVO 1TB SATA III 2.5"', 'El SSD SATA más confiable del mercado para servidores ligeros y estaciones de trabajo.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x15', '15 unidades', '1 caja (15 unid.)', 79.00, 1185.00, 'USD', 130, 'Garantía 5 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','1 TB'),(v_prod_id,'Interfaz','SATA III 6Gb/s'),(v_prod_id,'Lectura Secuencial','560 MB/s'),(v_prod_id,'TBW','600 TB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-samsung-870evo-1tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'ADATA XPG Gammix S70 Blade 1TB NVMe PCIe 4.0', 'Incluye disipador de aluminio ultrafino compatible con PS5 y laptops delgadas.', 'IMPORTADOR_DIRECTO', 'Caja Master x20', '20 unidades', '1 caja (20 unid.)', 72.00, 1440.00, 'USD', 120, 'Garantía 5 años ADATA.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','1 TB'),(v_prod_id,'Interfaz','PCIe 4.0 x4 NVMe'),(v_prod_id,'Lectura Secuencial','7400 MB/s'),(v_prod_id,'Caché','SLC + DRAM');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-adata-s70blade-1tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'WD Green SN350 500GB M.2 NVMe PCIe 3.0', 'Solución económica NVMe para actualización rápida de computadoras de entrada.', 'MAYORISTA_PURO', 'Caja Master x25', '25 unidades', '1 caja (25 unid.)', 31.00, 775.00, 'USD', 320, 'Garantía 3 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','500 GB'),(v_prod_id,'Interfaz','PCIe 3.0 x4 NVMe'),(v_prod_id,'Lectura Secuencial','2400 MB/s'),(v_prod_id,'Factor de Forma','M.2 2280');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-wd-green-sn350-500gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'Crucial T700 2TB NVMe M.2 PCIe 5.0', 'Unidad de próxima generación PCIe 5.0 con velocidades superiores a 12,000 MB/s.', 'IMPORTADOR_DIRECTO', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 275.00, 1375.00, 'USD', 35, 'Garantía 5 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','2 TB'),(v_prod_id,'Interfaz','PCIe 5.0 x4 NVMe'),(v_prod_id,'Lectura Secuencial','12400 MB/s'),(v_prod_id,'Escritura Secuencial','11800 MB/s');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-crucial-t700-2tb-gen5.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'ssd', 'SanDisk Extreme Portable 1TB SSD Externo USB 3.2', 'SSD externo resistente al agua y polvo IP65 para respaldo corporativo en campo.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 89.00, 890.00, 'USD', 95, 'Garantía 5 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','1 TB'),(v_prod_id,'Interfaz','USB 3.2 Gen 2 Tipo-C'),(v_prod_id,'Lectura Secuencial','1050 MB/s'),(v_prod_id,'Protección','IP65');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'ssd-sandisk-extreme-1tb-ext.jpg', 1);

    -- ========================================================================
    -- CATEGORÍA 3: GPU (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'ASUS Dual GeForce RTX 4060 OC 8GB GDDR6', 'Tarjeta gráfica compacta de doble ventilador con arquitectura Ada Lovelace y DLSS 3.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 295.00, 1475.00, 'USD', 70, 'Garantía oficial ASUS 3 años.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','NVIDIA RTX 4060'),(v_prod_id,'Memoria VRAM','8 GB GDDR6'),(v_prod_id,'Bus de Memoria','128-bit'),(v_prod_id,'Consumo TDP','115W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-asus-dual-rtx4060-8gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'MSI Ventus 2X GeForce RTX 4060 Ti 16GB GDDR6', 'Ideal para cargas de trabajo de IA local, renderizado y gaming en 1440p gracias a sus 16GB VRAM.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 435.00, 2175.00, 'USD', 45, 'Garantía MSI 3 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','NVIDIA RTX 4060 Ti'),(v_prod_id,'Memoria VRAM','16 GB GDDR6'),(v_prod_id,'Salidas','3x DP 1.4a, 1x HDMI 2.1a'),(v_prod_id,'Fuente Recomendada','550W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-msi-ventus-rtx4060ti-16gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'Gigabyte Windforce OC GeForce RTX 4070 Super 12GB', 'Sistema de enfriamiento triple fan Windforce para rendimiento superior en 1440p y 4K.', 'IMPORTADOR_DIRECTO', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 585.00, 2340.00, 'USD', 40, 'Garantía 3 años.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','NVIDIA RTX 4070 Super'),(v_prod_id,'Memoria VRAM','12 GB GDDR6X'),(v_prod_id,'Núcleos CUDA','7168'),(v_prod_id,'Conector Energía','16-pin (12VHPWR)');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-gigabyte-rtx4070super-12gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'ASUS TUF Gaming GeForce RTX 4070 Ti Super 16GB', 'Construcción grado militar TUF con 16GB GDDR6X para diseño 3D y arquitectura.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 790.00, 3160.00, 'USD', 28, 'Garantía oficial 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','NVIDIA RTX 4070 Ti Super'),(v_prod_id,'Memoria VRAM','16 GB GDDR6X'),(v_prod_id,'Bus de Memoria','256-bit'),(v_prod_id,'Fuente Recomendada','750W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-asus-tuf-rtx4070tisuper.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'MSI Gaming X Slim GeForce RTX 4080 Super 16GB', 'Diseño delgado de 2.5 slots para estaciones de renderizado y simulaciones.', 'IMPORTADOR_DIRECTO', 'Caja Master x2', '2 unidades', '1 caja (2 unid.)', 1020.00, 2040.00, 'USD', 18, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','NVIDIA RTX 4080 Super'),(v_prod_id,'Memoria VRAM','16 GB GDDR6X'),(v_prod_id,'Núcleos CUDA','10240'),(v_prod_id,'Consumo TDP','320W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-msi-rtx4080super-16gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'ASUS ROG Strix GeForce RTX 4090 OC 24GB GDDR6X', 'Tope de gama para entrenamiento de modelos de IA, VFX y workstations críticas.', 'IMPORTADOR_DIRECTO', 'Caja Individual x2', '2 unidades', '2 unidades', 1850.00, 3700.00, 'USD', 12, 'Entrega asegurada con póliza.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','NVIDIA RTX 4090'),(v_prod_id,'Memoria VRAM','24 GB GDDR6X'),(v_prod_id,'Bus de Memoria','384-bit'),(v_prod_id,'Fuente Recomendada','1000W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-asus-rog-rtx4090-24gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'Sapphire Pulse AMD Radeon RX 7600 8GB GDDR6', 'Excelente opción 1080p para PCs comerciales y cabinas gaming con bajo costo por frame.', 'MAYORISTA_PURO', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 255.00, 1275.00, 'USD', 65, 'Garantía Sapphire 2 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','AMD Radeon RX 7600'),(v_prod_id,'Memoria VRAM','8 GB GDDR6'),(v_prod_id,'Arquitectura','RDNA 3'),(v_prod_id,'Consumo TDP','165W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-sapphire-rx7600-8gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'Gigabyte Gaming OC AMD Radeon RX 7700 XT 12GB', 'Rendimiento sólido en 1440p con 12GB GDDR6 y triple ventilador.', 'MAYORISTA_PURO', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 410.00, 1640.00, 'USD', 35, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','AMD Radeon RX 7700 XT'),(v_prod_id,'Memoria VRAM','12 GB GDDR6'),(v_prod_id,'Bus de Memoria','192-bit'),(v_prod_id,'Fuente Recomendada','700W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-gigabyte-rx7700xt-12gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'Sapphire Nitro+ AMD Radeon RX 7800 XT 16GB', 'Refrigeración de triple ventilador con backplate metálico y 16GB GDDR6.', 'IMPORTADOR_DIRECTO', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 495.00, 1980.00, 'USD', 30, 'Garantía 3 años.', 'ACTIVO', false, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','AMD Radeon RX 7800 XT'),(v_prod_id,'Memoria VRAM','16 GB GDDR6'),(v_prod_id,'Bus de Memoria','256-bit'),(v_prod_id,'Consumo TDP','263W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-sapphire-rx7800xt-16gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'gpu', 'PNY NVIDIA RTX A2000 12GB GDDR6 Workstation', 'GPU profesional de perfil bajo certificada para AutoCAD, Revit, SolidWorks y Blender.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 460.00, 2300.00, 'USD', 40, 'Garantía PNY Pro 3 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Chip Gráfico','NVIDIA RTX A2000'),(v_prod_id,'Memoria VRAM','12 GB GDDR6 ECC'),(v_prod_id,'Salidas','4x Mini DisplayPort 1.4'),(v_prod_id,'Consumo TDP','70W (Sin conector)');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'gpu-pny-rtx-a2000-12gb.jpg', 1);

    -- ========================================================================
    -- CATEGORÍA 4: CPU (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'Intel Core i5-14400F 10 Núcleos LGA1700', 'Procesador de 14ª generación ideal para ensamblajes corporativos y gaming de volumen.', 'DISTRIBUIDOR_OFICIAL', 'Bandeja Tray x10', '10 unidades', '1 bandeja (10 unid.)', 195.00, 1950.00, 'USD', 200, 'Garantía oficial Intel 3 años.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','10 (6P+4E) / 16 Hilos'),(v_prod_id,'Socket','LGA 1700'),(v_prod_id,'Frecuencia Turbo','4.7 GHz'),(v_prod_id,'Gráficos Integrados','No (Requiere GPU)');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-intel-i5-14400f.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'Intel Core i5-14600K 14 Núcleos LGA1700', 'Desbloqueado para overclocking y estaciones de productividad exigentes.', 'DISTRIBUIDOR_OFICIAL', 'Caja Box x10', '10 unidades', '1 caja (10 unid.)', 285.00, 2850.00, 'USD', 110, 'Garantía Intel 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','14 (6P+8E) / 20 Hilos'),(v_prod_id,'Socket','LGA 1700'),(v_prod_id,'Frecuencia Turbo','5.3 GHz'),(v_prod_id,'Caché L3','24 MB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-intel-i5-14600k.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'Intel Core i7-14700K 20 Núcleos LGA1700', 'Procesador híbrido de alto desempeño para compilación, CAD y edición profesional.', 'IMPORTADOR_DIRECTO', 'Caja Box x5', '5 unidades', '1 caja (5 unid.)', 390.00, 1950.00, 'USD', 75, 'Garantía Intel 3 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','20 (8P+12E) / 28 Hilos'),(v_prod_id,'Socket','LGA 1700'),(v_prod_id,'Frecuencia Turbo','5.6 GHz'),(v_prod_id,'Caché L3','33 MB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-intel-i7-14700k.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'Intel Core i9-14900K 24 Núcleos LGA1700', 'Máxima frecuencia de reloj hasta 6.0 GHz para estaciones de trabajo críticas.', 'IMPORTADOR_DIRECTO', 'Caja Box x5', '5 unidades', '1 caja (5 unid.)', 540.00, 2700.00, 'USD', 40, 'Garantía Intel 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','24 (8P+16E) / 32 Hilos'),(v_prod_id,'Socket','LGA 1700'),(v_prod_id,'Frecuencia Turbo','6.0 GHz'),(v_prod_id,'Caché L3','36 MB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-intel-i9-14900k.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'Intel Core i3-13100 4 Núcleos LGA1700 (Con Gráficos)', 'Procesador corporativo con gráficos UHD 730 integrados para oficinas y puntos de venta.', 'MAYORISTA_PURO', 'Caja Box x15', '15 unidades', '1 caja (15 unid.)', 118.00, 1770.00, 'USD', 260, 'Incluye cooler stock Intel.', 'ACTIVO', false, true, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','4 / 8 Hilos'),(v_prod_id,'Socket','LGA 1700'),(v_prod_id,'Frecuencia Turbo','4.5 GHz'),(v_prod_id,'Gráficos Integrados','Intel UHD 730');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-intel-i3-13100.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'AMD Ryzen 5 5600 6 Núcleos AM4', 'El procesador AM4 con mejor retorno de inversión para ensamblajes masivos.', 'DISTRIBUIDOR_OFICIAL', 'Caja Box x10', '10 unidades', '1 caja (10 unid.)', 124.00, 1240.00, 'USD', 300, 'Incluye disipador Wraith Stealth.', 'ACTIVO', true, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','6 / 12 Hilos'),(v_prod_id,'Socket','AM4'),(v_prod_id,'Frecuencia Boost','4.4 GHz'),(v_prod_id,'Caché L3','32 MB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-amd-ryzen5-5600.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'AMD Ryzen 5 7600 6 Núcleos AM5', 'Entrada eficiente a la plataforma AM5 con soporte DDR5 y PCIe 5.0.', 'DISTRIBUIDOR_OFICIAL', 'Caja Box x10', '10 unidades', '1 caja (10 unid.)', 192.00, 1920.00, 'USD', 150, 'Garantía AMD 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','6 / 12 Hilos'),(v_prod_id,'Socket','AM5'),(v_prod_id,'Frecuencia Boost','5.1 GHz'),(v_prod_id,'TDP','65W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-amd-ryzen5-7600.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'AMD Ryzen 7 7800X3D 8 Núcleos AM5 (3D V-Cache)', 'Tecnología 3D V-Cache de 96MB L3 para máximo rendimiento en simulación y gaming.', 'IMPORTADOR_DIRECTO', 'Caja Box x5', '5 unidades', '1 caja (5 unid.)', 365.00, 1825.00, 'USD', 60, 'Garantía AMD 3 años.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','8 / 16 Hilos'),(v_prod_id,'Socket','AM5'),(v_prod_id,'Caché L3','96 MB 3D V-Cache'),(v_prod_id,'TDP','120W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-amd-ryzen7-7800x3d.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'AMD Ryzen 9 7950X 16 Núcleos AM5', 'Estación de trabajo multi-hilo con 16 núcleos Zen 4 a 5.7 GHz.', 'IMPORTADOR_DIRECTO', 'Caja Box x5', '5 unidades', '1 caja (5 unid.)', 515.00, 2575.00, 'USD', 35, 'Garantía AMD 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','16 / 32 Hilos'),(v_prod_id,'Socket','AM5'),(v_prod_id,'Frecuencia Boost','5.7 GHz'),(v_prod_id,'Caché Total','80 MB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-amd-ryzen9-7950x.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cpu', 'AMD Ryzen 5 8600G 6 Núcleos AM5 (Radeon 760M)', 'APU AM5 con gráficos Radeon 760M integrados e IA Ryzen AI NPU.', 'MAYORISTA_PURO', 'Caja Box x10', '10 unidades', '1 caja (10 unid.)', 210.00, 2100.00, 'USD', 100, 'Incluye cooler Wraith Stealth.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Núcleos / Hilos','6 / 12 Hilos'),(v_prod_id,'Socket','AM5'),(v_prod_id,'Gráficos Integrados','AMD Radeon 760M'),(v_prod_id,'TDP','65W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cpu-amd-ryzen5-8600g.jpg', 1);

    -- ========================================================================
    -- CATEGORÍA 5: MOTHERBOARD (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'ASUS Prime B760M-A WiFi D4 Micro-ATX LGA1700', 'Placa madre corporativa y gaming con Wi-Fi 6, doble M.2 PCIe 4.0 y LAN 2.5Gb.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 132.00, 1320.00, 'USD', 120, 'Garantía ASUS 3 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','LGA 1700 / Intel B760'),(v_prod_id,'Formato','Micro-ATX'),(v_prod_id,'Memoria Soportada','DDR4 (4 slots)'),(v_prod_id,'Conectividad','Wi-Fi 6 + 2.5Gb LAN');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-asus-prime-b760m-a.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'MSI PRO Z790-P WiFi DDR5 ATX LGA1700', 'Mainboard ATX robusta con VRM de 14+1+1 fases para procesadores Core i7/i9.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 198.00, 990.00, 'USD', 80, 'Garantía MSI 3 años.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','LGA 1700 / Intel Z790'),(v_prod_id,'Formato','ATX'),(v_prod_id,'Memoria Soportada','DDR5 hasta 7000+ MHz'),(v_prod_id,'Puertos M.2','4x M.2 PCIe 4.0');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-msi-pro-z790p-wifi.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'Gigabyte B760M DS3H DDR4 Micro-ATX', 'Solución de alto volumen para integradores con soporte Intel 12ª/13ª/14ª Gen.', 'MAYORISTA_PURO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 105.00, 1050.00, 'USD', 200, 'Garantía 3 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','LGA 1700 / Intel B760'),(v_prod_id,'Formato','Micro-ATX'),(v_prod_id,'Memoria Soportada','DDR4 (4 slots)'),(v_prod_id,'Red','2.5GbE LAN');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-gigabyte-b760m-ds3h.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'ASUS TUF Gaming B650-PLUS WiFi AM5 ATX', 'Placa AM5 DDR5 con disipación extendida y soporte PCIe 5.0 M.2.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 188.00, 940.00, 'USD', 90, 'Garantía ASUS 3 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','AM5 / AMD B650'),(v_prod_id,'Formato','ATX'),(v_prod_id,'Memoria Soportada','DDR5 (4 slots)'),(v_prod_id,'Conectividad','Wi-Fi 6 + USB 3.2 Gen 2x2');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-asus-tuf-b650-plus.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'MSI MAG B650 Tomahawk WiFi AM5 ATX', 'Diseño sobrio con VRM 14+2+1 de 80A, ideal para Ryzen 7 y Ryzen 9.', 'IMPORTADOR_DIRECTO', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 208.00, 1040.00, 'USD', 65, 'Garantía MSI 3 años.', 'ACTIVO', false, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','AM5 / AMD B650'),(v_prod_id,'Formato','ATX'),(v_prod_id,'Memoria Soportada','DDR5 hasta 6600+ MHz'),(v_prod_id,'Audio','Realtek ALC4080');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-msi-b650-tomahawk.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'ASRock B550M Pro4 Micro-ATX AM4', 'Placa AM4 confiable con doble M.2 y disipador de aluminio para Ryzen 5000.', 'MAYORISTA_PURO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 96.00, 960.00, 'USD', 170, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','AM4 / AMD B550'),(v_prod_id,'Formato','Micro-ATX'),(v_prod_id,'Memoria Soportada','DDR4 (4 slots)'),(v_prod_id,'PCIe','PCIe 4.0 x16');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-asrock-b550m-pro4.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'Gigabyte A520M K V2 Micro-ATX AM4', 'Opción económica para PCs administrativas con Ryzen 4000/5000.', 'MAYORISTA_PURO', 'Caja Master x15', '15 unidades', '1 caja (15 unid.)', 64.00, 960.00, 'USD', 280, 'Garantía 3 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','AM4 / AMD A520'),(v_prod_id,'Formato','Micro-ATX'),(v_prod_id,'Memoria Soportada','DDR4 (2 slots)'),(v_prod_id,'Almacenamiento','1x M.2 NVMe + 4x SATA');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-gigabyte-a520m-k.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'ASUS ROG Strix X670E-F Gaming WiFi AM5', 'Chipset X670E con PCIe 5.0 completo en GPU y NVMe para workstations.', 'IMPORTADOR_DIRECTO', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 345.00, 1380.00, 'USD', 25, 'Garantía oficial 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','AM5 / AMD X670E'),(v_prod_id,'Formato','ATX'),(v_prod_id,'Memoria Soportada','DDR5 (4 slots)'),(v_prod_id,'Conectividad','Wi-Fi 6E + 2.5Gb LAN');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-asus-rog-x670ef.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'MSI PRO H610M-G DDR4 Micro-ATX LGA1700', 'Placa de entrada corporativa compatible con Intel Core 12ª/13ª/14ª generación.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x15', '15 unidades', '1 caja (15 unid.)', 76.00, 1140.00, 'USD', 230, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','LGA 1700 / Intel H610'),(v_prod_id,'Formato','Micro-ATX'),(v_prod_id,'Memoria Soportada','DDR4 (2 slots)'),(v_prod_id,'Salidas Video','HDMI + DisplayPort + VGA');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-msi-pro-h610m-g.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'motherboard', 'ASRock B650I Lightning WiFi Mini-ITX AM5', 'Formato compacto Mini-ITX con Wi-Fi 6E y doble M.2 para equipos SFF.', 'IMPORTADOR_DIRECTO', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 195.00, 975.00, 'USD', 30, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Socket / Chipset','AM5 / AMD B650'),(v_prod_id,'Formato','Mini-ITX'),(v_prod_id,'Memoria Soportada','DDR5 (2 slots)'),(v_prod_id,'Conectividad','Wi-Fi 6E + 2.5Gb LAN');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'mb-asrock-b650i-itx.jpg', 1);

    -- ========================================================================
    -- CATEGORÍA 6: HDD (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'Seagate BarraCuda 2TB 3.5" SATA III 7200RPM', 'Disco mecánico estándar para PCs de escritorio y almacenamiento secundario.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x20', '20 unidades', '1 caja (20 unid.)', 52.00, 1040.00, 'USD', 250, 'Garantía 2 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','2 TB'),(v_prod_id,'Velocidad','7200 RPM'),(v_prod_id,'Caché','256 MB'),(v_prod_id,'Formato','3.5 pulgadas SATA III');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-seagate-barracuda-2tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'WD Blue 1TB 3.5" SATA III 7200RPM', 'Unidad confiable de escritorio para oficinas y puntos de venta.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x20', '20 unidades', '1 caja (20 unid.)', 41.00, 820.00, 'USD', 300, 'Garantía 2 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','1 TB'),(v_prod_id,'Velocidad','7200 RPM'),(v_prod_id,'Caché','64 MB'),(v_prod_id,'Formato','3.5 pulgadas SATA III');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-wd-blue-1tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'WD Purple 4TB Videovigilancia 24/7 SATA III', 'Optimizado para grabadores NVR/DVR de seguridad con soporte hasta 64 cámaras HD.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x20', '20 unidades', '1 caja (20 unid.)', 92.00, 1840.00, 'USD', 180, 'Garantía 3 años WD.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','4 TB'),(v_prod_id,'Uso','Videovigilancia 24/7'),(v_prod_id,'Tecnología','AllFrame AI'),(v_prod_id,'Carga Anual','180 TB/año');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-wd-purple-4tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'Seagate SkyHawk 6TB Videovigilancia SATA III', 'Disco duro para sistemas CCTV empresariales con sensores de vibración rotacional.', 'MAYORISTA_PURO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 135.00, 1350.00, 'USD', 110, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','6 TB'),(v_prod_id,'Uso','Videovigilancia 24/7'),(v_prod_id,'Caché','256 MB'),(v_prod_id,'Carga Anual','180 TB/año');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-seagate-skyhawk-6tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'Seagate IronWolf 4TB NAS CMR 3.5"', 'Disco CMR especializado para arreglos RAID en servidores NAS de hasta 8 bahías.', 'IMPORTADOR_DIRECTO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 104.00, 1040.00, 'USD', 95, 'Garantía 3 años + Rescue Data.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','4 TB'),(v_prod_id,'Grabación','CMR (RAID Ready)'),(v_prod_id,'Uso','Servidores NAS 24/7'),(v_prod_id,'Caché','256 MB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-seagate-ironwolf-4tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'WD Red Plus 8TB NAS CMR 3.5"', 'Almacenamiento empresarial de alta capacidad para NAS PyME y servidores de archivos.', 'IMPORTADOR_DIRECTO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 188.00, 1880.00, 'USD', 60, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','8 TB'),(v_prod_id,'Grabación','CMR'),(v_prod_id,'Velocidad','5640 RPM'),(v_prod_id,'Caché','256 MB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-wd-redplus-8tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'Seagate Exos X18 16TB Enterprise 7200RPM', 'Disco de grado centro de datos con relleno de helio y MTBF de 2.5 millones de horas.', 'IMPORTADOR_DIRECTO', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 278.00, 1390.00, 'USD', 40, 'Garantía Enterprise 5 años.', 'ACTIVO', false, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','16 TB'),(v_prod_id,'Velocidad','7200 RPM'),(v_prod_id,'Carga Anual','550 TB/año'),(v_prod_id,'MTBF','2.5M horas');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-seagate-exos-16tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'Toshiba P300 2TB 3.5" SATA III 7200RPM', 'Disco interno de alto desempeño para PCs de escritorio y estaciones de diseño.', 'MAYORISTA_PURO', 'Caja Master x20', '20 unidades', '1 caja (20 unid.)', 51.00, 1020.00, 'USD', 150, 'Garantía 2 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','2 TB'),(v_prod_id,'Velocidad','7200 RPM'),(v_prod_id,'Caché','64 MB'),(v_prod_id,'Sensor','Protección de choque');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-toshiba-p300-2tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'Toshiba N300 10TB NAS Enterprise 7200RPM', 'Diseñado para servidores NAS multi-usuario con operación continua 24/7.', 'IMPORTADOR_DIRECTO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 215.00, 2150.00, 'USD', 45, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','10 TB'),(v_prod_id,'Velocidad','7200 RPM'),(v_prod_id,'Caché','256 MB'),(v_prod_id,'Uso','NAS hasta 8 bahías');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-toshiba-n300-10tb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'hdd', 'WD Elements 4TB Disco Externo USB 3.0', 'Almacenamiento portátil Plug-and-Play para copias de seguridad corporativas.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 96.00, 960.00, 'USD', 120, 'Garantía 2 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','4 TB'),(v_prod_id,'Interfaz','USB 3.0'),(v_prod_id,'Formato','2.5" Portátil'),(v_prod_id,'Alimentación','Por bus USB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'hdd-wd-elements-4tb-ext.jpg', 1);

    -- ========================================================================
    -- CATEGORÍA 7: PSU (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'Corsair RM750e 750W 80 Plus Gold Modular ATX 3.0', 'Fuente totalmente modular compatible con PCIe 5.0 y cable 12VHPWR incluido.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 98.00, 490.00, 'USD', 110, 'Garantía Corsair 7 años.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','750 W'),(v_prod_id,'Certificación','80 Plus Gold'),(v_prod_id,'Modularidad','Full Modular'),(v_prod_id,'Estándar','ATX 3.0 / PCIe 5.0');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-corsair-rm750e-750w.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'Corsair RM850x 850W 80 Plus Gold Full Modular', 'Capacitores japoneses 105°C y ventilador de levitación magnética ultra silencioso.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 132.00, 528.00, 'USD', 80, 'Garantía Corsair 10 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','850 W'),(v_prod_id,'Certificación','80 Plus Gold'),(v_prod_id,'Modularidad','Full Modular'),(v_prod_id,'Capacitores','100% Japoneses 105°C');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-corsair-rm850x-850w.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'MSI MAG A650BN 650W 80 Plus Bronze', 'Fuente confiable de gama media con protecciones OCP, OVP, OPP, OTP y SCP.', 'MAYORISTA_PURO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 54.00, 540.00, 'USD', 220, 'Garantía MSI 5 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','650 W'),(v_prod_id,'Certificación','80 Plus Bronze'),(v_prod_id,'Modularidad','No Modular'),(v_prod_id,'Ventilador','120mm Low Noise');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-msi-a650bn-650w.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'EVGA 600 BR 600W 80 Plus Bronze', 'Fuente estable para equipos de oficina y workstations básicas con GPU dedicada.', 'MAYORISTA_PURO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 49.00, 490.00, 'USD', 190, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','600 W'),(v_prod_id,'Certificación','80 Plus Bronze'),(v_prod_id,'Riel +12V','50A'),(v_prod_id,'Protecciones','OVP / UVP / OCP / SCP');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-evga-600br-600w.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'Seasonic Focus GX-850 850W 80 Plus Gold ATX 3.0', 'Plataforma Seasonic de referencia con control híbrido de ventilador.', 'IMPORTADOR_DIRECTO', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 138.00, 690.00, 'USD', 55, 'Garantía Seasonic 10 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','850 W'),(v_prod_id,'Certificación','80 Plus Gold'),(v_prod_id,'Modularidad','Full Modular'),(v_prod_id,'Estándar','ATX 3.0');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-seasonic-gx850.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'ASUS TUF Gaming 1000W 80 Plus Gold ATX 3.0', 'PCB con revestimiento conformado contra humedad y polvo para máxima durabilidad.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 175.00, 700.00, 'USD', 40, 'Garantía ASUS 10 años.', 'ACTIVO', false, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','1000 W'),(v_prod_id,'Certificación','80 Plus Gold'),(v_prod_id,'Modularidad','Full Modular'),(v_prod_id,'Conector GPU','12VHPWR 600W');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-asus-tuf-1000w.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'Cooler Master MWE Gold 750 V2 Full Modular', 'Eficiencia del 90% con dos conectores EPS para placas madre de workstation.', 'MAYORISTA_PURO', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 89.00, 445.00, 'USD', 90, 'Garantía 5 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','750 W'),(v_prod_id,'Certificación','80 Plus Gold'),(v_prod_id,'Modularidad','Full Modular'),(v_prod_id,'Ventilador','120mm HDB');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-coolermaster-mwe750.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'Gigabyte UD850GM PG5 850W 80 Plus Gold', 'Diseño Ultra Durable con cable nativo PCIe Gen 5.0 16-pin.', 'IMPORTADOR_DIRECTO', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 108.00, 540.00, 'USD', 70, 'Garantía 5 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','850 W'),(v_prod_id,'Certificación','80 Plus Gold'),(v_prod_id,'Modularidad','Full Modular'),(v_prod_id,'Estándar','PCIe 5.0 Ready');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-gigabyte-ud850gm.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'Corsair HX1200i 1200W 80 Plus Platinum ATX 3.0', 'Fuente digital Platinum para servidores de IA y multi-GPU.', 'IMPORTADOR_DIRECTO', 'Caja Master x2', '2 unidades', '1 caja (2 unid.)', 265.00, 530.00, 'USD', 20, 'Garantía Corsair 10 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','1200 W'),(v_prod_id,'Certificación','80 Plus Platinum'),(v_prod_id,'Modularidad','Full Modular'),(v_prod_id,'Monitoreo','Corsair iCUE Digital');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-corsair-hx1200i.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'psu', 'Thermaltake Smart 500W 80 Plus White', 'Fuente económica certificada para PCs de oficina sin tarjeta gráfica de alto consumo.', 'MAYORISTA_PURO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 38.00, 380.00, 'USD', 260, 'Garantía 5 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Potencia','500 W'),(v_prod_id,'Certificación','80 Plus White'),(v_prod_id,'Modularidad','No Modular'),(v_prod_id,'Ventilador','120mm Ultra Quiet');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'psu-thermaltake-smart-500w.jpg', 1);

    -- ========================================================================
    -- CATEGORÍA 8: USB (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'Kingston DataTraveler Exodia 64GB USB 3.2 Gen 1', 'Memoria USB de alta rotación con capuchón protector y aro para llavero.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x50', '50 unidades', '1 caja (50 unid.)', 4.80, 240.00, 'USD', 800, 'Garantía 5 años Kingston.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','64 GB'),(v_prod_id,'Interfaz','USB 3.2 Gen 1'),(v_prod_id,'Conector','USB Tipo-A'),(v_prod_id,'Peso','11 g');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-kingston-exodia-64gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'Kingston DataTraveler Exodia M 128GB USB 3.2', 'Diseño con tapa deslizante para transporte seguro de archivos corporativos.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x50', '50 unidades', '1 caja (50 unid.)', 8.50, 425.00, 'USD', 600, 'Garantía 5 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','128 GB'),(v_prod_id,'Interfaz','USB 3.2 Gen 1'),(v_prod_id,'Diseño','Capuchón Deslizante'),(v_prod_id,'Compatibilidad','Windows / macOS / Linux');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-kingston-exodia-m-128gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'SanDisk Ultra Flair 64GB USB 3.0 Metálica', 'Carcasa metálica resistente con velocidades de lectura hasta 150 MB/s.', 'MAYORISTA_PURO', 'Caja Master x50', '50 unidades', '1 caja (50 unid.)', 6.20, 310.00, 'USD', 500, 'Garantía 5 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','64 GB'),(v_prod_id,'Interfaz','USB 3.0'),(v_prod_id,'Lectura Máx.','150 MB/s'),(v_prod_id,'Material','Carcasa Metálica');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-sandisk-ultraflair-64gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'SanDisk Ultra Dual Drive Go 128GB USB-C + USB-A', 'Conector giratorio doble para transferir datos entre smartphones USB-C y PCs.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x25', '25 unidades', '1 caja (25 unid.)', 11.80, 295.00, 'USD', 350, 'Garantía 5 años.', 'ACTIVO', false, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','128 GB'),(v_prod_id,'Conectores','USB Tipo-C + USB Tipo-A'),(v_prod_id,'Interfaz','USB 3.2 Gen 1'),(v_prod_id,'Lectura Máx.','400 MB/s');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-sandisk-dual-128gb-usbc.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'Kingston DataTraveler Duo 64GB USB-A y USB-C', 'Unidad flash dual compatible con puertos tradicionales y laptops modernas USB-C.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x30', '30 unidades', '1 caja (30 unid.)', 7.40, 222.00, 'USD', 420, 'Garantía 5 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','64 GB'),(v_prod_id,'Conectores','USB-A + USB-C'),(v_prod_id,'Interfaz','USB 3.2 Gen 1'),(v_prod_id,'Tapa','Doble capuchón deslizante');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-kingston-duo-64gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'Kingston Canvas Select Plus 128GB MicroSDXC + Adaptador', 'Tarjeta MicroSD Clase 10 UHS-I V10 para cámaras de seguridad, tablets y drones.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x50', '50 unidades', '1 caja (50 unid.)', 8.90, 445.00, 'USD', 550, 'Garantía de por vida.', 'ACTIVO', true, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','128 GB'),(v_prod_id,'Clase','Class 10 / UHS-I / A1'),(v_prod_id,'Lectura Máx.','100 MB/s'),(v_prod_id,'Incluye','Adaptador SD');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-kingston-microsd-128gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'SanDisk Extreme Pro 256GB MicroSDXC U3 V30 A2', 'Alto rendimiento para grabación de video 4K UHD y cámaras profesionales.', 'IMPORTADOR_DIRECTO', 'Caja Master x25', '25 unidades', '1 caja (25 unid.)', 24.50, 612.50, 'USD', 200, 'Garantía de por vida.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','256 GB'),(v_prod_id,'Velocidad Video','U3 / V30 / A2'),(v_prod_id,'Lectura Máx.','200 MB/s'),(v_prod_id,'Escritura Máx.','140 MB/s');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-sandisk-extremepro-256gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'Samsung EVO Plus 128GB MicroSDXC con Adaptador', 'Resistente al agua, temperaturas extremas, rayos X e imanes.', 'MAYORISTA_PURO', 'Caja Master x40', '40 unidades', '1 caja (40 unid.)', 10.50, 420.00, 'USD', 380, 'Garantía 10 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','128 GB'),(v_prod_id,'Clase','U3 / V30 / A2'),(v_prod_id,'Lectura Máx.','130 MB/s'),(v_prod_id,'Incluye','Adaptador SD');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-samsung-evoplus-128gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'ADATA UV128 32GB USB 3.2 Retráctil', 'Unidad flash económica sin tapa para entregas promocionales o corporativas.', 'MAYORISTA_PURO', 'Caja Master x100', '100 unidades', '1 caja (100 unid.)', 3.40, 340.00, 'USD', 1000, 'Garantía 5 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','32 GB'),(v_prod_id,'Interfaz','USB 3.2 Gen 1'),(v_prod_id,'Mecanismo','Conector Retráctil'),(v_prod_id,'Color','Negro / Azul');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-adata-uv128-32gb.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'usb', 'Lexar JumpDrive S80 256GB USB 3.1', 'Alta capacidad en formato portátil para respaldos rápidos en campo.', 'IMPORTADOR_DIRECTO', 'Caja Master x25', '25 unidades', '1 caja (25 unid.)', 15.20, 380.00, 'USD', 210, 'Garantía 3 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Capacidad','256 GB'),(v_prod_id,'Interfaz','USB 3.1 Gen 1'),(v_prod_id,'Lectura Máx.','150 MB/s'),(v_prod_id,'Seguridad','Cifrado AES 256-bit');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'usb-lexar-s80-256gb.jpg', 1);

    -- ========================================================================
    -- CATEGORÍA 9: COOLING (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'Cooler Master Hyper 212 Black Edition', 'Disipador torre de 4 heatpipes de cobre con ventilador Silencio FP120.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 36.00, 360.00, 'USD', 160, 'Garantía 2 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Tipo','Torre por Aire 120mm'),(v_prod_id,'Heatpipes','4x Cobre Contacto Directo'),(v_prod_id,'Compatibilidad','LGA1700 / AM5 / AM4'),(v_prod_id,'Altura','158.8 mm');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-cm-hyper212-black.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'DeepCool AK400 Digital Negro Display Temperatura', 'Disipador torre con pantalla digital en tiempo real de temperatura y uso de CPU.', 'IMPORTADOR_DIRECTO', 'Caja Master x10', '10 unidades', '1 caja (10 unid.)', 39.00, 390.00, 'USD', 130, 'Garantía 3 años.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Tipo','Torre por Aire + Display'),(v_prod_id,'Capacidad TDP','220 W'),(v_prod_id,'Ventilador','120mm FDB PWM'),(v_prod_id,'Compatibilidad','LGA1700 / AM5 / AM4');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-deepcool-ak400-digital.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'Noctua NH-D15 chromax.black Doble Torre', 'El referente absoluto en refrigeración por aire silenciosa para workstations.', 'IMPORTADOR_DIRECTO', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 108.00, 540.00, 'USD', 45, 'Garantía Noctua 6 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Tipo','Doble Torre 140mm'),(v_prod_id,'Ventiladores','2x NF-A15 HS-PWM'),(v_prod_id,'Nivel Ruido','24.6 dB(A)'),(v_prod_id,'Altura','165 mm');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-noctua-nhd15-black.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'Corsair iCUE H100i RGB Elite 240mm Líquida AIO', 'Refrigeración líquida todo en uno de 240mm con placa fría de cobre optimizada.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 124.00, 620.00, 'USD', 65, 'Garantía Corsair 5 años.', 'ACTIVO', false, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Radiador','240 mm Aluminio'),(v_prod_id,'Ventiladores','2x AF120 ELITE PWM'),(v_prod_id,'Iluminación','RGB Bomba'),(v_prod_id,'Compatibilidad','LGA1700 / AM5 / AM4');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-corsair-h100i-240mm.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'NZXT Kraken 360 Black Refrigeración Líquida AIO', 'Radiador de 360mm con pantalla LCD personalizable en la bomba.', 'IMPORTADOR_DIRECTO', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 168.00, 672.00, 'USD', 35, 'Garantía NZXT 6 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Radiador','360 mm'),(v_prod_id,'Pantalla Bomba','LCD 1.54" 240x240'),(v_prod_id,'Ventiladores','3x F120P Static Pressure'),(v_prod_id,'TDP Soportado','300W+');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-nzxt-kraken-360.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'MSI MAG CoreLiquid 240R V2 AIO ARGB', 'Bomba integrada en el radiador para reducir vibraciones y ruido en el CPU.', 'DISTRIBUIDOR_OFICIAL', 'Caja Master x5', '5 unidades', '1 caja (5 unid.)', 89.00, 445.00, 'USD', 80, 'Garantía 3 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Radiador','240 mm'),(v_prod_id,'Iluminación','ARGB 5V 3-pin'),(v_prod_id,'Velocidad Bomba','4200 RPM'),(v_prod_id,'Compatibilidad','LGA1700 / AM5 / AM4');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-msi-coreliquid-240r.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'Arctic Liquid Freezer III 360 Negro AIO', 'Incluye ventilador VRM en la bomba y radiador grueso de 38mm para alto TDP.', 'IMPORTADOR_DIRECTO', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 105.00, 420.00, 'USD', 50, 'Garantía Arctic 6 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Radiador','360 mm (38mm grosor)'),(v_prod_id,'Ventiladores','3x P12 PWM'),(v_prod_id,'Extra','Ventilador VRM integrado'),(v_prod_id,'Pasta Incluida','MX-6');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-arctic-freezer3-360.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'DeepCool LS720 360mm ARGB Líquida', 'Bomba de 4ª generación de alto flujo con espejo infinito ARGB.', 'MAYORISTA_PURO', 'Caja Master x4', '4 unidades', '1 caja (4 unid.)', 112.00, 448.00, 'USD', 55, 'Garantía 5 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Radiador','360 mm'),(v_prod_id,'Capacidad TDP','300 W'),(v_prod_id,'Ventiladores','3x FC120 A-RGB'),(v_prod_id,'Velocidad Bomba','3100 RPM');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-deepcool-ls720-360.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'Lian Li UNI FAN SL-INF 120mm Pack x3 + Controlador', 'Ventiladores modulares encadenables sin cables intermedios con espejo infinito.', 'IMPORTADOR_DIRECTO', 'Caja Master x10 Packs', '10 packs', '1 caja (10 packs)', 84.00, 840.00, 'USD', 70, 'Garantía 2 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Tamaño','3x 120 mm'),(v_prod_id,'Conexión','Daisy-Chain Pin-to-Pin'),(v_prod_id,'Flujo de Aire','61.3 CFM'),(v_prod_id,'Controlador','L-Connect 3 Incluido');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-lianli-unifan-3pack.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cooling', 'Arctic MX-4 4g Pasta Térmica Profesional (Pack x20)', 'Compuesto térmico a base de micropartículas de carbono no conductor eléctrico.', 'MAYORISTA_PURO', 'Caja Master x20 Jeringas', '20 jeringas', '1 caja (20 jeringas)', 5.20, 104.00, 'USD', 500, 'Durabilidad 8 años aplicada.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Peso Neto','4 gramos c/u'),(v_prod_id,'Conductividad','8.5 W/mK'),(v_prod_id,'Conductividad Eléctrica','No conductiva'),(v_prod_id,'Viscosidad','870 Poise');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'cool-arctic-mx4-4g.jpg', 1);

    -- ========================================================================
    -- CATEGORÍA 10: CASES (10 productos)
    -- ========================================================================
    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'Corsair 4000D Airflow Mid-Tower ATX Negro', 'Chasis de alto flujo de aire con panel frontal perforado y gestión de cables RapidRoute.', 'DISTRIBUIDOR_OFICIAL', 'Pallet x6 Cajas', '6 unidades', '1 pallet (6 unid.)', 92.00, 552.00, 'USD', 90, 'Garantía Corsair 2 años.', 'ACTIVO', true, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Mid-Tower ATX'),(v_prod_id,'Longitud Máx. GPU','360 mm'),(v_prod_id,'Ventiladores Incluidos','2x 120mm AirGuide'),(v_prod_id,'Panel Lateral','Vidrio Templado');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-corsair-4000d-airflow.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'NZXT H5 Flow Mid-Tower ATX Negro Mate', 'Incluye ventilador inferior dedicado en ángulo hacia la GPU para máxima refrigeración.', 'IMPORTADOR_DIRECTO', 'Pallet x6 Cajas', '6 unidades', '1 pallet (6 unid.)', 88.00, 528.00, 'USD', 75, 'Garantía NZXT 2 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Mid-Tower ATX'),(v_prod_id,'Longitud Máx. GPU','365 mm'),(v_prod_id,'Ventiladores Incluidos','2x F120Q'),(v_prod_id,'Puertos Frontales','1x USB-C, 1x USB-A');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-nzxt-h5-flow.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'Lian Li O11 Dynamic EVO Mid-Tower Vidrio Templado', 'Chasis de doble cámara reversible para ensamblajes premium y exhibición.', 'IMPORTADOR_DIRECTO', 'Pallet x4 Cajas', '4 unidades', '1 pallet (4 unid.)', 155.00, 620.00, 'USD', 40, 'Garantía 2 años.', 'ACTIVO', true, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Mid-Tower Doble Cámara'),(v_prod_id,'Soporte Placas','E-ATX / ATX / mATX'),(v_prod_id,'Longitud Máx. GPU','426 mm'),(v_prod_id,'Radiadores','Hasta 3x 360mm');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-lianli-o11d-evo.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'MSI MAG Forge 100R Mid-Tower ARGB', 'Excelente costo-beneficio con 2 ventiladores ARGB frontales y 1 trasero incluidos.', 'DISTRIBUIDOR_OFICIAL', 'Pallet x8 Cajas', '8 unidades', '1 pallet (8 unid.)', 58.00, 464.00, 'USD', 140, 'Garantía 2 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Mid-Tower ATX'),(v_prod_id,'Ventiladores Incluidos','2x 120mm ARGB + 1x 120mm'),(v_prod_id,'Longitud Máx. GPU','330 mm'),(v_prod_id,'Panel Lateral','Vidrio Templado 4mm');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-msi-mag-forge100r.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'Cooler Master MasterBox Q300L Micro-ATX', 'Chasis compacto con filtros magnéticos antipolvo y panel I/O reubicable.', 'MAYORISTA_PURO', 'Pallet x10 Cajas', '10 unidades', '1 pallet (10 unid.)', 42.00, 420.00, 'USD', 180, 'Garantía 2 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Micro-ATX / Mini-ITX'),(v_prod_id,'Longitud Máx. GPU','360 mm'),(v_prod_id,'Altura Máx. Cooler','159 mm'),(v_prod_id,'Filtros','Magnéticos Front/Top/Bottom');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-cm-q300l-matx.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'DeepCool CC560 V2 Mid-Tower ATX (4 Ventiladores)', 'Incluye 4 ventiladores preinstalados para ensamblajes rápidos de alto volumen.', 'MAYORISTA_PURO', 'Pallet x8 Cajas', '8 unidades', '1 pallet (8 unid.)', 52.00, 416.00, 'USD', 150, 'Garantía 2 años.', 'ACTIVO', false, true, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Mid-Tower ATX'),(v_prod_id,'Ventiladores Incluidos','4x 120mm LED'),(v_prod_id,'Longitud Máx. GPU','370 mm'),(v_prod_id,'Soporte Radiador','Hasta 360mm Frontal');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-deepcool-cc560.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'ASUS TUF Gaming GT501 Full-Tower E-ATX', 'Acero galvanizado de hasta 1.5mm con asas de algodón tejidas para transporte.', 'DISTRIBUIDOR_OFICIAL', 'Pallet x4 Cajas', '4 unidades', '1 pallet (4 unid.)', 145.00, 580.00, 'USD', 32, 'Garantía ASUS 2 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Full-Tower E-ATX'),(v_prod_id,'Ventiladores Incluidos','3x 120mm AURA + 1x 140mm'),(v_prod_id,'Longitud Máx. GPU','420 mm'),(v_prod_id,'Material','Acero 1.5mm + Vidrio');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-asus-tuf-gt501.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'NZXT H9 Flow Dual-Chamber Blanco ATX', 'Vista panorámica sin pilar frontal con capacidad para 10 ventiladores.', 'IMPORTADOR_DIRECTO', 'Pallet x4 Cajas', '4 unidades', '1 pallet (4 unid.)', 152.00, 608.00, 'USD', 36, 'Garantía 2 años.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Mid-Tower Doble Cámara'),(v_prod_id,'Ventiladores Incluidos','4x 120mm F120Q'),(v_prod_id,'Longitud Máx. GPU','435 mm'),(v_prod_id,'Color','Blanco Mate');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-nzxt-h9-flow-white.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'Corsair 3000D Airflow Mid-Tower ATX', 'Versión optimizada para presupuestos corporativos y gaming con soporte de GPUs de 360mm.', 'DISTRIBUIDOR_OFICIAL', 'Pallet x6 Cajas', '6 unidades', '1 pallet (6 unid.)', 76.00, 456.00, 'USD', 110, 'Garantía 2 años.', 'ACTIVO', false, false, true, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Mid-Tower ATX'),(v_prod_id,'Ventiladores Incluidos','2x SP120 ELITE'),(v_prod_id,'Longitud Máx. GPU','360 mm'),(v_prod_id,'Panel Lateral','Vidrio Templado');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-corsair-3000d-airflow.jpg', 1);

    INSERT INTO productos (uuid, proveedor_id, categoria_id, titulo, descripcion, modelo_comercial, tipo_formato, unidades_por_paquete, pedido_minimo, precio_unitario_ref, precio_total_ref, moneda, stock_disponible, terminos_comerciales, estado, es_recomendado, es_promocionado, tiene_oferta, fecha_publicacion, fecha_actualizacion)
    VALUES (gen_random_uuid(), v_prov_id, 'cases', 'Antryx FX 620 Mesh Office Micro-ATX', 'Gabinete sobrio metálico para licitaciones y oficinas corporativas sin iluminación RGB.', 'MAYORISTA_PURO', 'Pallet x10 Cajas', '10 unidades', '1 pallet (10 unid.)', 34.00, 340.00, 'USD', 250, 'Garantía 1 año.', 'ACTIVO', false, false, false, NOW(), NOW())
    RETURNING id INTO v_prod_id;
    INSERT INTO producto_especificaciones (producto_id, clave, valor) VALUES (v_prod_id,'Factor de Forma','Micro-ATX Corporativo'),(v_prod_id,'Panel Lateral','Sólido Metálico'),(v_prod_id,'Ventilador Incluido','1x 120mm Trasero'),(v_prod_id,'Bahías','2x 3.5" + 2x 2.5"');
    INSERT INTO imagenes_producto (producto_id, url_imagen, orden) VALUES (v_prod_id, v_base_url || 'case-antryx-fx620-office.jpg', 1);

END $$;

COMMIT;