package com.compunex.b2b.modules.ordenes.repository;

import com.compunex.b2b.modules.ordenes.entity.OrdenItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdenItemRepository extends JpaRepository<OrdenItem, Long> {

    List<OrdenItem> findBySubordenId(Long subordenId);
}
