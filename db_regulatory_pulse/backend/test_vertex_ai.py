import os
import sys
import json

PROJECT_ID = "tensile-oarlock-500904-d4"
CREDENTIALS_PATH = r"C:\Users\Shubhangi Yadav\PycharmProjects\tensile-oarlock-500904-d4-1d6cbf5e0d4c.json"

print("=" * 60)
print("🏦 Deutsche Bank AI Governance Companion - Vertex AI Test")
print("=" * 60)

if not os.path.exists(CREDENTIALS_PATH):
    print(f"❌ Credentials file not found at: {CREDENTIALS_PATH}")
    sys.exit(1)

try:
    import vertexai
    from vertexai.generative_models import GenerativeModel
    from google.oauth2 import service_account
except ImportError as e:
    print(f"❌ Library import failed: {e}")
    sys.exit(1)

try:
    creds = service_account.Credentials.from_service_account_file(CREDENTIALS_PATH)
    vertexai.init(project=PROJECT_ID, location="us-central1", credentials=creds)
    print(f"✅ Vertex AI initialized successfully in us-central1")
except Exception as e:
    print(f"❌ Initialization failed: {e}")
    sys.exit(1)

# Invoke Gemini 2.5 Flash
try:
    print("\n💬 Querying Gemini 2.5 Flash...")
    model = GenerativeModel("gemini-2.5-flash")
    
    prompt = "State in 1 sentence what the EU AI Act regulates."
    print(f"   Prompt: '{prompt}'")
    
    response = model.generate_content(
        prompt,
        generation_config={"temperature": 0.1, "max_output_tokens": 100}
    )
    print("\n🎉 Live Response received successfully:")
    print(f"   {response.text.strip()}")
    print("\n✅ Verification Successful! gemini-2.5-flash is accessible!")
except Exception as e:
    print(f"\n❌ Gemini model invocation failed: {e}")
    sys.exit(1)
