export const getAllSeries = (req, res) => {
  res.json({ message: "Series list" });
};

export const getSeriesById = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Series ${id}` });
};

export const createSeries = (req, res) => {
  const dados = req.body;
  res.status(201).json({ message: "Series created", dados });
};

export const updateSeries = (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  res.json({ message: `Serie ${id} updated`, dados });
};

export const deleteSeries = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Serie ${id} deleted` });
};
