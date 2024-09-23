// find all products
app.get("/cost-list", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while fetching data.",
      error,
    });
  }
});
