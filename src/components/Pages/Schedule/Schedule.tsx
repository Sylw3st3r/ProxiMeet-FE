import { useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today as TodayIcon,
} from "@mui/icons-material";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getScheduleEvents } from "../../../vendor/events-vendor";
import { useTranslation } from "react-i18next";
import BlankToolbar from "../../Toolbar/BlankToolbar";
import { Event } from "../../../model/event";

type mode = "day" | "week" | "month";

function useScheduleData(currentDate: Date, mode: mode) {
  const { data: scheduleData, isPending: schedulePending } = useQuery({
    queryKey: ["schedule", { currentDate, mode }],
    queryFn: ({ signal }) => getScheduleEvents(signal, currentDate, mode),
  });
  return { scheduleData, schedulePending };
}

function useScheduleState() {
  const [mode, setMode] = useState<mode>("month"); // day | week | month
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToToday = () => setCurrentDate(new Date());

  const goToNext = () => {
    setCurrentDate((prev) => {
      if (mode === "day") return addDays(prev, 1);
      if (mode === "week") return addWeeks(prev, 1);
      return addMonths(prev, 1);
    });
  };

  const goToPrevious = () => {
    setCurrentDate((prev) => {
      if (mode === "day") return subDays(prev, 1);
      if (mode === "week") return subWeeks(prev, 1);
      return subMonths(prev, 1);
    });
  };
  return { mode, setMode, currentDate, goToNext, goToPrevious, goToToday };
}

function useScheduleController() {
  const { currentDate, mode, setMode, goToPrevious, goToToday, goToNext } =
    useScheduleState();
  const { scheduleData, schedulePending } = useScheduleData(currentDate, mode);
  const { t } = useTranslation();

  const ScheduleToolbarComponent = (
    <BlankToolbar isLoading={schedulePending}>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, mode) => {
          setMode(mode);
        }}
      >
        <ToggleButton value="day">{t("schedule.day")}</ToggleButton>
        <ToggleButton value="week">{t("schedule.week")}</ToggleButton>
        <ToggleButton value="month">{t("schedule.month")}</ToggleButton>
      </ToggleButtonGroup>
      <Box>
        <IconButton onClick={goToPrevious}>
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={goToToday}>
          <TodayIcon />
        </IconButton>
        <IconButton onClick={goToNext}>
          <ChevronRight />
        </IconButton>
      </Box>
    </BlankToolbar>
  );

  return { scheduleData, mode, currentDate, ScheduleToolbarComponent };
}

