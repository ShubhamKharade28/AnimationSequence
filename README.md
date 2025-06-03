# AnimationSequence

1. Execute inventor/InventorExporterAlgo.exe 
    - This stores the assembly_data.json (components, constraints, joints, etc) in inputs/
    - Uses upload/

2. Execute model_derivative_api/main.py
    - This stores object_hierarchy.json and properties.json in inputs/
    - and other all jsons in responses/
    - uses upload/

3. Develop the algorithm or method that uses inputs/json and produces animation sequence

4. Store animation sequence (for now) 
    - Later it will be sent to client via nodejs server