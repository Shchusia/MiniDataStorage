from app.db.session import get_connection_string

url = get_connection_string(is_async=False)
path_to_config = "./alembic.ini"
with open(path_to_config, "r") as file:
    data_file = file.read()

data_file = data_file.format(str_connect_for_sqlalchemy=url)

with open(path_to_config, "w") as file:
    file.write(data_file)
