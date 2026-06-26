import { ConnDB } from "../infra/database.js";

let db = ConnDB();

export const postProgress = (req, res) => {
  const { id_serie, seasons_now, episodes_now, streaming } = req.body;

  const serie = db.prepare("SELECT seasons, episodes FROM series WHERE id = ?").get(id_serie)

  const status = seasons_now === 0 && episodes_now === 0
  ? "Não Assistido"
  : seasons_now >= serie.seasons && episodes_now >= serie.episodes
    ? "Concluído"
    : "Assistindo"

  if (!serie) {
    return res.status(404).json({ error: "Série não encontrada" })
  }

  if (seasons_now > serie.seasons) {
    return res.status(400).json({ error: `A série possui apenas ${serie.seasons} temporadas` })
  }

  if (episodes_now > serie.episodes) {
    return res.status(400).json({ error: `A série possui apenas ${serie.episodes} episódios` })
  }

  if (seasons_now < 0 || episodes_now < 0) {
    return res.status(400).json({ error: "Os valores não podem ser negativos" })
  }

  try {
    const progress_now = db
      .prepare("SELECT id FROM progress_series WHERE id_serie = ?")
      .get(id_serie);

    if (progress_now) {
      db.prepare(
        `
            UPDATE progress_series
            SET seasons_now = ?, episodes_now = ?, status = ?
            WHERE id_serie = ?
        `,
      ).run(seasons_now, episodes_now, status, id_serie);


      return res.status(200).json({ message: "progress updated successfully" });
    } else {
      db.prepare(
        `
            INSERT INTO progress_series (id_serie, seasons_now, episodes_now, status)
            VALUES (?, ?, ?, ?)
        `,
      ).run(id_serie, seasons_now, episodes_now, status);

      return res.status(201).json({ message: "First progress saved" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error while saving progress" });
  }
};

export const getDashSeries = (req, res) => {
  try {
    const query = `
        SELECT
            s.id AS serie_id,
            s.name AS nome,
            s.seasons AS total_temporadas,
            s.episodes AS total_episodios,
            p.seasons_now AS temporada_atual,
            p.episodes_now AS episodio_atual,
            COALESCE(p.status, 'Não iniciado') AS status_atual
        FROM series s
        LEFT JOIN progress_series p ON s.id = p.id_serie
    `;

    const dataTable = db.prepare(query).all();
    return res.status(200).json(dataTable);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};
