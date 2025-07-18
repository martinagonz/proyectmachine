import uvicorn
import subprocess
import sys
import os

def install_requirements():
    """Install Python requirements"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def start_server():
    """Start FastAPI server"""
    print("🚀 Starting FastAPI server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    print("🎯 CS Headshot Predictor API")
    print("=" * 50)
    
    # Check if we're in the backend directory
    if not os.path.exists("main.py"):
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Install requirements
    if install_requirements():
        start_server()
    else:
        print("❌ Failed to start server due to installation errors")
        sys.exit(1)