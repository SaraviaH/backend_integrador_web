package com.compunex.b2b.config;

import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.entity.*;
import com.compunex.b2b.modules.catalogo.repository.CategoriaRepository;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    // =========================================================================
    // 🔑 CREDENCIALES Y DATOS DE PRUEBA (VISIBLES PARA POSTMAN Y FRONTEND)
    // =========================================================================
    public static final String PROVEEDOR_EMAIL           = "ventas.mayoristas@technova.com";
    public static final String PROVEEDOR_PASSWORD        = "PasswordMayorista123!";
    public static final String PROVEEDOR_RAZON_SOCIAL    = "TechNova Mayorista S.A.C.";
    public static final String PROVEEDOR_RUC             = "20608945612";
    public static final String PROVEEDOR_TELEFONO        = "+51 987 654 321";
    public static final String PROVEEDOR_CIUDAD          = "Lima";
    // =========================================================================

    private final UsuarioRepository usuarioRepository;
    private final PerfilProveedorRepository perfilProveedorRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           PerfilProveedorRepository perfilProveedorRepository,
                           CategoriaRepository categoriaRepository,
                           ProductoRepository productoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.perfilProveedorRepository = perfilProveedorRepository;
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            log.info("[COMPUNEX-INIT] La base de datos ya contiene registros. Omitiendo seed data.");
            return;
        }

        log.info("[COMPUNEX-INIT] 🚀 Sembrando datos iniciales de prueba (Seed Data)...");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // 1. Crear Usuario Proveedor (Para login según contrato oficial)
        Usuario usuarioProveedor = new Usuario(
                PROVEEDOR_RAZON_SOCIAL,
                PROVEEDOR_EMAIL,
                encoder.encode(PROVEEDOR_PASSWORD),
                RolUsuario.PROVEEDOR,
                EstadoUsuario.ACTIVO
        );
        usuarioProveedor = usuarioRepository.save(usuarioProveedor);

        // 2. Crear Perfil de Proveedor
        PerfilProveedor perfil = new PerfilProveedor();
        perfil.setUsuario(usuarioProveedor);
        perfil.setIdentificacionFiscal(PROVEEDOR_RUC);
        perfil.setRazonSocial(PROVEEDOR_RAZON_SOCIAL);
        perfil.setNombreComercial("TechNova Hardware B2B");
        perfil.setTelefonoContacto(PROVEEDOR_TELEFONO);
        perfil.setUrlLogo("https://img.compunex.com/logos/technova.png");
        perfil.setUrlBanner("https://img.compunex.com/banners/technova.jpg");
        perfil.setDireccion("Av. Los Conquistadores 1234, San Isidro");
        perfil.setCiudad(PROVEEDOR_CIUDAD);
        perfil.setAnosMercado("8 años");
        perfil.setDescripcion("Importador y distribuidor mayorista autorizado de componentes de PC.");
        perfil.setPoliticaComercial("Despachos a nivel nacional. Pedido mínimo 500 USD.");
        perfil.setCalificacion(new BigDecimal("4.85"));
        perfil.setVerificado(true);
        perfil.setDestacado(true);
        perfil = perfilProveedorRepository.save(perfil);

        // 3. Crear Categorías y Subcategorías
        Categoria catRam = new Categoria("ram", "Memorias RAM", "memory", "Módulos de memoria DDR4 y DDR5 para PC y Servidores", EstadoCategoria.ACTIVA, 1);
        Subcategoria subRam1 = new Subcategoria(catRam, "DDR5 Desktop");
        Subcategoria subRam2 = new Subcategoria(catRam, "DDR4 Desktop");
        Subcategoria subRam3 = new Subcategoria(catRam, "DDR5 SO-DIMM Laptop");
        catRam.getSubcategorias().addAll(List.of(subRam1, subRam2, subRam3));
        categoriaRepository.save(catRam);

        Categoria catSsd = new Categoria("ssd", "Almacenamiento SSD", "storage", "Unidades de estado sólido NVMe M.2 y SATA III", EstadoCategoria.ACTIVA, 0);
        Subcategoria subSsd1 = new Subcategoria(catSsd, "NVMe M.2 PCIe 4.0");
        Subcategoria subSsd2 = new Subcategoria(catSsd, "NVMe M.2 PCIe 3.0");
        Subcategoria subSsd3 = new Subcategoria(catSsd, "SATA III 2.5\"");
        catSsd.getSubcategorias().addAll(List.of(subSsd1, subSsd2, subSsd3));
        categoriaRepository.save(catSsd);

        // 4. Crear Producto de Muestra
        Producto prod = new Producto();
        prod.setProveedor(perfil);
        prod.setCategoria(catRam);
        prod.setTitulo("Memoria RAM Kingston Fury Beast 16GB DDR5 5600MHz");
        prod.setDescripcion("Módulo de memoria DDR5 de alto rendimiento optimizado para plataformas Intel XMP 3.0 y AMD EXPO. Ideal para ensamblajes corporativos y gaming de gama alta.");
        prod.setModeloComercial(ModeloComercial.DISTRIBUIDOR_OFICIAL);
        prod.setTipoFormato("Caja Master x10 Blísteres");
        prod.setUnidadesPorPaquete("10 unidades");
        prod.setPedidoMinimo("1 caja (10 unidades)");
        prod.setPrecioUnitarioRef(new BigDecimal("52.50"));
        prod.setPrecioTotalRef(new BigDecimal("525.00"));
        prod.setMoneda("USD");
        prod.setTerminosComerciales("Garantía de 3 años directa con fabricante. Entrega en almacén Lima o envío a provincia con flete por pagar.");
        prod.setEstado(EstadoProducto.ACTIVO);
        prod.setEsRecomendado(true);
        prod.setEsPromocionado(false);
        prod.setTieneOferta(false);

        ProductoEspecificacion spec1 = new ProductoEspecificacion(prod, "Capacidad", "16 GB");
        ProductoEspecificacion spec2 = new ProductoEspecificacion(prod, "Frecuencia", "5600 MHz");
        ProductoEspecificacion spec3 = new ProductoEspecificacion(prod, "Latencia CAS", "CL36");
        ProductoEspecificacion spec4 = new ProductoEspecificacion(prod, "Voltaje", "1.25V");
        prod.getEspecificaciones().addAll(List.of(spec1, spec2, spec3, spec4));

        ImagenProducto img1 = new ImagenProducto(prod, "https://img.compunex.com/products/ram-kingston-16gb-front.jpg", (short) 1);
        ImagenProducto img2 = new ImagenProducto(prod, "https://img.compunex.com/products/ram-kingston-16gb-angle.jpg", (short) 2);
        prod.getImagenes().addAll(List.of(img1, img2));

        productoRepository.save(prod);

        log.info("[COMPUNEX-INIT] ✅ Base de datos sembrada con éxito: 1 Proveedor, 2 Categorías y 1 Producto con ficha técnica.");
    }
}
