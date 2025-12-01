from mangum import Mangum
import json

try:
    from app.main import app
    handler = Mangum(app)
except Exception as e:
    import traceback
    trace = traceback.format_exc()
    def handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "text/plain"},
            "body": f"Import Error: {str(e)}\n{trace}"
        }
