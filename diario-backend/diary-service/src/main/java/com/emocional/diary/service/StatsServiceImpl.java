package com.emocional.diary.service;

import com.emocional.diary.dto.WeeklyStatsResponse;
import com.emocional.diary.model.DiaryEntry;
import com.emocional.diary.repository.DiaryEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final DiaryEntryRepository diaryEntryRepository;

    @Override
    public WeeklyStatsResponse getWeeklyStats(Long userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6); // Last 7 days including today

        java.time.Instant endInstant = endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        java.time.Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();

        List<DiaryEntry> entries = diaryEntryRepository.findByUserIdAndCreatedAtBetween(userId, startInstant, endInstant);

        if (entries.isEmpty()) {
            return WeeklyStatsResponse.builder()
                    .averageMood(0.0)
                    .averageStress(0.0)
                    .averageSleep(0.0)
                    .mainWorry("N/A")
                    .dailyStats(List.of())
                    .build();
        }

        // Calculate daily stats
        Map<LocalDate, List<DiaryEntry>> entriesByDay = entries.stream()
                .collect(Collectors.groupingBy(entry -> entry.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate()));

        List<WeeklyStatsResponse.DailyStatDto> dailyStats = entriesByDay.entrySet().stream()
                .map(entry -> {
                    double avgMood = entry.getValue().stream().mapToInt(DiaryEntry::getUserMoodRating).average().orElse(0.0);
                    double avgStress = entry.getValue().stream().mapToInt(DiaryEntry::getUserStressLevel).average().orElse(0.0);
                    double avgSleep = entry.getValue().stream().mapToDouble(DiaryEntry::getUserSleepHours).average().orElse(0.0);
                    return WeeklyStatsResponse.DailyStatDto.builder()
                            .date(entry.getKey().toString())
                            .mood(avgMood)
                            .stress(avgStress)
                            .sleep(avgSleep)
                            .build();
                })
                .sorted(Comparator.comparing(WeeklyStatsResponse.DailyStatDto::getDate))
                .collect(Collectors.toList());

        // Calculate overall averages for the week
        double totalMood = entries.stream().mapToInt(DiaryEntry::getUserMoodRating).average().orElse(0.0);
        double totalStress = entries.stream().mapToInt(DiaryEntry::getUserStressLevel).average().orElse(0.0);
        double totalSleep = entries.stream().mapToDouble(DiaryEntry::getUserSleepHours).average().orElse(0.0);

        // Find main worry (most frequent)
        String mainWorry = entries.stream()
                .filter(entry -> entry.getMainWorry() != null && !entry.getMainWorry().isEmpty())
                .collect(Collectors.groupingBy(DiaryEntry::getMainWorry, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        return WeeklyStatsResponse.builder()
                .averageMood(totalMood)
                .averageStress(totalStress)
                .averageSleep(totalSleep)
                .mainWorry(mainWorry)
                .dailyStats(dailyStats)
                .build();
    }
}
