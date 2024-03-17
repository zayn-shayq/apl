import sys
import pickle
import json

input_str = sys.stdin.read()
input_data = json.loads(input_str)

# Assuming 'input_data' is a dictionary like {"f1": 0, "f2": 0, ...}
# Convert it to an array-like structure in the correct order of features
# This step depends on the exact order and number of features your model expects
features = [input_data["feature1"], input_data["feature2"], input_data["feature3"], input_data["feature4"], input_data["feature5"], input_data["feature6"]]

# Load the model
with open('modelNew.pkl', 'rb') as file:
    model = pickle.load(file)

# Make a prediction - note that 'features' is wrapped in another list to create a 2D array-like structure
prediction = model.predict([features])

# Print the prediction as JSON
print(json.dumps({'prediction': prediction.tolist()}))
