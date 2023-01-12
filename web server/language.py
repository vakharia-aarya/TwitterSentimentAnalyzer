from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import string

def detect_language(text):
    if isinstance(text, str):
        try:
            text.encode('ascii')
        except UnicodeEncodeError:
            return False

    for ch in text:
        if ch not in string.printable:
            return False
    return True    

def get_sentiment(text):
    analyzer = SentimentIntensityAnalyzer()
    vs = analyzer.polarity_scores(text)
    # print("{:-<65} {}".format(text, str(vs)))

    mood = ""

    if vs['compound'] >= 0.05:
        mood = 'POSITIVE'
    elif vs['compound'] > -0.05 and vs['compound'] < 0.05:
        mood = 'NEUTRAL'
    else:
        mood = 'NEGATIVE'
    

    prediction = {
        'sentiment_score':{
            "positive": vs['pos'],
            "neutral": vs['neu'],
            "negative": vs['neg']
        },

        'detected_mood':mood
    }  
    return prediction