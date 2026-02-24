#!/bin/bash

# Test Reservation API
# Sends a POST request to create a new reservation
# Requires the Next.js server to be running on localhost:3000

echo "Sending test reservation request..."

curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "date": "2026-12-25",
    "guests": 2,
    "type": "tour",
    "tourName": "Test Tour",
    "notes": "Testing API fix"
  }' | json_pp

echo -e "\n\nRequest completed."
