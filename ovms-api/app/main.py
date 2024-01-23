#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import logging
import uvicorn
from fastapi import UploadFile, File
from fastapi.responses import StreamingResponse
from config import configure_logging, configure_fast_api, Config
from inference_controller import InferenceController
from fastapi import HTTPException

configure_logging()
logger = logging.getLogger(__name__)

app = configure_fast_api()

@app.get("/v1")
def home():
    return {"message": "Hello from v1, Please call v1/stylecise with expected JSON input"}

@app.get("/v1/styles")
def get_styles():
    """
    Get a list of available model styles.

    This endpoint returns a list of the keys of the `supported_models_dict` dictionary,
    which represent the available model styles.

    Returns:
        dict: a list of available model styles.
    """
    return {"styles": list(Config.SUPPORTED_MODELS.keys())}

@app.post("/v1/stylecise/{style}")
async def stylecise(style: str, image: UploadFile = File(...)):
    """
    Apply a specified style to an uploaded image.

    This endpoint accepts an image file and a style name as input, applies the specified style to the image,
    and returns the stylized image.

    Args:
        style (str): The name of the style to be applied. This should be a key in the `supported_models_dict` dictionary.
        image (UploadFile, optional): The image file to be stylized. Defaults to File(...).

    Returns:
        StreamingResponse: A StreamingResponse object that contains the stylized image.
    """
    inferenceController = InferenceController()
    unsupported_style_message = f"Unsupported style: {style}"
    if style not in Config.SUPPORTED_MODELS.keys():
        logger.error(unsupported_style_message)
        raise HTTPException(status_code=400, detail=unsupported_style_message)
    
    image_bytes = await image.read()
    is_image = inferenceController.is_valid_image(image_bytes)
    not_an_image_message = "File is not an image. Please select an image file of correct format."
    if not is_image:
        logger.error(not_an_image_message)
        raise HTTPException(status_code=400, detail=not_an_image_message)
    
    logger.info(f"Image {image.filename} [{len(image_bytes) / 1000}Kb] received to be styled in {style}.")
    out_bytes = inferenceController.process_image(image_bytes, Config.MODEL_SERVER_MODELS_URL, 
                                                  Config.SUPPORTED_MODELS[style]["model_name"], 
                                                  Config.SUPPORTED_MODELS[style]["model_version"], 
                                                  Config.SUPPORTED_MODELS[style]["input_name"], 
                                                  Config.SUPPORTED_MODELS[style]["output_name"], 
                                                  Config.SUPPORTED_MODELS[style]["model_xy_size"])
    return StreamingResponse(out_bytes, media_type='image/jpeg')


# =============================================================================
# EXECUTE
# =============================================================================
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3001)