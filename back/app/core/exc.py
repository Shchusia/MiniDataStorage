from app.models.general_response import ErrorModel


class RequestException(Exception):
    def __init__(self, error_model: ErrorModel):
        self.error = error_model
