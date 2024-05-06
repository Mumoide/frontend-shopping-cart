import martillo_img from './Herramientas Manuales/Martillo.jpg';
import destornillador_img from './Herramientas Manuales/destornillador.jpg'
import llaves_img from './Herramientas Manuales/Llaves.jpg'
import taladro_img from './Herramientas electricas/Taladro.jpg'
import sierra_img from './Herramientas electricas/Sierra.jpg'
import lijadora_img from './Herramientas electricas/Lijadora.jpg'
import acabado_img from './Materiales de construccion/Acabados.jpg'
import arena_img from './Materiales de construccion/Arena.jpeg'
import barniz_img from './Materiales de construccion/Barniz.jpg'
import cemento_img from './Materiales de construccion/Cemento.jpg'
import ceramica_img from './Materiales de construccion/Ceramicas.png'
import ladrillos_img from './Materiales de construccion/Ladrillos.png'
import pinturas_img from './Materiales de construccion/Pinturas.jpg'
import casco_img from './Seguridad/Casco.jpg'
import guantes_img from './Seguridad/Guantes.jpg'
import lentes_img from './Seguridad/Lentesdeseguridad.jpeg'
import fijacion_img from './Accesorios varios/Adhesivosyfijaciones.jpg'
import medicion_img from './Accesorios varios/Equiposdemedicion.jpg'
import tornillo_img from './Accesorios varios/Tornillosyanclajes.jpg'

let all_products = [
    {
        id: 1,
        name: 'Martillo',
        category: 'Herramientas manuales',
        image: martillo_img,
        new_price: 5000,
        old_price: 7500
    },
    {
        id: 2,
        name: 'Destornillador',
        category: 'Herramientas manuales',
        image: destornillador_img,
        new_price: 3000,
        old_price: 5000
    },
    {
        id: 3,
        name: 'Llaves',
        category: 'Herramientas manuales',
        image: llaves_img,
        new_price: 4000,
        old_price: 6000
    },
    {
        id: 4,
        name: 'Taladro',
        category: 'Herramientas electricas',
        image: taladro_img,
        new_price: 20000,
        old_price: 30000
    },
    {
        id: 5,
        name: 'Sierra',
        category: 'Herramientas electricas',
        image: sierra_img,
        new_price: 15000,
        old_price: 20000
    },
    {
        id: 6,
        name: 'Lijadora',
        category: 'Herramientas electricas',
        image: lijadora_img,
        new_price: 5000,
        old_price: 7500
    },
    {
        id: 7,
        name: 'Acabado',
        category: 'Materiales de construccion',
        image: acabado_img,
        new_price: 5000,
        old_price: 7500
    },
    {
        id: 8,
        name: 'Arena',
        category: 'Materiales de construccion',
        image: arena_img,
        new_price: 2000,
        old_price: 3500
    },
    {
        id: 9,
        name: 'Barniz',
        category: 'Materiales de construccion',
        image: barniz_img,
        new_price: 6000,
        old_price: 8000
    },
    {
        id: 10,
        name: 'Cemento',
        category: 'Materiales de construccion',
        image: cemento_img,
        new_price: 9000,
        old_price: 12000
    },
    {
        id: 11,
        name: 'Ceramica',
        category: 'Materiales de construccion',
        image: ceramica_img,
        new_price: 7500,
        old_price: 9500
    },
    {
        id: 12,
        name: 'Ladrillo',
        category: 'Materiales de construccion',
        image: ladrillos_img,
        new_price: 10000,
        old_price: 12500
    },
    {
        id: 13,
        name: 'Pintura',
        category: 'Materiales de construccion',
        image: pinturas_img,
        new_price: 9000,
        old_price: 11500
    },
    {
        id: 14,
        name: 'Casco',
        category: 'Seguridad',
        image: casco_img,
        new_price: 7500,
        old_price: 9000
    },
    {
        id: 15,
        name: 'Guantes',
        category: 'Seguridad',
        image: guantes_img,
        new_price: 3000,
        old_price: 5000
    },
    {
        id: 16,
        name: 'Lentes',
        category: 'Seguridad',
        image: lentes_img,
        new_price: 6500,
        old_price: 8000
    },
    {
        id: 17,
        name: 'Adhesivos y fijaciones',
        category: 'Accesorios varios',
        image: fijacion_img,
        new_price: 5000,
        old_price: 7500
    },
    {
        id: 18,
        name: 'Equipos de medicion',
        category: 'Accesorios varios',
        image: medicion_img,
        new_price: 7500,
        old_price: 9000
    },
    {
        id: 19,
        name: 'Tornillos y anclajes',
        category: 'Accesorios varios',
        image: tornillo_img,
        new_price: 1000,
        old_price: 1500
    }
]

export default all_products;