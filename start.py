import os
import sys
import webbrowser
import subprocess
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

def run_backend():
    print("[BACKEND] Starting FastAPI on http://127.0.0.1:8000 ...")
    subprocess.run([sys.executable, os.path.join(BACKEND_DIR, "run.py")])

def run_frontend():
    os.chdir(FRONTEND_DIR)
    server_address = ('127.0.0.1', 3000)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print("[FRONTEND] Serving 3D Digital Twin UI on http://127.0.0.1:3000 ...")
    httpd.serve_forever()

if __name__ == "__main__":
    print("==========================================================")
    print("  Intelligent Flood Digital Twin - High-Efficiency Runner ")
    print("==========================================================")
    
    # Start Backend in thread
    t_back = threading.Thread(target=run_backend, daemon=True)
    t_back.start()
    
    time.sleep(1.5)
    
    # Open browser
    webbrowser.open("http://127.0.0.1:3000")
    
    # Run Frontend
    run_frontend()
