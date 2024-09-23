import { Tooltip } from "@nextui-org/react";
import moment from "moment";
import { useEffect, useState } from "react";

const MonthlyActivity = ({ activityData }) => {
  const today = moment();
  const daysInMonth = today.daysInMonth();

  const [activeDaysCount, setActiveDaysCount] = useState(0);
  const [percentageActive, setPercentageActive] = useState(0);

  // Create a set of activity dates for easy lookup
  const activeDates = new Set(
    activityData.map((activity) => moment(activity.date).format("YYYY-MM-DD"))
  );

  useEffect(() => {
    // Calculate the total number of active days
    const activeCount = Array.from({ length: daysInMonth }).reduce(
      (count, _, day) => {
        const dayDate = today
          .clone()
          .date(day + 1)
          .format("YYYY-MM-DD");
        return count + (activeDates.has(dayDate) ? 1 : 0);
      },
      0
    );

    setActiveDaysCount(activeCount);

    // Calculate percentage of days active
    const activePercentage = ((activeCount / daysInMonth) * 100).toFixed(2);
    setPercentageActive(activePercentage);

    console.log(activityData);
  }, [activityData, daysInMonth, today, activeDates]);

  return (
    <>
      {/* Activity Indicator */}
      <div className="activity-indicator flex flex-wrap gap-1 max-w-md my-6">
        {Array.from({ length: daysInMonth }, (_, day) => {
          const dayDate = today
            .clone()
            .date(day + 1)
            .format("YYYY-MM-DD");
          const formattedDate = today
            .clone()
            .date(day + 1)
            .format("D MMMM YYYY"); // Format date as "24 November 2024"
          const isActive = activeDates.has(dayDate);

          return (
            <Tooltip
              className="cursor-pointer"
              key={day + 1}
              showArrow={true}
              content={formattedDate} // Show formatted date in tooltip
            >
              <div
                className={`text-small font-bold cursor-pointer h-[28px] w-[28px] flex justify-center rounded-md items-center text-black ${
                  isActive ? "bg-[#26A641]" : "bg-[#161B22]"
                }`}
              >
                {day + 1}
              </div>
            </Tooltip>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="summary-section mt-4">
        <p className="text">
          Total Active Days:{" "}
          <span className="text-[#26A641]">{activeDaysCount}</span>
        </p>
        <p className="text-md">
          Active Percentage:{" "}
          <span className="text-[#26A641]">{percentageActive}%</span>
        </p>
        <p className="text-sm text-gray-400">
          Month: {today.format("MMMM YYYY")} ({daysInMonth} days)
        </p>
      </div>
    </>
  );
};

export default MonthlyActivity;
