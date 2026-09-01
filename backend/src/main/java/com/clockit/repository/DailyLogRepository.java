package com.clockit.repository;

import com.clockit.model.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {

    Optional<DailyLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    List<DailyLog> findAllByUserIdAndLogDateBetweenOrderByLogDateAsc(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT dl FROM DailyLog dl WHERE dl.user.id = :userId ORDER BY dl.logDate DESC")
    List<DailyLog> findAllByUserIdOrderByLogDateDesc(@Param("userId") Long userId);
}
