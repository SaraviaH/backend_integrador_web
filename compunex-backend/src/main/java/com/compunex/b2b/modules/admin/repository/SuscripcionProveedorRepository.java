package com.compunex.b2b.modules.admin.repository;

import com.compunex.b2b.modules.admin.entity.SuscripcionProveedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SuscripcionProveedorRepository extends JpaRepository<SuscripcionProveedor, Long> {
    Optional<SuscripcionProveedor> findByProveedorId(Long proveedorId);
}
