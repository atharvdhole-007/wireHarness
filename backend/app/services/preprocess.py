import cv2
import numpy as np
from PIL import Image
import io

def preprocess_image(image_bytes: bytes) -> Image.Image:
    """
    OpenCV Pipeline: Denoise → Threshold → Morphology
    Returns PIL Image for Florence-2
    """
    # Load image
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 1. Denoise (legacy scan noise)
    denoised = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)
    
    # 2. Grayscale + Adaptive threshold (faded ink)
    gray = cv2.cvtColor(denoised, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 11, 2
    )
    
    # 3. Morphology - connect broken wires
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    
    # 4. Convert back to PIL RGB for VLM
    cleaned_rgb = cv2.cvtColor(cleaned, cv2.COLOR_GRAY2RGB)
    pil_image = Image.fromarray(cleaned_rgb)
    
    # Return cleaned bytes for response
    output = io.BytesIO()
    pil_image.save(output, format='PNG')
    return output.getvalue(), pil_image  # (bytes, PIL)