from flask import Flask,render_template,jsonify
from flask_cors import CORS



app=Flask(__name__)
cors=CORS(app,origin="*")

@app.route("/",methods=['GET'])

def users():
    return {
        "users":["ramu",
                 "shayamu",
                 "gyanesh"]
    }
if __name__=="__main__":
    app.run(debug=True)