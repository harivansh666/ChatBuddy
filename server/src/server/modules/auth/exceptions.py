from fastapi import status

from server.core.exceptions import AppException


class InvalidCredentialsError(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    code = "INVALID_CREDENTIALS"
    message = "Invalid email or password."


class InvalidTokenError(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    code = "INVALID_TOKEN"
    message = "Could not validate credentials."


class TokenExpiredError(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    code = "TOKEN_EXPIRED"
    message = "Authentication token has expired."


class InactiveUserError(AppException):
    status_code = status.HTTP_403_FORBIDDEN
    code = "INACTIVE_USER"
    message = "User account is inactive."
