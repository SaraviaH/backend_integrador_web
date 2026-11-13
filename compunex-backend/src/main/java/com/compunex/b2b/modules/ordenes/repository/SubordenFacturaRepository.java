package com.compunex.b2b.modules.ordenes.repository;

import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubordenFacturaRepository extends JpaRepository<SubordenFactura, Long> {

    Page<SubordenFactura> findByProveedorId(Long proveedorId, Pageable pageable);

    Optional<SubordenFactura> findByNumeroComprobante(String numeroComprobante);
}
