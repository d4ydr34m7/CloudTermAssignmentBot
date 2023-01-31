from flask import Flask, request
from pathlib import Path
import requests

app = Flask(__name__)

@app.route("/checksum", methods=["POST"])
def fileValidation():
        file = request.json['file']

        # https://stackoverflow.com/questions/9573244/how-to-check-if-the-string-is-empty 
        # https://www.geeksforgeeks.org/python-program-to-check-if-string-is-empty-or-not/
        if(not(file and file.strip()) or file is None): 
            return {"file": "null", "error": "Invalid JSON input."}
  
        # https://stackoverflow.com/questions/8933237/how-do-i-check-if-directory-exists-in-python
        filePath=Path('/etc/data/'+file)
        checkIfFileExists=filePath.exists()

        if checkIfFileExists:
            result = requests.get(url="http://container2:5001/",params={"file":file})
            return result.json()
        else:
            return {"file":file, "error":"File Not Found."}

            
        
            