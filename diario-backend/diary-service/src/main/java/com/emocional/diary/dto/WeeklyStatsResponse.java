package com.emocional.diary.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class WeeklyStatsResponse {
    private double averageMood;
    private double averageStress;
    private double averageSleep;
    private String mainWorry;
    private List<DailyStatDto> dailyStats;

    @Data
    @Builder
    public static class DailyStatDto {
        private String date;
        private double mood;
        private double stress;
        private double sleep;
    }
}
