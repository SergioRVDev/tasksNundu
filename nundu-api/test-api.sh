#!/bin/bash

API_URL="http://localhost:3001"

echo "🧪 Testing Nundu API"
echo "===================="

# Test Tasks
echo -e "\n📋 Testing Tasks..."

# Create task
TASK=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "assignedTo": "dev1",
    "state": "to-do",
    "sprint": "Sprint 1"
  }')

TASK_ID=$(echo $TASK | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ Task created: $TASK_ID"

# Get all tasks
echo "✅ Get all tasks:"
curl -s "$API_URL/tasks" | jq '.'

# Test Developers
echo -e "\n👨‍💻 Testing Developers..."

# Create developer
DEV=$(curl -s -X POST "$API_URL/developers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "Frontend Developer"
  }')

DEV_ID=$(echo $DEV | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ Developer created: $DEV_ID"

# Get all developers
echo "✅ Get all developers:"
curl -s "$API_URL/developers" | jq '.'

# Test Sprints
echo -e "\n🏃 Testing Sprints..."

# Create sprint
SPRINT=$(curl -s -X POST "$API_URL/sprints" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sprint 1",
    "startDate": "2024-02-18",
    "endDate": "2024-03-03",
    "status": "planning"
  }')

SPRINT_ID=$(echo $SPRINT | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ Sprint created: $SPRINT_ID"

# Get all sprints
echo "✅ Get all sprints:"
curl -s "$API_URL/sprints" | jq '.'

echo -e "\n✨ All tests completed!"
