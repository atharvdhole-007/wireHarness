from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from PIL import Image
import io

class ScanRequest(BaseModel):
    """Image upload request"""
    image: bytes = Field(..., description="Diagram image (PNG/JPG)")

class Detection(BaseModel):
    """VLM detection output"""
    type: str  # "wire", "connector", "splice"
    bbox: List[float]  # [x1,y1,x2,y2]
    label: Optional[str] = None
    confidence: float

class NetlistConnection(BaseModel):
    """Final netlist edge"""
    from_pin: str
    to_pin: str
    wire_id: str
    length_px: float

class ScanResponse(BaseModel):
    """Complete scan result"""
    cleaned_image: bytes  # Preprocessed image
    detections: List[Detection]
    netlist: List[NetlistConnection]
    metrics: Dict[str, Any] = {}
    status: str = "success"

# Global model cache (hackathon speed)
FLORENCE_MODEL = None
FLORENCE_PROCESSOR = None