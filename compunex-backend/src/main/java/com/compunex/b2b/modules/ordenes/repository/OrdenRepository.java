package com.compunex.b2b.modules.ordenes.repository;

import com.compunex.b2b.modules.ordenes.entity.Orden;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    Page<Orden> findByCompradorId(Long compradorId, Pageable pageable);

    Optional<Orden> findByCodigoOrden(String codigoOrden);

    @Query("SELECT COALESCE(MAX(o.id), 0) FROM Orden o")
    Long findMaxId();
}
