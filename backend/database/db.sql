CREATE DATABASE FERRAMAS

-- Create Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories Table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Create Products Table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    category_id INTEGER REFERENCES categories(category_id),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    status VARCHAR(50) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Order Details Table
CREATE TABLE order_details (
    order_detail_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    price_at_time_of_order DECIMAL(10, 2) NOT NULL
);

-- Create Cart Table
CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Cart Items Table
CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(cart_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL
);


-- Create Subscribers Table
CREATE TABLE newsletter_subscribers (
    SubscriberID SERIAL PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    SubscribedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert into categories
INSERT INTO categories (name, description) VALUES
('Herramientas manuales', 'Herramientas de uso manual para todo tipo de trabajos.'),
('Herramientas eléctricas', 'Herramientas impulsadas por motores eléctricos.'),
('Materiales de construcción', 'Materiales básicos para construcción y obra.'),
('Seguridad', 'Equipos y accesorios para garantizar la seguridad en trabajos.'),
('Accesorios varios', 'Diversos accesorios para complementar herramientas y tareas.');

-- Insert into products
INSERT INTO products (name, description, price, old_price, category_id, stock_quantity, image_path) VALUES
('Martillo', 'Martillo robusto para clavar y extraer clavos.', 5000, 7500, 1, 100, 'images/herramientas_manuales/martillo.jpg'),
('Destornillador', 'Herramienta manual para atornillar y desatornillar.', 3000, 5000, 1, 150, 'images/herramientas_manuales/destornillador.jpg'),
('Llaves', 'Set de llaves ajustables para diversas tareas mecánicas.', 4000, 6000, 1, 90, 'images/herramientas_manuales/llaves.jpg'),
('Taladro', 'Taladro eléctrico de alta potencia.', 20000, 30000, 2, 75, 'images/herramientas_electricas/taladro.jpg'),
('Sierra', 'Sierra eléctrica para cortar madera y otros materiales.', 15000, 20000, 2, 60, 'images/herramientas_electricas/sierra.jpg'),
('Lijadora', 'Lijadora eléctrica para acabados perfectos.', 5000, 7500, 2, 85, 'images/herramientas_electricas/lijadora.jpg'),
('Acabado', 'Productos de acabado para construcción y remodelación.', 5000, 7500, 3, 120, 'images/materiales_construccion/acabados.jpg'),
('Arena', 'Arena de alta calidad para construcción.', 2000, 3500, 3, 200, 'images/materiales_construccion/arena.jpeg'),
('Barniz', 'Barniz para protección y acabado de superficies.', 6000, 8000, 3, 110, 'images/materiales_construccion/barniz.jpg'),
('Cemento', 'Sacos de cemento de 50 kg para obra.', 9000, 12000, 3, 130, 'images/materiales_construccion/cemento.jpg'),
('Ceramica', 'Cerámicas de varios estilos y tamaños.', 7500, 9500, 3, 140, 'images/materiales_construccion/ceramicas.png'),
('Ladrillo', 'Ladrillos de arcilla de primera calidad.', 10000, 12500, 3, 180, 'images/materiales_construccion/ladrillos.png'),
('Pintura', 'Variedad de pinturas para interiores y exteriores.', 9000, 11500, 3, 160, 'images/materiales_construccion/pinturas.jpg'),
('Casco', 'Casco de seguridad industrial.', 7500, 9000, 4, 150, 'images/seguridad/casco.jpg'),
('Guantes', 'Guantes de seguridad resistentes.', 3000, 5000, 4, 200, 'images/seguridad/guantes.jpg'),
('Lentes', 'Lentes de protección para trabajos de riesgo.', 6500, 8000, 4, 170, 'images/seguridad/lentesdeseguridad.jpeg'),
('Adhesivos y fijaciones', 'Adhesivos fuertes y fijaciones seguras.', 5000, 7500, 5, 95, 'images/accesorios_varios/adhesivosyfijaciones.jpg'),
('Equipos de medición', 'Equipos para medición precisa en diversos trabajos.', 7500, 9000, 5, 65, 'images/accesorios_varios/equiposdemedicion.jpg'),
('Tornillos y anclajes', 'Tornillos y anclajes de alta resistencia.', 1000, 1500, 5, 210, 'images/accesorios_varios/tornillosyanclajes.jpg');

