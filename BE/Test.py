
from flask import Flask, request,jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import concatenate
import cv2
import numpy as np



app = Flask(__name__)
CORS(app)

image = cv2.imread('C:\\Users\\HP\\Desktop\\Final_Year_Project\\Test-Images\\Real.jpg')
resized_image = cv2.resize(image, (225, 225))
image_reshaped = np.reshape(resized_image, (1, 225, 225, 3))

Base_effecientnet= load_model('C:\\Users\\HP\\Desktop\\Final_Year_Project\\Models\\BaseEffecienNetB2ForEFFandRes.h5')
Base_resNet= load_model('C:\\Users\\HP\\Desktop\\Final_Year_Project\\Models\\BaseResNetForEFFandRes.h5')
Ensemble_model= load_model('C:\\Users\\HP\\Desktop\\Final_Year_Project\\Models\\meta_modelForEFFandRes.h5')




@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return {'error': 'No file uploaded'}, 400

    file = request.files['file']
    # Do something with the file, e.g. save it to disk or process it
    file_bytes = file.read()

    # Convert the bytes to a numpy array
    np_arr = np.frombuffer(file_bytes, np.uint8)

    # Decode the numpy array into an image
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    resized_image = cv2.resize(img, (225, 225))
    image_reshaped = np.reshape(resized_image, (1, 225, 225, 3))
    eff_input = Base_effecientnet.predict(image_reshaped)
    res_input = Base_resNet.predict(image_reshaped)
    meta_input = concatenate([eff_input, res_input], axis=1)

    predicted_value=Ensemble_model.predict(meta_input)
    
   
    response = jsonify({'predicted_value': predicted_value.tolist()})
   
    return response




if __name__ == '__main__':
    app.run()
