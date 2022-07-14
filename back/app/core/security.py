"""
Security functions
"""

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """
    Generate password hash before saving use pwd_context.
    :param password: received password str
    :type password: str
    :return: hashed password
    :rtype: str
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password received from request and password from db
    :param plain_password: received from request
    :type plain_password: str
    :param hashed_password: received from db
    :type hashed_password: str
    :return:
    """
    return pwd_context.verify(plain_password, hashed_password)


if __name__ == "__main__":
    print(verify_password("123", get_password_hash("123")))
