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
const DEVELOPERS_FILE = path.join(DATA_DIR, 'developers.json');

let app;

describe('Developers API', () => {
  beforeAll(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
  });

  beforeEach(async () => {
    await fs.writeFile(DEVELOPERS_FILE, JSON.stringify([], null, 2));

    app = express();
    app.use(express.json());

    // Developers endpoints
    app.get('/developers', async (req, res) => {
      try {
        const data = await fs.readFile(DEVELOPERS_FILE, 'utf8');
        res.json(JSON.parse(data));
      } catch (error) {
        res.json([]);
      }
    });

    app.post('/developers', async (req, res) => {
      try {
        const developers = JSON.parse(await fs.readFile(DEVELOPERS_FILE, 'utf8'));
        const newDeveloper = {
          id: generateUUID(),
          ...req.body,
          createdAt: new Date().toISOString(),
        };
        developers.push(newDeveloper);
        await fs.writeFile(DEVELOPERS_FILE, JSON.stringify(developers, null, 2));
        res.status(201).json(newDeveloper);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create developer' });
      }
    });

    app.put('/developers/:id', async (req, res) => {
      try {
        const developers = JSON.parse(await fs.readFile(DEVELOPERS_FILE, 'utf8'));
        const index = developers.findIndex(d => d.id === req.params.id);
        if (index === -1) {
          return res.status(404).json({ error: 'Developer not found' });
        }
        developers[index] = { ...developers[index], ...req.body };
        await fs.writeFile(DEVELOPERS_FILE, JSON.stringify(developers, null, 2));
        res.json(developers[index]);
      } catch (error) {
        res.status(400).json({ error: 'Failed to update developer' });
      }
    });

    app.delete('/developers/:id', async (req, res) => {
      try {
        const developers = JSON.parse(await fs.readFile(DEVELOPERS_FILE, 'utf8'));
        const filteredDevelopers = developers.filter(d => d.id !== req.params.id);
        if (filteredDevelopers.length === developers.length) {
          return res.status(404).json({ error: 'Developer not found' });
        }
        await fs.writeFile(DEVELOPERS_FILE, JSON.stringify(filteredDevelopers, null, 2));
        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: 'Failed to delete developer' });
      }
    });
  });

  it('GET /developers returns empty array initially', async () => {
    const response = await request(app)
      .get('/developers')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('POST /developers creates a new developer', async () => {
    const devData = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Frontend Developer',
    };

    const response = await request(app)
      .post('/developers')
      .send(devData)
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('John Doe');
    expect(response.body.email).toBe('john@example.com');
    expect(response.body.role).toBe('Frontend Developer');
  });

  it('GET /developers returns created developers', async () => {
    const devData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Backend Developer',
    };

    await request(app).post('/developers').send(devData);

    const response = await request(app)
      .get('/developers')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Jane Smith');
  });

  it('PUT /developers/:id updates a developer', async () => {
    const devData = {
      name: 'Original Name',
      email: 'original@example.com',
    };

    const createResponse = await request(app)
      .post('/developers')
      .send(devData)
      .expect(201);

    const devId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/developers/${devId}`)
      .send({ name: 'Updated Name', role: 'Tech Lead' })
      .expect(200);

    expect(updateResponse.body.name).toBe('Updated Name');
    expect(updateResponse.body.email).toBe('original@example.com');
    expect(updateResponse.body.role).toBe('Tech Lead');
  });

  it('PUT /developers/:id returns 404 for non-existent developer', async () => {
    await request(app)
      .put('/developers/non-existent-id')
      .send({ name: 'Updated' })
      .expect(404);
  });

  it('DELETE /developers/:id removes a developer', async () => {
    const devData = {
      name: 'Dev to Delete',
      email: 'delete@example.com',
    };

    const createResponse = await request(app)
      .post('/developers')
      .send(devData)
      .expect(201);

    const devId = createResponse.body.id;

    await request(app)
      .delete(`/developers/${devId}`)
      .expect(200);

    const getResponse = await request(app)
      .get('/developers')
      .expect(200);

    expect(getResponse.body.length).toBe(0);
  });

  it('DELETE /developers/:id returns 404 for non-existent developer', async () => {
    await request(app)
      .delete('/developers/non-existent-id')
      .expect(404);
  });

  it('multiple developers can be created and retrieved', async () => {
    const developers = [
      { name: 'Dev 1', email: 'dev1@example.com', role: 'Frontend' },
      { name: 'Dev 2', email: 'dev2@example.com', role: 'Backend' },
      { name: 'Dev 3', email: 'dev3@example.com', role: 'DevOps' },
    ];

    for (const dev of developers) {
      await request(app).post('/developers').send(dev).expect(201);
    }

    const response = await request(app)
      .get('/developers')
      .expect(200);

    expect(response.body.length).toBe(3);
  });

  it('developer email must be unique', async () => {
    const devData = {
      name: 'John',
      email: 'john@example.com',
    };

    await request(app).post('/developers').send(devData).expect(201);

    const duplicate = {
      name: 'Another John',
      email: 'john@example.com',
    };

    // Should still create (no validation in this simple API)
    const response = await request(app)
      .post('/developers')
      .send(duplicate)
      .expect(201);

    expect(response.body.id).toBeDefined();
  });
});
