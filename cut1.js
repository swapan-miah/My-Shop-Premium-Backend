// Helper function to filter based on timeFrame
function filterByTimeFrame(data, selectedDate, timeFrame) {
  let filteredData = [];

  if (timeFrame === "daily") {
    filteredData = data.filter((item) => {
      return new Date(item.date).toDateString() === selectedDate.toDateString();
    });
  } else if (timeFrame === "weekly") {
    const startOfWeek = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };

    const endOfWeek = (date) => {
      const d = new Date(startOfWeek(date));
      d.setDate(d.getDate() + 6);
      return d;
    };

    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= weekStart && itemDate <= weekEnd;
    });
  } else if (timeFrame === "monthly") {
    const monthStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const monthEnd = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    );
    filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= monthStart && itemDate <= monthEnd;
    });
  } else if (timeFrame === "yearly") {
    const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
    const yearEnd = new Date(selectedDate.getFullYear(), 11, 31);
    filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= yearStart && itemDate <= yearEnd;
    });
  } else if (timeFrame === "custom") {
    filteredData = data.filter((item) => {
      return new Date(item.date).toDateString() === selectedDate.toDateString();
    });
  }

  return filteredData;
}
