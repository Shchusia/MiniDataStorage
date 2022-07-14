from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import BackConfig

config = BackConfig()


def get_connection_string(
    db_connection_string: str = config.database_url, is_async: bool = True
) -> str:
    parts = db_connection_string.split("://")
    con_data = ""
    if len(parts) == 2:
        con_data = parts[1]
    elif len(parts) == 1:
        con_data = parts[0]
    else:
        raise ValueError("Incorrect structe connection string")
    driver = config.async_db_driver if is_async else config.sync_db_driver
    return driver + "://" + con_data


engine_async = create_async_engine(
    get_connection_string(config.database_url, is_async=True),
    echo=True,
    # connect_args={"check_same_thread": False}
)
async_session = sessionmaker(
    bind=engine_async, class_=AsyncSession, expire_on_commit=False
)

engine = create_engine(
    get_connection_string(config.database_url, is_async=False),
)
sync_session = sessionmaker(
    bind=engine,
    autocommit=False,
)

Base = declarative_base()


# Dependency
def get_db() -> Session:
    """
    Dependency for get session db
    :yield: yield Session for execution queries
    :ryield: Session
    """
    with sync_session() as session:
        yield session
