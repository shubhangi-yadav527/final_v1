import os
import sys
import json

PROJECT_ID = "tensile-oarlock-500904-d4"
CREDENTIALS_PATH = r"C:\Users\Shubhangi Yadav\PycharmProjects\tensile-oarlock-500904-d4-1d6cbf5e0d4c.json"

print("=" * 70)
print("🏦 Vertex AI Model Access Lister")
print("=" * 70)

if not os.path.exists(CREDENTIALS_PATH):
    print(f"❌ Credentials file not found at {CREDENTIALS_PATH}")
    sys.exit(1)

# Set environment variables for authentication
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = CREDENTIALS_PATH

try:
    from google import genai
    from google.genai import types
    print("✅ google-genai SDK imported successfully.")
except ImportError:
    print("❌ google-genai SDK not found. Install with: pip install google-genai")
    sys.exit(1)

# List models in different regions
regions = ["us-central1", "europe-west3", "us-east4"]

for region in regions:
    print(f"\n🌍 Querying models in region: {region}...")
    try:
        client = genai.Client(
            vertexai=True,
            project=PROJECT_ID,
            location=region
        )
        
        # List models
        response = client.models.list()
        
        print(f"   Success! Available models in {region}:")
        count = 0
        for model in response:
            count += 1
            # print basic model attributes
            print(f"   ├─ ID: {model.name}")
            actions = getattr(model, 'supported_actions', []) or []
            desc = getattr(model, 'description', '') or 'No description'
            print(f"   │  Supported Actions: {actions}")
            print(f"   │  Description: {desc[:60]}...")
            print("   │")
        if count == 0:
            print("   ⚠️ No models returned for this region.")
            
    except Exception as e:
        print(f"   ❌ Failed to list models in {region}:")
        print(f"      {str(e).split('\n')[0]}")
