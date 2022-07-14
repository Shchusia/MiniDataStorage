FROM python:3.9

ARG work_dir="/back/"
WORKDIR $work_dir

RUN apt -y update && apt -y install apt-transport-https curl git nano

COPY . .

RUN pip install --upgrade --no-cache-dir -r requirements/base.txt

EXPOSE 8000

CMD python ./init_alembic.py && alembic upgrade head && python ./init_admin.py && uvicorn app.main:APP --workers 4 --port 8000 --host 0.0.0.0