const Schedule = () => {
  const { scheduleData, mode, currentDate, ScheduleToolbarComponent } =
    useScheduleController();

  const theme = useTheme();

  const renderHeader = () => {
    let label;
    if (mode === "day") {
      label = format(currentDate, "eeee, MMM d");
    } else if (mode === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      label = `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
    } else {
      label = format(currentDate, "MMMM yyyy");
    }
    return (
      <Typography color={theme.palette.text.primary} variant="h6">
        {label}
      </Typography>
    );
  };

  let ScheduleBody;

  if (mode === "day") {
    ScheduleBody = DayView;
  } else if (mode === "week") {
    ScheduleBody = WeekView;
  } else {
    ScheduleBody = MonthView;
  }

  return (
    <Box position={"relative"}>
      {ScheduleToolbarComponent}
      <Box p={2}>
        <Box mt={2} mb={1}>
          {renderHeader()}
        </Box>
        <ScheduleBody events={scheduleData || []} date={currentDate} />
      </Box>
    </Box>
  );
};

const hourSectionHeight = 50;

const DayView = ({ date, events }: { date: Date; events: Event[] }) => {
  const theme = useTheme();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const transformedEvents = events.map((event) => {
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    };
  });

  const dayEvents = transformedEvents.filter((event) => {
    return event.end > dayStart && event.start < dayEnd;
  });

  return (
    <Box position="relative">
      {hours.map((hour) => (
        <Box
          key={hour}
          boxSizing={"border-box"}
          border={`1px solid ${theme.palette.divider}`}
          height={hourSectionHeight}
          pl={1}
          fontSize="0.875rem"
          color={theme.palette.text.secondary}
        >
          {`${hour}:00`}
        </Box>
      ))}
      {isToday(date) && <TimeIndicator />}

      {dayEvents.map((event) => {
        const start = event.start < dayStart ? dayStart : event.start;
        const end = event.end > dayEnd ? dayEnd : event.end;

        const startHour = start.getHours() + start.getMinutes() / 60;
        const endHour = end.getHours() + end.getMinutes() / 60;
        const top = startHour * hourSectionHeight;
        const height = (endHour - startHour) * hourSectionHeight;

        return (
          <Box
            key={event.id}
            position="absolute"
            left={80}
            right={10}
            top={top}
            height={height}
            bgcolor={theme.palette.secondary.main}
            color={theme.palette.secondary.contrastText}
            borderRadius={1}
            p={0.5}
            boxShadow={1}
          >
            <Typography variant="caption">{event.name}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

const TimeIndicator = () => {
  const theme = useTheme();
  const now = new Date();
  const top =
    now.getHours() * hourSectionHeight +
    now.getMinutes() * (hourSectionHeight / 60);

  return (
    <Box
      position="absolute"
      top={top}
      left={0}
      right={0}
      height="2px"
      bgcolor={theme.palette.error.main}
    />
  );
};

const WeekView = ({ date, events }: { date: Date; events: Event[] }) => {
  const theme = useTheme();
  const start = startOfWeek(date);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const transformedEvents = events.map((event) => {
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    };
  });

  return (
    <Box
      sx={{
        display: "grid",
        maxWidth: "1100px",
        marginY: 0,
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        width: "100%",
      }}
    >
      {days.map((day) => {
        const dayStart = new Date(day.setHours(0, 0, 0, 0));
        const dayEnd = new Date(day.setHours(23, 59, 59, 999));

        const dayEvents = transformedEvents.filter((item) => {
          return item.end > dayStart && item.start < dayEnd;
        });

        return (
          <Box
            key={day.toISOString()}
            sx={{ aspectRatio: 1, overflow: "hidden" }}
            border={`1px solid ${theme.palette.divider}`}
            bgcolor={theme.palette.background.paper}
            p={1}
          >
            <Typography variant="subtitle2" color={theme.palette.text.primary}>
              {format(day, "EEE dd")}
            </Typography>
            {dayEvents.map((event) => (
              <Box
                key={event.id}
                mt={1}
                p={1}
                bgcolor={theme.palette.secondary.main}
                borderRadius={1}
              >
                <Typography
                  variant="caption"
                  color={theme.palette.secondary.contrastText}
                >
                  {event.name}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

const MonthView = ({ date, events }: { date: Date; events: Event[] }) => {
  const theme = useTheme();
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = [];
  let current = start;

  const transformedEvents = events.map((event) => {
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    };
  });

  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return (
    <Box
      sx={{
        display: "grid",
        maxWidth: "1100px",
        marginY: 0,
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        width: "100%",
      }}
      gap={0.5}
    >
      {days.map((day) => {
        const dayEvents = transformedEvents.filter(
          (event) => event.start.toDateString() === day.toDateString(),
        );

        return (
          <Box
            sx={{ aspectRatio: 1, overflow: "hidden" }}
            key={day.toDateString()}
            border={`1px solid ${theme.palette.divider}`}
            bgcolor={theme.palette.background.paper}
            p={1}
          >
            <Typography
              color={theme.palette.text.primary}
              variant="caption"
              fontWeight="bold"
            >
              {format(day, "d")}
            </Typography>
            {dayEvents.map((event) => (
              <Box
                key={event.id}
                mt={0.5}
                p={0.5}
                bgcolor={theme.palette.secondary.main}
                borderRadius={1}
              >
                <Typography
                  color={theme.palette.secondary.contrastText}
                  variant="caption"
                >
                  {event.name}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default Schedule;
