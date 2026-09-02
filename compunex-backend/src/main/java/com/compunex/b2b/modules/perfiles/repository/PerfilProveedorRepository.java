package com.compunex.b2b.modules.perfiles.repository;

import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerfilProveedorRepository extends JpaRepository<PerfilProveedor, Long> {

    Optional<PerfilProveedor> findByUsuarioId(Long usuarioId);
}
