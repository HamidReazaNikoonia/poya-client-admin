import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CircularProgress,
} from "@mui/material";
import { Calendar } from "react-datepicker2";
import moment from "moment-jalaali";
import { toast } from "react-toastify";
import Header from "../../components/Header";

// API
import { getTimeSlots, updateTimeSlot } from "../../api/schedule";

// handler
import createTimeSlot from "./createTimeSlot";

// const mockTime = [
//   {
//     date: "2020/01/01",
//     start: slot.start,
//     end: slot.end,
//     isSelected: false,
//   },
//   {
//     date: "2020/01/01",
//     start: slot.start,
//     end: slot.end,
//     isSelected: false,
//   },
//   {
//     date: "2020/01/01",
//     start: slot.start,
//     end: slot.end,
//     isSelected: false,
//   },
// ];

// Get time slot
const slots = createTimeSlot(60, 15);

const Schedule = () => {
  const [date, setdate] = useState(moment);
  const [timeSlot, settimeSlot] = useState();

  const [selectedDate, setSelectedDate] = useState(
    moment().format("jYYYY/jM/jD")
  );
  const queryClient = useQueryClient();

  const { data, isLoading, error, isError, isSuccess } = useQuery({
    queryKey: ["time-slot", selectedDate],
    queryFn: () => getTimeSlots({ date: selectedDate }),
  });

  const updateTimeSlotMutation = useMutation({
    mutationFn: updateTimeSlot,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["time-slot"] });
      // console.log({ apiSuccess: data });
    },
  });

  //   useEffect(() => {
  //     // we will get duration and gap from Admin-Setting API
  //     const slots = createTimeSlot(60);
  //     console.log(slots);

  //     settimeSlot(slots);

  //   }, [])

  // Fetch the time slots on component mount
  useEffect(() => {
    // Assume duration and gap will be retrieved from an API call, here using 60 min and 15 min gap for demo
    // const slots = createTimeSlot(60, 15);

    // Format time slot data with isSelected state
    const timeSlotData = slots.map((slot) => {
      const pointerOfSlot = data?.data?.result.filter(
        (v) => v.startTime === slot.start
      );
      // console.log({kir})

      return {
        date: selectedDate,
        start: slot.start,
        end: slot.end,
        isSelected: Array.isArray(pointerOfSlot) && pointerOfSlot[0],
        isBooked:
          Array.isArray(pointerOfSlot) &&
          pointerOfSlot[0] &&
          pointerOfSlot[0].isBooked,
      };
    });

    settimeSlot(timeSlotData);
  }, [data, isSuccess]);

  useEffect(() => {
    if (isError && error) {
      console.log(error);
      toast.error("SERVER PROBLEM, We could not get data from server");
    }

    if (updateTimeSlotMutation.isError) {
      console.log({mutationError: updateTimeSlotMutation.error});
      toast.error("SERVER PROBLEM, We could not set data to server");
    }
  }, [isError, updateTimeSlotMutation.isError]);

  // Handle card click to toggle selection
  const handleSelectSlot = (index, slot) => {
    if (slot.isBooked) {
      alert("this time is booked by user, you can not change that");
      return false;
    }
    const updatedSlots = timeSlot.map((slot, i) =>
      i === index ? { ...slot, isSelected: !slot.isSelected } : slot
    );
    settimeSlot(updatedSlots);
    // console.log(timeSlot);
  };

  const calendarHandler = (value) => {
    const SelectedDate = value.locale("fa").format("jYYYY/jM/jD");
    console.log(SelectedDate);
    setdate(value);

    // on change
    setSelectedDate(value.locale("fa").format("jYYYY/jM/jD"));

    // update timeSlot (send request to API)
    // first we should to know which time-slot existed in API
    // in current date

    // curent date (before onChange function)
    //    ===> data.data.result

    // we should diff this array with [timeslot] state
    //    data.data.result ~ timeslot

    // const filterCommonItems = (arr1, arr2, key) => {
    //   return arr1.filter(item1 =>
    //     arr2.some(item2 => item1["startTime"] === item2["start"])
    //   );
    // }

    // const kos = filterCommonItems(data?.data?.result, timeSlot, "startTime");

    // console.log({kos})

    // Update API
    const selectedTimeSlotItem = timeSlot
      .map((item) => {
        if (item.isSelected) {
          return {
            date: item.date,
            startTime: item.start,
            endTime: item.end,
          };
        }
      })
      .filter((i) => i);
    updateTimeSlotMutation.mutate({ slots: selectedTimeSlotItem });

    console.log({ data: data?.data?.result });

    // Format time slot data with isSelected state
    // const timeSlotData = slots.map((slot) => ({
    //   date: SelectedDate,
    //   start: slot.start,
    //   end: slot.end,
    //   isSelected: false,
    // }));
    // settimeSlot(timeSlotData)
    console.log({ timeSlot });
  };

  const enabledRange = {
    min: moment().startOf("day"),
  };

  return (
    <Box m="20px">
      <Header title="Schedule Time" subtitle="شما میتوانید زمان های رزرو رو اینجا مشخص کنید" />
      <Box height="75vh">
        <Paper sx={{ py: 6 }} square={false} elevation={12}>
          <Grid container>
            <Grid sx={{ fontFamily: "Samim" }} item xs={12} sm={6}>
              <Calendar
                timePicker={false}
                isGregorian={false}
                min={enabledRange.min}
                onChange={(value) => calendarHandler(value)}
                value={date}
              />
            </Grid>
            <Grid
              sx={{
                borderLeft: " 1px dashed white",
                paddingTop: { xs: "60px", sm: 0 },
              }}
              item
              xs={12}
              sm={6}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  maxHeight: "500px",
                  overflowY: "scroll",
                }}
              >
                {isError || updateTimeSlotMutation.isError ? (
                  <div>An error occurred: SERVER BROKEN</div>
                ) : null}
                {updateTimeSlotMutation.isPending || isLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      p: "30px",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <CircularProgress size="3rem" />
                  </Box>
                ) : (
                  <>
                    {timeSlot &&
                      timeSlot.map((slot, index) => (
                        <Card
                          key={index}
                          onClick={() => handleSelectSlot(index, slot)}
                          style={{
                            width: "300px",
                            padding: "16px",
                            opacity: slot.isBooked ? 0.4 : 1,
                            borderRadius: "50px",
                            color: slot.isSelected ? "#fff" : "black",
                            cursor: slot.isBooked ? "not-allowed" : "pointer",
                            backgroundColor: slot.isSelected
                              ? "rgb(33 48 127)"
                              : "#fff",
                          }}
                        >
                          {slot.isBooked && (
                            <Typography>This Slot Booked By User</Typography>
                          )}
                          <Typography variant="body1">{`Start: ${slot.start} - End: ${slot.end}`}</Typography>
                        </Card>
                      ))}
                  </>
                )}
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Schedule;
