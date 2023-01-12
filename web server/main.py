from flask import Flask, request
# from flask_cors import CORS, cross_origin
import language
import json

app = Flask(__name__)
# CORS(app)


@app.route("/")
def main():
    return "No Content here!"


@app.route('/api/language-detection',methods =['POST'])
def language_detection():
    if request.method == 'POST':
        data = request.json
        res = list()

        for tweets in data:
            is_english = language.detect_language(tweets['tweet_text'])
            res.append(
                {
                    'tweet_text': tweets['tweet_text'],
                    "is_english": is_english
                }
            )

        return json.dumps(res,ensure_ascii=False).encode('utf8')

@app.route('/api/sentiment-score', methods=['POST'])
def language_sentiment():
    if request.method == 'POST':
        data = request.json
        res = list()

        for tweets in data:
            sentiment = language.get_sentiment(tweets['tweet_text'])
            res.append(
                {
                    'tweet_text': tweets['tweet_text'],
                    'sentiment_score': sentiment['sentiment_score'],
                    'detected_mood': sentiment['detected_mood']
                    
                }
            )

        return json.dumps(res,ensure_ascii=False).encode('utf8')


# if __name__ == "__main__":
#     app.run(debug=True)