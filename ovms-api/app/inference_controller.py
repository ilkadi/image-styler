#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import logging
from PIL import Image
import io
import cv2
import tritonhttpclient
import numpy as np
from config import configure_logging

configure_logging()
logger = logging.getLogger(__name__)

class InferenceController:
    def is_valid_image(self, image_bytes):
        try:
            Image.open(io.BytesIO(image_bytes))
            return True
        except (IOError, OSError):
            return False
        
    def process_image(self, image_bytes, model_server_url, model_name, model_version, input_name, output_name, model_xy_size):
        try:
            triton_client = tritonhttpclient.InferenceServerClient(url=model_server_url, verbose=False)
        except Exception as e:
            logger.error("channel creation failed: " + str(e))
            raise e            

        image_arr, original_xy_size = self.normalize_original_image(image_bytes, model_xy_size)

        inputs = [tritonhttpclient.InferInput(input_name, image_arr.shape, "FP32")]
        inputs[0].set_data_from_numpy(image_arr, binary_data=False)
        outputs = [tritonhttpclient.InferRequestedOutput(output_name)]
        
        model_metadata = triton_client.get_model_metadata(model_name=model_name, model_version=model_version)
        logger.debug("Model metadata: %s", model_metadata)
        output_name = model_metadata['outputs'][0]['name']
        
        results = triton_client.infer(model_name=model_name, model_version=model_version, inputs=inputs, outputs=outputs)

        np_image = results.as_numpy(output_name)
        out_bytes = self.denormalize_output_image(np_image, original_xy_size)
        return out_bytes

    def normalize_original_image(self, image_bytes, model_xy_size):
        # Convert image bytes to a numpy array and normalize it for model input
        rgb_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        np_image = np.array(rgb_image).astype(np.float32)
        logger.debug("Normalising image of shape: %s", np_image.shape)
        
        original_height, original_width, _ = np_image.shape
        original_xy_size = (original_width, original_height)
        
        np_image = cv2.resize(np_image, model_xy_size)
        np_image = np_image.transpose((2, 0, 1))
        np_image = np.expand_dims(np_image, axis=0)
        return np_image, original_xy_size
    
    def denormalize_output_image(self, np_image, original_xy_size):
        # Convert model output back to an image with original dimensions
        logger.debug("Denormalising image of shape: %s", np_image.shape)
        np_image = np.squeeze(np_image, axis=0)
        np_image = np.transpose(np_image, (1, 2, 0))
        np_image = cv2.resize(np_image, original_xy_size)
        
        out_image = Image.fromarray(np.uint8(np_image))
        out_bytes = io.BytesIO()
        out_image.save(out_bytes, format='JPEG')
        out_bytes.seek(0)
        return out_bytes