import os
import openvino as ov

core = ov.Core()

onnx_models_path = 'original-models/onnx'

# Get a list of all ONNX model files in the directory
model_files = [f for f in os.listdir(onnx_models_path) if f.endswith('.onnx')]

# Process each model file
for i, model_file in enumerate(model_files, start=1):
    model_name, model_version = os.path.splitext(model_file)[0].split('-')
    
    # Read the model
    model = core.read_model(model=os.path.join(onnx_models_path, model_file))

    # Create the directory for the model if it does not exist
    model_dir = f"models/{model_name}/{model_version}"
    os.makedirs(model_dir, exist_ok=True)

    # Save the model
    ov.save_model(model, output_model=f"{model_dir}/{model_name}.xml")