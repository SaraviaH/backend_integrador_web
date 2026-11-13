package com.compunex.b2b.modules.ordenes.dto.request;

import com.compunex.b2b.modules.ordenes.entity.EstadoSuborden;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CambiarEstadoDespachoDTO {

    @NotNull(message = "El nuevo estado de despacho es obligatorio")
    private EstadoSuborden nuevoEstado;
}
