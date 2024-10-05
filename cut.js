// Fetch all results without any filter
const allDuePaidResults = await due_payment_Collection.find({}).toArray();

let filteredDuePaymentResults = [];

// Filter based on timeFrame
if (timeFrame === "daily") {
  filteredDuePaymentResults = allDuePaidResults.filter((item) => {
    return new Date(item.date).toDateString() === selectedDate.toDateString();
  });
} else if (timeFrame === "weekly") {
  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const endOfWeek = (date) => {
    const d = new Date(startOfWeek(date));
    d.setDate(d.getDate() + 6);
    return d;
  };

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  filteredDuePaymentResults = allDuePaidResults.filter((item) => {
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
  filteredDuePaymentResults = allDuePaidResults.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= monthStart && itemDate <= monthEnd;
  });
} else if (timeFrame === "yearly") {
  const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
  const yearEnd = new Date(selectedDate.getFullYear(), 11, 31);
  filteredDuePaymentResults = allDuePaidResults.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= yearStart && itemDate <= yearEnd;
  });
} else if (timeFrame === "custom") {
  filteredDuePaymentResults = allDuePaidResults.filter((item) => {
    return new Date(item.date).toDateString() === selectedDate.toDateString();
  });
} else {
  return res.status(400).send({ message: "Invalid timeFrame parameter" });
}
