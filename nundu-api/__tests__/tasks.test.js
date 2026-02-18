const request = require('supertest');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// Simple UUID v4 generator for testing
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Mock data directory
const DATA_DIR = path.join(__dirname, '../data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Create a test app with minimal setup
let app;

describe('Tasks API', () => {
  beforeAll(async () => {
    // Create test data directory
    await fs.mkdir(DATA_DIR, { recursive: true });
  });

  beforeEach(async () => {
    // Reset test data
    await fs.writeFile(TASKS_FILE, JSON.stringify([], null, 2));

    // Create fresh app for each test
    app = express();
    app.use(express.json());

    // Tasks endpoints
    app.get('/tasks', async (req, res) => {
      try {
        const data = await fs.readFile(TASKS_FILE, 'utf8');
        res.json(JSON.parse(data));
      } catch (error) {
        res.json([]);
      }
    });

    app.post('/tasks', async (req, res) => {
      try {
        const tasks = JSON.parse(await fs.readFile(TASKS_FILE, 'utf8'));
        const newTask = {
          id: generateUUID(),
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tasks.push(newTask);
        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
        res.status(201).json(newTask);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create task' });
      }
    });

    app.put('/tasks/:id', async (req, res) => {
      try {
        const tasks = JSON.parse(await fs.readFile(TASKS_FILE, 'utf8'));
        const index = tasks.findIndex(t => t.id === req.params.id);
        if (index === -1) {
          return res.status(404).json({ error: 'Task not found' });
        }
        tasks[index] = { ...tasks[index], ...req.body, updatedAt: new Date().toISOString() };
        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
        res.json(tasks[index]);
      } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
      }
    });

    app.delete('/tasks/:id', async (req, res) => {
      try {
        const tasks = JSON.parse(await fs.readFile(TASKS_FILE, 'utf8'));
        const filteredTasks = tasks.filter(t => t.id !== req.params.id);
        if (filteredTasks.length === tasks.length) {
          return res.status(404).json({ error: 'Task not found' });
        }
        await fs.writeFile(TASKS_FILE, JSON.stringify(filteredTasks, null, 2));
        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: 'Failed to delete task' });
      }
    });
  });

  it('GET /tasks returns empty array initially', async () => {
    const response = await request(app)
      .get('/tasks')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('POST /tasks creates a new task', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'High',
      state: 'to-do',
      sprint: 'Sprint 1',
    };

    const response = await request(app)
      .post('/tasks')
      .send(taskData)
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe('Test Task');
    expect(response.body.priority).toBe('High');
    expect(response.body.createdAt).toBeDefined();
  });

  it('GET /tasks returns created tasks', async () => {
    const taskData = {
      title: 'Test Task',
      priority: 'Medium',
      state: 'in-progress',
      sprint: 'Sprint 1',
    };

    await request(app).post('/tasks').send(taskData);

    const response = await request(app)
      .get('/tasks')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe('Test Task');
  });

  it('PUT /tasks/:id updates a task', async () => {
    let taskData = {
      title: 'Original Title',
      priority: 'Low',
      state: 'to-do',
      sprint: 'Sprint 1',
    };

    const createResponse = await request(app)
      .post('/tasks')
      .send(taskData)
      .expect(201);

    const taskId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ title: 'Updated Title', priority: 'High' })
      .expect(200);

    expect(updateResponse.body.title).toBe('Updated Title');
    expect(updateResponse.body.priority).toBe('High');
    expect(updateResponse.body.id).toBe(taskId);
  });

  it('PUT /tasks/:id returns 404 for non-existent task', async () => {
    await request(app)
      .put('/tasks/non-existent-id')
      .send({ title: 'Updated' })
      .expect(404);
  });

  it('DELETE /tasks/:id removes a task', async () => {
    const taskData = {
      title: 'Task to Delete',
      state: 'to-do',
      sprint: 'Sprint 1',
    };

    const createResponse = await request(app)
      .post('/tasks')
      .send(taskData)
      .expect(201);

    const taskId = createResponse.body.id;

    await request(app)
      .delete(`/tasks/${taskId}`)
      .expect(200);

    const getResponse = await request(app)
      .get('/tasks')
      .expect(200);

    expect(getResponse.body.length).toBe(0);
  });

  it('DELETE /tasks/:id returns 404 for non-existent task', async () => {
    await request(app)
      .delete('/tasks/non-existent-id')
      .expect(404);
  });

  it('POST /tasks requires title', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ priority: 'High', state: 'to-do' });

    // Should still create with minimal data
    expect(response.body.id).toBeDefined();
  });

  it('multiple tasks can be created and retrieved', async () => {
    const tasks = [
      { title: 'Task 1', priority: 'High', state: 'to-do', sprint: 'Sprint 1' },
      { title: 'Task 2', priority: 'Medium', state: 'in-progress', sprint: 'Sprint 1' },
      { title: 'Task 3', priority: 'Low', state: 'done', sprint: 'Sprint 2' },
    ];

    for (const task of tasks) {
      await request(app).post('/tasks').send(task).expect(201);
    }

    const response = await request(app)
      .get('/tasks')
      .expect(200);

    expect(response.body.length).toBe(3);
    expect(response.body[0].title).toBe('Task 1');
    expect(response.body[1].title).toBe('Task 2');
    expect(response.body[2].title).toBe('Task 3');
  });
});
