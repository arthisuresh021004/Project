package projectmaven;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.Locale;

public class App {
    public static void main(String[] args) {
        LocalDate today = LocalDate.now();
        YearMonth yearMonth = YearMonth.now();

        System.out.println("Today's Date: " + today);
        System.out.println("\nCalendar for " + 
                           yearMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) +
                           " " + yearMonth.getYear());
        System.out.println("Mo Tu We Th Fr Sa Su");

        LocalDate firstDay = yearMonth.atDay(1);
        int dayOfWeek = firstDay.getDayOfWeek().getValue(); // 1=Monday, 7=Sunday

        // Print initial spaces
        for (int i = 1; i < dayOfWeek; i++) {
            System.out.print("   ");
        }

        for (int day = 1; day <= yearMonth.lengthOfMonth(); day++) {
            System.out.printf("%2d ", day);
            if ((day + dayOfWeek - 1) % 7 == 0) {
                System.out.println();
            }
        }
    }
}
