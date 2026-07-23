import os
import json

WORKFLOW_DIR = r"D:\Innovate_6.0\CareerOS_Innovik_6.0\infra\n8n\workflows"
ERROR_WORKFLOW_NAME = "99_global_error_handler"

def refactor_workflows():
    for filename in os.listdir(WORKFLOW_DIR):
        if not filename.endswith(".json") or filename == f"{ERROR_WORKFLOW_NAME}.json":
            continue
            
        filepath = os.path.join(WORKFLOW_DIR, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                continue
                
        # 1. Inject Global Error Handler Settings
        if "settings" not in data:
            data["settings"] = {}
        data["settings"]["errorWorkflow"] = ERROR_WORKFLOW_NAME
        
        # 2. Fix Webhook Async Response Mode on Master Router
        if filename == "00_master_router.json":
            for node in data.get("nodes", []):
                if node.get("type") == "n8n-nodes-base.webhook":
                    node["parameters"]["responseMode"] = "onReceived"
                    print("Updated 00_master_router.json responseMode to onReceived")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

if __name__ == "__main__":
    refactor_workflows()
    print("Successfully injected error handlers and fixed async webhooks.")
