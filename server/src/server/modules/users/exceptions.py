from fastapi import status

from server.core.exceptions import AppException


class UserNotFoundException(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    code = "USER_NOT_FOUND"
    message = "User not found."


class UserAlreadyExistsException(AppException):
    status_code = status.HTTP_409_CONFLICT
    code = "USER_ALREADY_EXISTS"
    message = "A user with this email or username already exists."


class UserInactiveException(AppException):
    status_code = status.HTTP_403_FORBIDDEN
    code = "USER_INACTIVE"
    message = "User account is deactivated."
