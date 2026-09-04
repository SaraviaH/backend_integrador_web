package com.compunex.b2b.modules.catalogo.repository;

import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    @EntityGraph(attributePaths = {"categoria"})
    Page<Producto> findAllByProveedorIdAndEstadoNot(Long proveedorId, EstadoProducto estado, Pageable pageable);

    Optional<Producto> findByUuid(UUID uuid);

    Optional<Producto> findByIdAndProveedorId(Long id, Long proveedorId);
}
