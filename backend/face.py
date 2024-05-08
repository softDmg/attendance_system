import face_recognition
import os

KNOWN_FACES_DIR = 'C:/Users/Etudiant FST/Desktop/project2/backend/faces' # Directory containing the known faces
UNKNOWN_FACES_DIR = 'unknown_faces'  # Directory containing the unknown faces
TOLERANCE = 0.6  # Lower tolerance means stricter face recognition
MODEL = 'cnn'  # 'cnn' for GPU, 'hog' for CPU

# Load the known faces and their names
known_faces = []
known_names = []

for name in os.listdir(KNOWN_FACES_DIR):
    for filename in os.listdir(f'{KNOWN_FACES_DIR}/{name}'):
        image = face_recognition.load_image_file(f'{KNOWN_FACES_DIR}/{name}/{filename}')
        encoding = face_recognition.face_encodings(image)[0]
        known_faces.append(encoding)
        known_names.append(name)

def recognize_faces(image_path):
    # Load the unknown image
    unknown_image = face_recognition.load_image_file(image_path)
    unknown_encodings = face_recognition.face_encodings(unknown_image)

    face_names = []
    for encoding in unknown_encodings:
        # Compare the unknown face with known faces
        results = face_recognition.compare_faces(known_faces, encoding, TOLERANCE)
        name = 'Unknown'

        if True in results:
            match_index = results.index(True)
            name = known_names[match_index]

        face_names.append(name)

    return face_names