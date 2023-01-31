from flask import Flask, request
import hashlib

app= Flask(__name__)

@app.route("/",methods=["GET"])
def checksumCal():

    # https://stackoverflow.com/questions/26069714/flask-how-to-get-parameters-from-a-json-get-request
    fileN = request.args.get('file', None)

    # https://stackoverflow.com/questions/3431825/generating-an-md5-checksum-of-a-file
    generateMD5 = hashlib.md5()
    with open("/etc/data/"+fileN,"rb") as openFile:
        content = openFile.read()
        generateMD5.update(content)
    resultingChecksum = generateMD5.hexdigest()
   
    return {"file":fileN,"checksum": resultingChecksum}