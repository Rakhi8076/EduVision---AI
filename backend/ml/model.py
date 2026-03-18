from sentence_transformers import SentenceTransformer

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Style reference
style_text_map = {
    "visual": "I learn through images, diagrams, and videos",
    "reading": "I learn by reading books and written notes",
    "auditory": "I learn by listening and discussions",
    "kinesthetic": "I learn by doing practical work"
}

# Precompute embeddings
style_embeddings = {
    style: model.encode(text)
    for style, text in style_text_map.items()
}