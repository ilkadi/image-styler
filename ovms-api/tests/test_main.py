import unittest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch, Mock

class TestMain(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_home(self):
        response = self.client.get("/v1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Hello from v1, Please call v1/stylecise with expected JSON input"})
        
    def test_get_styles(self):
        response = self.client.get("/v1/styles")
        self.assertEqual(response.status_code, 200)
        self.assertIn("styles", response.json())

    def test_stylecise(self):
        with open("tests/resources/artworks-tower-500x500.jpg", "rb") as f:
            image_bytes = f.read()
        out_bytes = (chunk for chunk in [image_bytes])
        mock_client = Mock()
        mock_client.process_image.return_value = out_bytes
        
        # Test case 1: Valid style and image
        with open("tests/resources/artworks-tower-500x500.jpg", "rb") as f:
            image = {"image": f}
            with patch('main.InferenceController', return_value=mock_client):
                response = self.client.post("/v1/stylecise/Mosaic", files=image)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["content-type"], "image/jpeg")

        # Test case 2: Unsupported style
        with open("tests/resources/artworks-tower-500x500.jpg", "rb") as f:
            image = {"image": f}
            response = self.client.post("/v1/stylecise/unsupported_style", files=image)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"detail": "Unsupported style: unsupported_style"})

        # Test case 3: Invalid image
        with open("tests/resources/normalized-artworks-tower-224x224.json", "rb") as f:
            image = {"image": f}
            response = self.client.post("/v1/stylecise/Mosaic", files=image)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"detail": "File is not an image. Please select an image file of correct format."})

if __name__ == "__main__":
    unittest.main()