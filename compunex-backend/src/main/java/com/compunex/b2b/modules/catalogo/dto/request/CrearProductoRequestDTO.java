package com.compunex.b2b.modules.catalogo.dto.request;

import com.compunex.b2b.modules.catalogo.entity.ModeloComercial;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record CrearProductoRequestDTO(
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 500, message = "El título no puede superar los 500 caracteres")
    String titulo,

    @NotBlank(message = "El ID de categoría es obligatorio")
    String categoriaId,

    @NotEmpty(message = "Debe enviar al menos una URL de imagen")
    List<String> urlsImagen,

    @NotNull(message = "El modelo comercial es obligatorio")
    ModeloComercial modeloComercial,

    @NotBlank(message = "El tipo de formato es obligatorio")
    String tipoFormato,

    @NotBlank(message = "Las unidades por paquete son obligatorias")
    String unidadesPorPaquete,

    @NotBlank(message = "El pedido mínimo es obligatorio")
    String pedidoMinimo,

    @NotNull(message = "El precio unitario de referencia es obligatorio")
    @Positive(message = "El precio unitario de referencia debe ser mayor a 0")
    BigDecimal precioUnitarioRef,

    BigDecimal precioTotalRef,

    String moneda,

    Map<String, String> especificaciones,

    String descripcion,

    String terminosComerciales
) {}
