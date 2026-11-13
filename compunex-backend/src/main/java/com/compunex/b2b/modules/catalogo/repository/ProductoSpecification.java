package com.compunex.b2b.modules.catalogo.repository;

import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Especificaciones JPA dinámicas para consultas del catálogo público B2B.
 */
public final class ProductoSpecification {

    private ProductoSpecification() {
    }

    public static Specification<Producto> filtroPublico(String search, String categoryId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // RN-003: Excluir productos eliminados lógicamente y no activos
            predicates.add(cb.isNull(root.get("fechaEliminacion")));
            predicates.add(cb.equal(root.get("estado"), EstadoProducto.ACTIVO));

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("titulo")), pattern),
                        cb.like(cb.lower(root.get("descripcion")), pattern)
                ));
            }

            if (categoryId != null && !categoryId.isBlank()) {
                predicates.add(cb.equal(root.get("categoria").get("id"), categoryId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
