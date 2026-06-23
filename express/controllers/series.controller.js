import { ConnDB } from "../infra/database.js";

let db = ConnDB();

export const getAllSeries = (req, res) => {
  try {
    const series = db.prepare("SELECT * FROM series").all();

    res.status(200).json(series);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

export const getSeriesById = (req, res) => {
  const { id } = req.params;
  try {
    const serie = db.prepare("SELECT * FROM series WHERE id = ?").get(id);

    if (!serie) {
      return res.status(404).json({ error: "serie not found" });
    }
    return res.json(serie);
  } catch (error) {
    console.error(error);
  }
};

export const createSeries = (req, res) => {
  const { name, seasons, episodes, streaming } = req.body;
  try {
    const createSerie = db.prepare(`
      INSERT INTO series (name, seasons, episodes, streaming)
      VALUES (?, ?, ?, ?)
    `);

    const info = createSerie.run(name, seasons, episodes, streaming);

    res
      .status(201)
      .json({ id: info.lastInsertRowid, message: "Serie created!" });
  } catch (error) {
    console.error(error);
  }
};

export const updateSeries = (req, res) => {
  const { id } = req.params;
  const { name, seasons, episodes, streaming } = req.body;
  try {
    const updateSerie = db.prepare(`
      UPDATE series
      SET name = ?, seasons = ?, episodes = ?, streaming = ?
      WHERE id = ?
    `);

    const info = updateSerie.run(name, seasons, episodes, streaming, id);

    if (info.changes === 0) {
      return res.status(404).json({ error: "none update found" });
    }
    return res.status(200).json({ message: "serie updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const deleteSeries = (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare("DELETE FROM series WHERE id = ?");

    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: "serie not found" });
    }

    return res.status(200).json({ message: "serie deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
};
