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

const DATA_DIR = path.join(__dirname, '../data');
const SPRINTS_FILE = path.join(DATA_DIR, 'sprints.json');

let app;

describe('Sprints API', () => {
  beforeAll(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
  });

  beforeEach(async () => {
    await fs.writeFile(SPRINTS_FILE, JSON.stringify([], null, 2));

    app = express();
    app.use(express.json());

    // Sprints endpoints
    app.get('/sprints', async (req, res) => {
      try {
        const data = await fs.readFile(SPRINTS_FILE, 'utf8');
        res.json(JSON.parse(data));
      } catch (error) {
        res.json([]);
      }
    });

    app.post('/sprints', async (req, res) => {
      try {
        const sprints = JSON.parse(await fs.readFile(SPRINTS_FILE, 'utf8'));
        const newSprint = {
          id: generateUUID(),
          ...req.body,
          createdAt: new Date().toISOString(),
        };
        sprints.push(newSprint);
        await fs.writeFile(SPRINTS_FILE, JSON.stringify(sprints, null, 2));
        res.status(201).json(newSprint);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create sprint' });
      }
    });

    app.put('/sprints/:id', async (req, res) => {
      try {
        const sprints = JSON.parse(await fs.readFile(SPRINTS_FILE, 'utf8'));
        const index = sprints.findIndex(s => s.id === req.params.id);
        if (index === -1) {
          return res.status(404).json({ error: 'Sprint not found' });
        }
        sprints[index] = { ...sprints[index], ...req.body };
        await fs.writeFile(SPRINTS_FILE, JSON.stringify(sprints, null, 2));
        res.json(sprints[index]);
      } catch (error) {
        res.status(400).json({ error: 'Failed to update sprint' });
      }
    });

    app.delete('/sprints/:id', async (req, res) => {
      try {
        const sprints = JSON.parse(await fs.readFile(SPRINTS_FILE, 'utf8'));
        const filteredSprints = sprints.filter(s => s.id !== req.params.id);
        if (filteredSprints.length === sprints.length) {
          return res.status(404).json({ error: 'Sprint not found' });
        }
        await fs.writeFile(SPRINTS_FILE, JSON.stringify(filteredSprints, null, 2));
        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: 'Failed to delete sprint' });
      }
    });
  });

  it('GET /sprints returns empty array initially', async () => {
    const response = await request(app)
      .get('/sprints')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('POST /sprints creates a new sprint', async () => {
    const sprintData = {
      name: 'Sprint 1',
      startDate: '2026-02-18',
      endDate: '2026-03-04',
      status: 'active',
    };

    const response = await request(app)
      .post('/sprints')
      .send(sprintData)
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('Sprint 1');
    expect(response.body.status).toBe('active');
    expect(response.body.createdAt).toBeDefined();
  });

  it('GET /sprints returns created sprints', async () => {
    const sprintData = {
      name: 'Sprint 2',
      status: 'planning',
    };

    await request(app).post('/sprints').send(sprintData);

    const response = await request(app)
      .get('/sprints')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Sprint 2');
  });

  it('PUT /sprints/:id updates a sprint', async () => {
    const sprintData = {
      name: 'Original Sprint',
      status: 'planning',
    };

    const createResponse = await request(app)
      .post('/sprints')
      .send(sprintData)
      .expect(201);

    const sprintId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/sprints/${sprintId}`)
      .send({ name: 'Updated Sprint', status: 'active' })
      .expect(200);

    expect(updateResponse.body.name).toBe('Updated Sprint');
    expect(updateResponse.body.status).toBe('active');
    expect(updateResponse.body.id).toBe(sprintId);
  });

  it('PUT /sprints/:id returns 404 for non-existent sprint', async () => {
    await request(app)
      .put('/sprints/non-existent-id')
      .send({ name: 'Updated' })
      .expect(404);
  });

  it('DELETE /sprints/:id removes a sprint', async () => {
    const sprintData = {
      name: 'Sprint to Delete',
      status: 'completed',
    };

    const createResponse = await request(app)
      .post('/sprints')
      .send(sprintData)
      .expect(201);

    const sprintId = createResponse.body.id;

    await request(app)
      .delete(`/sprints/${sprintId}`)
      .expect(200);

    const getResponse = await request(app)
      .get('/sprints')
      .expect(200);

    expect(getResponse.body.length).toBe(0);
  });

  it('DELETE /sprints/:id returns 404 for non-existent sprint', async () => {
    await request(app)
      .delete('/sprints/non-existent-id')
      .expect(404);
  });

  it('multiple sprints can be created and retrieved', async () => {
    const sprints = [
      { name: 'Sprint 1', status: 'active' },
      { name: 'Sprint 2', status: 'planning' },
      { name: 'Sprint 3', status: 'completed' },
    ];

    for (const sprint of sprints) {
      await request(app).post('/sprints').send(sprint).expect(201);
    }

    const response = await request(app)
      .get('/sprints')
      .expect(200);

    expect(response.body.length).toBe(3);
    expect(response.body[0].name).toBe('Sprint 1');
    expect(response.body[1].name).toBe('Sprint 2');
    expect(response.body[2].name).toBe('Sprint 3');
  });

  it('sprint can be created with only name', async () => {
    const sprintData = {
      name: 'Minimal Sprint',
    };

    const response = await request(app)
      .post('/sprints')
      .send(sprintData)
      .expect(201);

    expect(response.body.name).toBe('Minimal Sprint');
    expect(response.body.id).toBeDefined();
  });
});
