package com.equipment.repository;

import com.equipment.model.LogItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogItemRepository extends JpaRepository<LogItem, Integer> {
} 