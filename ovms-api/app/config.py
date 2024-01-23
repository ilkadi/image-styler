import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger(__name__)

class Config:
    MODEL_SERVER_URL = os.getenv("MODEL_SERVER_URL", "localhost")
    MODEL_SERVER_PORT = os.getenv("MODEL_SERVER_PORT", "8081")
    CORS_FRONTEND_URL = os.getenv("CORS_FRONTEND_URL", "localhost")
    CORS_FRONTEND_PORT = os.getenv("CORS_FRONTEND_PORT", "3001")
    CORS_ALLOWED_ORIGINS_WEB = [
        f"http://{CORS_FRONTEND_URL}:{CORS_FRONTEND_PORT}",
        f"http://{CORS_FRONTEND_URL}",
    ]
    MODEL_SERVER_MODELS_URL = f"{MODEL_SERVER_URL}:{MODEL_SERVER_PORT}"
    SUPPORTED_MODELS = {
        "Candy": {
            "model_name": "candy",
            "model_version": "9",
            "model_xy_size": (224, 224),
            "input_name": "input1",
            "output_name": "predictions"
        },
        "Mosaic": {
            "model_name": "mosaic",
            "model_version": "9",
            "model_xy_size": (224, 224),
            "input_name": "input1",
            "output_name": "predictions"
        },
        "Pointilism": {
            "model_name": "pointilism",
            "model_version": "9",
            "model_xy_size": (224, 224),
            "input_name": "input1",
            "output_name": "predictions"
        },
        "Rain-Princess": {
            "model_name": "rain_princess",
            "model_version": "9",
            "model_xy_size": (224, 224),
            "input_name": "input1",
            "output_name": "predictions"
        },
        "Udnie": {
            "model_name": "udnie",
            "model_version": "9",
            "model_xy_size": (224, 224),
            "input_name": "input1",
            "output_name": "predictions"
        }
    }

def configure_logging():
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
    )
configure_logging()

def configure_fast_api():
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=Config.CORS_ALLOWED_ORIGINS_WEB,
        allow_credentials=True,
        allow_methods=["*"],  # Allows all methods
        allow_headers=["*"],  # Allows all headers
    )
    logger.info(f"CORS set for origins: {Config.CORS_ALLOWED_ORIGINS_WEB}")
    return app