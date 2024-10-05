// ------------------- Bank Information ---------------------
const supplier_name_list = await supplier_name_Collection.find({}).toArray();
let how_much_amout_bill = 0;
let how_much_amout_get = 0;
let how_much_amout_paid = 0;
let how_much_amout_due = 0;

const timeFrameStartDate = filterByTimeFrame(selectedDate, timeFrame); // Helper function for timeFrame start date

for (const supplier of supplier_name_list) {
  const collectionName = supplier.collectionName;
  if (collectionName) {
    const supplier_collection = database.collection(collectionName);
    const supplier_info = await supplier_collection.find({}).toArray();

    let how_much_amout_bill = 0;
    let how_much_amout_get = 0;
    let how_much_amout_paid = 0;
    let how_much_amout_due = 0;

    for (const transaction of supplier_info) {
      const transactionDate = new Date(transaction.date);

      // Current timeFrame calculations (timeFrame start date to selected date)
      if (
        transactionDate >= timeFrameStartDate &&
        transactionDate <= selectedDate
      ) {
        if (transaction.paymentType === "bill") {
          how_much_amout_bill += transaction.amount;
        } else if (transaction.paymentType === "payment") {
          how_much_amout_paid += transaction.amount;
        }
      }
    }

    how_much_amout_get = how_much_amout_bill - how_much_amout_paid;
  }
}
