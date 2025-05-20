import React, { useContext, useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  IconButton,
  useTheme,
  LinearProgress,
  Toolbar,
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
} from "date-fns";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../authentication/auth-context";

const getData = async (
  signal: AbortSignal,
  search: string,
  page: number,
  limit: number,
) => {
  const response = await axios.get(
    `http://localhost:3001/events/all?search=${search}&page=${page}&limit=${limit}`,
    {
      signal,
    },
  );
  return response.data;
};

const Schedule = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const { isPending, data } = useQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => getData(signal, "", 1, 50),
    enabled: isLoggedIn,
  });

  const theme = useTheme();

  const [mode, setMode] = useState("day"); // day | week | month
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleModeChange = (_: any, newMode: any) => {
    if (newMode !== null) setMode(newMode);
  };

  const goToToday = () => setCurrentDate(new Date());

  const goNext = () => {
    setCurrentDate((prev) => {
      if (mode === "day") return addDays(prev, 1);
      if (mode === "week") return addWeeks(prev, 1);
      return addMonths(prev, 1);
    });
  };

  const goPrevious = () => {
    setCurrentDate((prev) => {
      if (mode === "day") return subDays(prev, 1);
      if (mode === "week") return subWeeks(prev, 1);
      return subMonths(prev, 1);
    });
  };

  const renderHeader = () => {
    let label = "";
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

  const renderBody = (scheduleItems: any) => {
    switch (mode) {
      case "day":
        return <DayView items={scheduleItems} date={currentDate} />;
      case "week":
        return <WeekView items={scheduleItems} date={currentDate} />;
      case "month":
        return <MonthView items={scheduleItems} date={currentDate} />;
      default:
        return null;
    }
  };

  return (
    <Box position={"relative"}>
      <Toolbar
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 0,
          zIndex: 200,
          bgcolor: theme.palette.background.paper,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange}>
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
        <Box>
          <IconButton onClick={goPrevious}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={goToToday}>
            <TodayIcon />
          </IconButton>
          <IconButton onClick={goNext}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Toolbar>

      <Box p={2}>
        <Box mt={2} mb={1}>
          {renderHeader()}
        </Box>
        {isPending && <LinearProgress></LinearProgress>}
        {renderBody(
          (data?.events || []).map((event: { start: string; end: string }) => {
            return {
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            };
          }),
        )}
      </Box>
    </Box>
  );
};

const hourSectionHeight = 50;

const DayView = ({ date, items }: any) => {
  const theme = useTheme();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayStart = new Date(date.setHours(0, 0, 0, 0));
  const dayEnd = new Date(date.setHours(23, 59, 59, 999));

  const dayItems = items.filter((item: any) => {
    return item.end > dayStart && item.start < dayEnd;
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

      {dayItems.map((item: any) => {
        const start = item.start < dayStart ? dayStart : item.start;
        const end = item.end > dayEnd ? dayEnd : item.end;

        const startHour = start.getHours() + start.getMinutes() / 60;
        const endHour = end.getHours() + end.getMinutes() / 60;
        const top = startHour * hourSectionHeight;
        const height = (endHour - startHour) * hourSectionHeight;

        return (
          <Box
            key={item.id}
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
            <Typography variant="caption">{item.name}</Typography>
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

const WeekView = ({ date, items }: any) => {
  const theme = useTheme();
  const start = startOfWeek(date);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

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

        const dayItems = items.filter((item: any) => {
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
            {dayItems.map((item: any) => (
              <Box
                key={item.id}
                mt={1}
                p={1}
                bgcolor={theme.palette.secondary.main}
                borderRadius={1}
              >
                <Typography
                  variant="caption"
                  color={theme.palette.secondary.contrastText}
                >
                  {item.name}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

const MonthView = ({ date, items }: any) => {
  const theme = useTheme();
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = [];
  let current = start;
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
        const dayItems = items.filter(
          (item: any) => item.start.toDateString() === day.toDateString(),
        );

        return (
          <Box
            sx={{ aspectRatio: 1, overflow: "hidden" }}
            key={day}
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
            {dayItems.map((item: any) => (
              <Box
                key={item.id}
                mt={0.5}
                p={0.5}
                bgcolor={theme.palette.secondary.main}
                borderRadius={1}
              >
                <Typography
                  color={theme.palette.secondary.contrastText}
                  variant="caption"
                >
                  {item.name}
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
