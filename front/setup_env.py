import os

MAIN_PREFIX_VARIABLES = "REACT_APP_"

with open(".env", "w+") as file:
    for key, val in os.environ.items():
        if MAIN_PREFIX_VARIABLES in key:
            file.write(key + "=" + val + "\r\n")
