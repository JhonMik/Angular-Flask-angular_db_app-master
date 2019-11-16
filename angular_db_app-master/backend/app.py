from main import create_app
from waitress import serve

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=8080)
