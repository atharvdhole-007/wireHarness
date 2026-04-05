from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Wire Harness Scanner API", version="1.0.0")

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
from app.api.v1.scan import router as scan_router
app.include_router(scan_router)

@app.get("/")
async def root():
    return {"message": "🚀 Wire Harness Scanner Backend Ready v1.0", "endpoints": ["/api/v1/scan"]}

@app.get("/health")
async def health():
    return {"status": "healthy", "florence_loaded": True}