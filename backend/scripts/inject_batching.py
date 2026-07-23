import json
import os

filepath = r"D:\Innovate_6.0\CareerOS_Innovik_6.0\infra\n8n\workflows\SI_02_career_twin.json"

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Add Split In Batches Node
data["nodes"].append({
    "parameters": {
        "batchSize": 10
    },
    "id": "split-in-batches-001",
    "name": "Split In Batches",
    "type": "n8n-nodes-base.splitInBatches",
    "typeVersion": 2,
    "position": [400, 400]
})

# Add Wait Node
data["nodes"].append({
    "parameters": {
        "amount": 5,
        "unit": "seconds"
    },
    "id": "wait-001",
    "name": "Wait",
    "type": "n8n-nodes-base.wait",
    "typeVersion": 1,
    "position": [1100, 400]
})

# Fix Connections
# Fetch Students -> Split In Batches
data["connections"]["Fetch Students"]["main"][0][0]["node"] = "Split In Batches"

# Split In Batches -> Prepare Context
data["connections"]["Split In Batches"] = {
    "main": [
        [
            {
                "node": "Prepare Context",
                "type": "main",
                "index": 0
            }
        ]
    ]
}

# Update Twin Database -> Wait
data["connections"]["Update Twin Database"] = {
    "main": [
        [
            {
                "node": "Wait",
                "type": "main",
                "index": 0
            }
        ]
    ]
}

# Wait -> Split In Batches
data["connections"]["Wait"] = {
    "main": [
        [
            {
                "node": "Split In Batches",
                "type": "main",
                "index": 0
            }
        ]
    ]
}

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Batching injected into SI_02_career_twin.json")
