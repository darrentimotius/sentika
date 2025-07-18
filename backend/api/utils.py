import re

# Casefolding
def casefold_text(text):
    return text.lower()

# Remove URLs
def remove_urls(text):
    return re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)

# Remove extra whitespace
def remove_extra_whitespace(text):
    return ' '.join(text.split())

# Remove repeated characters
def remove_repeated_characters(text):
    return re.sub(r'(.)\1{2,}', r'\1\1', text)

# Remove emojis
def remove_emojis(text):
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F700-\U0001F77F"  # alchemical symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "]+", flags=re.UNICODE)
    return emoji_pattern.sub(r'', text)

def preprocess_text(text):
    text = casefold_text(text)
    text = remove_urls(text)
    text = remove_extra_whitespace(text)
    text = remove_repeated_characters(text)
    text = remove_emojis(text)
    return text