from typing import List
from ..models.scan import Detection, NetlistConnection
import numpy as np

def create_netlist(detections: List[Detection]) -> List[NetlistConnection]:
    """Geometric post-processing: snap wires to nearest connectors"""
    wires = [d for d in detections if d.type == "wire"]
    connectors = [d for d in detections if d.type == "connector"]
    
    netlist = []
    for i, wire in enumerate(wires):
        # Demo connections (real: calculate distance to connector centers)
        if connectors:
            netlist.append(NetlistConnection(
                from_pin=connectors[0].label or f"ConnA",
                to_pin=connectors[-1].label or f"ConnB", 
                wire_id=wire.label or f"wire_{i+1}",
                length_px=150.5
            ))
    
    return netlist