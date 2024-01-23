import unittest
from fastapi.testclient import TestClient
from app.config import configure_fast_api, Config

class TestConfig(unittest.TestCase):
    def setUp(self):
        self.app = configure_fast_api()
        self.client = TestClient(self.app)
        
    def test_model_server_url(self):
        self.assertEqual(Config.MODEL_SERVER_URL, "localhost")

    def test_model_server_port(self):
        self.assertEqual(Config.MODEL_SERVER_PORT, "8081")

    def test_cors_frontend_url(self):
        self.assertEqual(Config.CORS_FRONTEND_URL, "localhost")

    def test_cors_frontend_port(self):
        self.assertEqual(Config.CORS_FRONTEND_PORT, "3001")

    def test_model_server_models_url(self):
        self.assertEqual(Config.MODEL_SERVER_MODELS_URL, "localhost:8081")

    def test_supported_models(self):
        self.assertIn("Mosaic", Config.SUPPORTED_MODELS)
        self.assertEqual(
            Config.SUPPORTED_MODELS["Mosaic"]["model_name"], "fast-neural-style-mosaic"
        )
        self.assertEqual(Config.SUPPORTED_MODELS["Mosaic"]["model_version"], "1")
        self.assertEqual(Config.SUPPORTED_MODELS["Mosaic"]["model_xy_size"], (224, 224))
        self.assertEqual(Config.SUPPORTED_MODELS["Mosaic"]["input_name"], "input1")
        self.assertEqual(Config.SUPPORTED_MODELS["Mosaic"]["output_name"], "predictions")

if __name__ == "__main__":
    unittest.main()