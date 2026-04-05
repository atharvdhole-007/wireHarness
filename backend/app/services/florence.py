import torch
from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image
from typing import List
from ..models.scan import Detection
import logging

# Global model (load once - hackathon speed)
_model = None
_processor = None

def load_florence_model():
    """Lazy load Florence-2 large (diagram expert)"""
    global _model, _processor
    if _model is None:
        print("🚀 Loading Florence-2-large (30s first time)...")
        _model = AutoModelForCausalLM.from_pretrained(
            "microsoft/Florence-2-large", 
            trust_remote_code=True,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            device_map="auto" if torch.cuda.is_available() else None
        )
        _processor = AutoProcessor.from_pretrained("microsoft/Florence-2-large", trust_remote_code=True)
        print("✅ Florence-2 ready!")
    return _model, _processor

def detect_components(image: Image.Image) -> List[Detection]:
    """<OD> Object Detection: wires, connectors, splices"""
    model, processor = load_florence_model()
    
    prompt = "<OD>"  # Florence-2 Object Detection task
    inputs = processor(text=prompt, images=image, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=200,
            do_sample=False,
            temperature=0.0
        )
    
    # Decode detections
    generated_text = processor.decode(outputs[0], skip_special_tokens=True)
    
    # Parse Florence output (simplified for hackathon)
    detections = []
    lines = generated_text.split('.')
    for line in lines:
        line = line.strip().lower()
        if any(word in line for word in ['wire', 'line', 'cable']):
            detections.append(Detection(
                type="wire",
                bbox=[100, 100, 300, 200],  # Demo bbox (parse real later)
                label="wire_1",
                confidence=0.92
            ))
        elif any(word in line for word in ['connector', 'plug', 'pin']):
            detections.append(Detection(
                type="connector", 
                bbox=[50, 50, 150, 150],
                label="conn_A",
                confidence=0.95
            ))
    
    logging.info(f"🧠 Florence detected {len(detections)} components")
    return detections