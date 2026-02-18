const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const DEVELOPERS_FILE = path.join(DATA_DIR, 'developers.json');
const SPRINTS_FILE = path.join(DATA_DIR, 'sprints.json');

app.use(cors());
app.use(express.json());

// Generic file helpers
async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

async function writeFile(filePath, data) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Task helpers
async function getTasks() {
  return readFile(TASKS_FILE);
}

async function saveTasks(tasks) {
  await writeFile(TASKS_FILE, tasks);
}

// Developer helpers
async function getDevelopers() {
  return readFile(DEVELOPERS_FILE);
}

async function saveDevelopers(developers) {
  await writeFile(DEVELOPERS_FILE, developers);
}

// Sprint helpers
async function getSprints() {
  return readFile(SPRINTS_FILE);
}

async function saveSprints(sprints) {
  await writeFile(SPRINTS_FILE, sprints);
}

// ==================== TASKS ====================

// GET /tasks - Get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await getTasks();
  res.json(tasks);
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res) => {
  const newTask = req.body;
  const tasks = await getTasks();

  const taskWithId = {
    id: uuidv4(),
    ...newTask,
    state: newTask.state || 'to-do',
    sprint: newTask.sprint || 'Backlog',
    createdAt: new Date().toISOString()
  };

  tasks.push(taskWithId);
  await saveTasks(tasks);

  res.status(201).json(taskWithId);
});

// GET /tasks/:id - Get a specific task
app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const tasks = await getTasks();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const tasks = await getTasks();

  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
  await saveTasks(tasks);

  res.json(tasks[taskIndex]);
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const tasks = await getTasks();

  const filteredTasks = tasks.filter(t => t.id !== id);

  if (tasks.length === filteredTasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }

  await saveTasks(filteredTasks);
  res.json({ message: 'Task deleted successfully' });
});

// ==================== DEVELOPERS ====================

// GET /developers - Get all developers
app.get('/developers', async (req, res) => {
  const developers = await getDevelopers();
  res.json(developers);
});

// POST /developers - Create a new developer
app.post('/developers', async (req, res) => {
  const newDeveloper = req.body;
  const developers = await getDevelopers();

  const developerWithId = {
    id: uuidv4(),
    ...newDeveloper,
    createdAt: new Date().toISOString()
  };

  developers.push(developerWithId);
  await saveDevelopers(developers);

  res.status(201).json(developerWithId);
});

// GET /developers/:id - Get a specific developer
app.get('/developers/:id', async (req, res) => {
  const { id } = req.params;
  const developers = await getDevelopers();
  const developer = developers.find(d => d.id === id);

  if (!developer) {
    return res.status(404).json({ error: 'Developer not found' });
  }

  res.json(developer);
});

// PUT /developers/:id - Update a developer
app.put('/developers/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const developers = await getDevelopers();

  const developerIndex = developers.findIndex(d => d.id === id);

  if (developerIndex === -1) {
    return res.status(404).json({ error: 'Developer not found' });
  }

  developers[developerIndex] = { ...developers[developerIndex], ...updates, updatedAt: new Date().toISOString() };
  await saveDevelopers(developers);

  res.json(developers[developerIndex]);
});

// DELETE /developers/:id - Delete a developer
app.delete('/developers/:id', async (req, res) => {
  const { id } = req.params;
  const developers = await getDevelopers();

  const filteredDevelopers = developers.filter(d => d.id !== id);

  if (developers.length === filteredDevelopers.length) {
    return res.status(404).json({ error: 'Developer not found' });
  }

  await saveDevelopers(filteredDevelopers);
  res.json({ message: 'Developer deleted successfully' });
});

// ==================== SPRINTS ====================

// GET /sprints - Get all sprints
app.get('/sprints', async (req, res) => {
  const sprints = await getSprints();
  res.json(sprints);
});

// POST /sprints - Create a new sprint
app.post('/sprints', async (req, res) => {
  const newSprint = req.body;
  const sprints = await getSprints();

  const sprintWithId = {
    id: uuidv4(),
    ...newSprint,
    status: newSprint.status || 'planning',
    createdAt: new Date().toISOString()
  };

  sprints.push(sprintWithId);
  await saveSprints(sprints);

  res.status(201).json(sprintWithId);
});

// GET /sprints/:id - Get a specific sprint
app.get('/sprints/:id', async (req, res) => {
  const { id } = req.params;
  const sprints = await getSprints();
  const sprint = sprints.find(s => s.id === id);

  if (!sprint) {
    return res.status(404).json({ error: 'Sprint not found' });
  }

  res.json(sprint);
});

// PUT /sprints/:id - Update a sprint
app.put('/sprints/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const sprints = await getSprints();

  const sprintIndex = sprints.findIndex(s => s.id === id);

  if (sprintIndex === -1) {
    return res.status(404).json({ error: 'Sprint not found' });
  }

  sprints[sprintIndex] = { ...sprints[sprintIndex], ...updates, updatedAt: new Date().toISOString() };
  await saveSprints(sprints);

  res.json(sprints[sprintIndex]);
});

// DELETE /sprints/:id - Delete a sprint
app.delete('/sprints/:id', async (req, res) => {
  const { id } = req.params;
  const sprints = await getSprints();

  const filteredSprints = sprints.filter(s => s.id !== id);

  if (sprints.length === filteredSprints.length) {
    return res.status(404).json({ error: 'Sprint not found' });
  }

  await saveSprints(filteredSprints);
  res.json({ message: 'Sprint deleted successfully' });
});

// ==================== SERVER ====================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
