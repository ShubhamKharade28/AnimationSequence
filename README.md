# 🎞️ AnimationSequence

**AnimationSequence** is a processing pipeline that extracts, analyzes, and generates animation data from Autodesk Inventor assembly files. It integrates Inventor export, 3D model analysis, and sequence generation using structured JSON inputs.

---

## 🧩 Pipeline Overview

1. **Inventor Export**
   - Executes: `inventor/InventorExporterAlgo.exe`
   - Reads: Files from `upload/`
   - Outputs:
     - `inputs/assembly_data.json` — contains:
       - Components
       - Constraints
       - Joints
     - Intermediate data used in further steps

2. **Model Derivative API**
    - Executes: `model_derivative_api/main.py`
    - Reads: Files from `upload/`
    - Outputs:
        - `inputs/object_hierarchy.json`
        - `inputs/properties.json`
        - Additional data in `responses/` (e.g., geometry, metadata)

3. **Animation Sequence Generation**
    - Executes: `main.js` using `node main`
    - Uses all data from `inputs/` (`assembly_data.json`, `object_hierarchy.json`, `properties.json`)
    - Processes component relationships, motion constraints, and structural hierarchy
    - Generates time-based animation sequences using `generate_animation.js`

4. **Output**
    - Saves the animation sequence to disk
    - Later, this data will be served to the client via a Node.js server

---

## 📁 Directory Structure

