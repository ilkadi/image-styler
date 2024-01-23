import unittest
from PIL import Image
import numpy
from unittest.mock import patch, Mock
from inference_controller import InferenceController
import json
from PIL import ImageChops

class TestInferenceController(unittest.TestCase):
    def setUp(self):
        self.controller = InferenceController()

    def test_is_valid_image(self):
        # Test case 1: Valid image bytes
        with open("tests/resources/artworks-tower-500x500.jpg", "rb") as f:
            image_bytes = f.read()
        self.assertTrue(self.controller.is_valid_image(image_bytes))

        # Test case 2: Non-image bytes
        with open("tests/resources/normalized-artworks-tower-224x224.json", "rb") as f:
            non_image_bytes = f.read()
        self.assertFalse(self.controller.is_valid_image(non_image_bytes))

        # Test case 3: Non-existent bytes
        self.assertFalse(self.controller.is_valid_image(None))
    
    def test_process_image(self):
        # Test case 1: Process image successfully
        with open("tests/resources/artworks-tower-500x500.jpg", "rb") as f:
            image_bytes = f.read()
        model_server_url = "http://localhost:8000"
        model_name = "my_model"
        model_version = "1.0"
        input_name = "input"
        output_name = "output"
        model_xy_size = (224, 224)
        
        with open("tests/resources/normalized-artworks-tower-224x224.json", "r") as f:
            mock_output_tensor = json.load(f)
        np_image_mock = numpy.array(mock_output_tensor)

        mock_client = Mock()
        mock_client.get_model_metadata.return_value = {'outputs': [{'name': output_name}]}
        mock_client.infer.return_value = Mock(as_numpy=Mock(return_value=np_image_mock))

        with patch('tritonhttpclient.InferenceServerClient', return_value=mock_client):
            controller = InferenceController()
            result = controller.process_image(image_bytes, model_server_url, model_name, model_version, input_name, output_name, model_xy_size)

        assert result, "Result is empty"
        mock_client.get_model_metadata.assert_called_once_with(model_name=model_name, model_version=model_version)
        mock_client.infer.assert_called_once()
    
    def test_normalize_original_image(self):
        # Test case 1: Image with size (500, 500)
        expected_original_xy_size = (500, 500)
        expected_model_xy_size = (224, 224)
        with open("tests/resources/normalized-artworks-tower-224x224.json", "r") as f:
            expected_image_arr = json.load(f)
            
        with open("tests/resources/artworks-tower-500x500.jpg", "rb") as f:
            image_bytes = f.read()

        actual_image_arr, original_xy_size = self.controller.normalize_original_image(image_bytes, expected_model_xy_size)
        
        self.assertEqual(original_xy_size, expected_original_xy_size)
        numpy.testing.assert_array_equal(actual_image_arr, expected_image_arr)
    
    
    def test_denormalize_output_image(self):
        # Test case 1: Output tensor with shape (3, 224, 224)
        with open("tests/resources/normalized-artworks-tower-224x224.json", "r") as f:
            output_tensor = json.load(f)

        np_image = numpy.array(output_tensor)
        original_xy_size = (500, 500)
        actual_image_bytes = self.controller.denormalize_output_image(np_image, original_xy_size)
        
        expected_result = Image.open("tests/resources/artworks-tower-500x500-from-tensor.png").convert("RGB")
        actual_image = Image.open(actual_image_bytes)

        diff = ImageChops.difference(actual_image, expected_result).getbbox()        
        self.assertTrue(diff is None)

if __name__ == "__main__":
    unittest.main()