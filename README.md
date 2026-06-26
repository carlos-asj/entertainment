# 📺 Series Set

Sistema para registrar e acompanhar séries e shows assistidos, com backend em Node.js e frontend em React.

---

## 🛠️ Tecnologias

**Backend**
- [Express.js](https://expressjs.com/) — servidor web
- [SQLite3](https://www.sqlite.org/) — banco de dados local

**Frontend**
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🚀 Endpoints

### `/series`

**Listar séries com progresso**
```bash
curl -s http://localhost:3000/progress/series
```

**Cadastrar série**
```bash
curl -X POST http://localhost:3000/series \
  -H "Content-Type: application/json" \
  -d '{"name": "breaking bad", "seasons": 8, "episodes": 80, "streaming": "Netflix"}'
```

**Atualizar série**
```bash
curl -X PUT http://localhost:3000/series/3 \
  -H "Content-Type: application/json" \
  -d '{"name": "teste PUT", "seasons": 5, "episodes": "130", "streaming": "Netflix"}'
```

**Deletar série**
```bash
curl -X DELETE http://localhost:3000/series/1
```

---

### `/dashboard`

**Visualizar dashboard geral**
```bash
curl -s http://localhost:3000/progress/dashboard
```

---

### `/progress`

**Registrar progresso**
```bash
curl -X POST http://localhost:3000/progress \
  -H "Content-Type: application/json" \
  -d '{"id_serie": "2", "seasons_now": 8, "episodes_now": 80, "status": "Assistindo"}'
```

**Atualizar progresso**
```bash
curl -X PUT http://localhost:3000/progresso/1 \
  -H "Content-Type: application/json" \
  -d '{"seasons_now": 2, "episodes_now": 5, "status": "Assistindo"}'
```
