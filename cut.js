app.put("/damage-update/:id", async (req, res) => {
  try {
    const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
    const cross_matching_frontend_key = req.body.crose_maching_key;

    if (cross_matching_backend_key === cross_matching_frontend_key) {
      const paramsId = req.params.id;

      // Fetch the store item by product name from storeCollection
      const query = { product_name: req.body.product_name };
      const storeItem = await storeCollection.findOne(query);

      if (!storeItem) {
        return res.status(404).send("Store item not found");
      }

      // Calculate the updated store quantity
      const updatedStoreQuantity =
        req.body.return_quantity + storeItem.store_quantity;

      // Update storeCollection with the new store quantity
      const storeUpdateFilter = { product_name: req.body.product_name };
      const storeUpdateDoc = {
        $set: {
          store_quantity: updatedStoreQuantity,
        },
      };
      const storeUpdate = await storeCollection.updateOne(
        storeUpdateFilter,
        storeUpdateDoc
      );

      res.send(storeUpdate);

      // Calculate updated damage quantity
      const updateDamageQuantity =
        req.body?.damage_quantity - req.body?.return_quantity;

      // Check if updateDamageQuantity is 0, delete if true, otherwise update
      const filter = { _id: new ObjectId(paramsId) };

      if (updateDamageQuantity === 0) {
        // Delete the damage document if the damage quantity is 0
        const deleteResult = await damage_Collection.deleteOne(filter);
        res.send({
          acknowledged: deleteResult.acknowledged,
          message: "Damage item deleted",
        });
      } else {
        // Update the damage document with the new damage quantity
        const updateDoc = {
          $set: {
            damage_quantity: updateDamageQuantity,
          },
        };
        const updateResult = await damage_Collection.updateOne(
          filter,
          updateDoc
        );
        res.send(updateResult);
      }
    } else {
      res.status(403).send("Unauthorized access");
    }
  } catch (error) {
    console.error("Error handling product info update:", error);
    res.status(500).send("Server Error");
  }
});
