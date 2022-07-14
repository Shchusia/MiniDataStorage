from abc import ABC


class StorageABC(ABC):
    """ """

    async def save(self):
        pass

    async def load(self):
        pass
