from sklearn.metrics.pairwise import cosine_similarity
from .model import model, style_embeddings

def predict_learning_style(user_answers):
    scores = {style: 0 for style in style_embeddings}

    for answer in user_answers:
        user_emb = model.encode(answer)

        for style, emb in style_embeddings.items():
            sim = cosine_similarity([user_emb], [emb])[0][0]
            scores[style] += sim

    predicted_style = max(scores, key=scores.get)

    # 🔥 ADD DETAILS
    details = {
        "visual": {
            "description": "You learn best through images, diagrams, and visual content.",
            "recommendations": ["Videos", "Mind maps", "Charts"]
        },
        "reading": {
            "description": "You prefer reading and writing notes.",
            "recommendations": ["Books", "Notes", "Articles"]
        },
        "auditory": {
            "description": "You learn best by listening and discussions.",
            "recommendations": ["Podcasts", "Lectures", "Group discussion"]
        },
        "kinesthetic": {
            "description": "You learn by doing and hands-on practice.",
            "recommendations": ["Projects", "Practice", "Experiments"]
        }
    }

    return {
        "style": predicted_style,
        "description": details[predicted_style]["description"],
        "recommendations": details[predicted_style]["recommendations"]
    }