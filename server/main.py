from flask import Flask,render_template
from flask_cors import CORS

cors=CORS(app,origin="*")

app=Flask(__name__)

@app.route("/",methods=['GET'])

def users():
    return "dashboard"
if __name__=="__main__":
    app.run(debug=True)