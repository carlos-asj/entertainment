import sqlite3 from 'sqlite3'
const sqlite = sqlite3.verbose()

const db = new sqlite.Database('./infra/database.db', (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err.message)
    }
})

// Executa a alteração na estrutura da tabela
db.serialize(() => {
  db.run("ALTER TABLE progress_series DROP COLUMN streaming", (err) => {
    if (err) {
      console.error("Erro ao remover coluna:", err.message);
    } else {
      console.log("Coluna removida com sucesso!");
    }
  });
});

db.close();