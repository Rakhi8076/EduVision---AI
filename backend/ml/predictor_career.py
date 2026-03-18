
# ================= VALIDATION =================
def validate_scores(scores):
    return (
        isinstance(scores, list) and
        len(scores) == 6 and
        all(isinstance(x, (int, float)) and 0 <= x <= 10 for x in scores)
    )


# ================= PREDICTION =================
def predict_top_careers(model, scores):   # ✅ FIXED
    probs = model.predict_proba([scores])

    try:
        classes = model.classes_   # works if simple model
    except:
        classes = model.named_steps[list(model.named_steps.keys())[-1]].classes_

    top5 = sorted(
        zip(classes, probs[0]),
        key=lambda x: x[1],
        reverse=True
    )[:5]

    return [
        {
            "career": c,
            "confidence": round(p * 100, 2)
        }
        for c, p in top5
    ]