// ------------------- Supplier Information ---------------------
const supplier_name_list = await supplier_name_Collection.find({}).toArray();
let totalBill = 0;
let totalPayment = 0;
let totalGet = 0;
let how_much_previous_get = 0;
let how_much_had_paid = 0; // Variable to store total payments in the timeFrame

const previousDay = new Date(timeFrameStartDate);
previousDay.setDate(previousDay.getDate() - 1); // Get the previous day of timeFrame start

for (const supplier of supplier_name_list) {
  const collectionName = supplier.collectionName;
  if (collectionName) {
    const supplier_collection = database.collection(collectionName);
    const supplier_info = await supplier_collection.find({}).toArray();

    let how_much_amout_bill = 0;
    let how_much_amout_paid = 0;
    let previous_amout_bill = 0;
    let previous_amout_paid = 0;

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
          how_much_had_paid += transaction.amount; // Sum all payments within timeFrame
        }
      }

      // Previous period before the timeFrame
      if (transactionDate <= previousDay) {
        if (transaction.paymentType === "bill") {
          previous_amout_bill += transaction.amount;
        } else if (transaction.paymentType === "payment") {
          previous_amout_paid += transaction.amount;
        }
      }
    }

    // Calculate the remaining amount to get from the supplier within timeFrame
    const how_much_amout_get = how_much_amout_bill - how_much_amout_paid;
    totalBill += how_much_amout_bill;
    totalPayment += how_much_amout_paid;
    totalGet += how_much_amout_get;

    // Calculate previous remaining amount to get before the timeFrame start date
    const previous_get = previous_amout_bill - previous_amout_paid;
    how_much_previous_get += previous_get;
  }
}
