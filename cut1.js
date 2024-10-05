app.get("/all-bank-info-for-check", async (req, res) => {
  try {
    // Step 1: Retrieve all the bank names (collections)
    const bank_name_list = await bank_name_Collection.find({}).toArray();

    // Initialize mainAmount to store the sum of all banks' totalAmount
    let mainAmount = 0;

    // Step 2: Iterate over each collectionName and query the respective collection
    for (const bank of bank_name_list) {
      const collectionName = bank.collectionName; // Access collectionName from each bank document

      if (collectionName) {
        // Step 3: Dynamically query each collection
        const bank_collection = database.collection(collectionName); // Dynamically access the collection
        const bank_info = await bank_collection.find({}).toArray(); // Query all documents from the collection

        // Step 4: Calculate the total amount for each bank
        let totalAmount = 0;
        let previous_amount = 0;
        let deposit = 0;
        let bonus = 0;
        let withdraw = 0;
        let bankCost = 0;

        // Loop through all the transactions in the bank collection
        for (const transaction of bank_info) {
          if (transaction.paymentType === "previous_amount") {
            previous_amount += transaction.amount;
          } else if (transaction.paymentType === "deposit") {
            deposit += transaction.amount;
          } else if (transaction.paymentType === "bonus") {
            bonus += transaction.amount;
          } else if (transaction.paymentType === "withdraw") {
            withdraw += transaction.amount;
          } else if (transaction.paymentType === "bankCost") {
            bankCost += transaction.amount;
          }
        }

        // Calculate the total amount based on the formula
        totalAmount = previous_amount + deposit + bonus - withdraw - bankCost;

        // Add each bank's totalAmount to the mainAmount
        mainAmount += totalAmount;
      }
    }

    // Step 5: Send the mainAmount back to the client
    res.send({ mainAmount });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while fetching data.",
      error,
    });
  }
});
