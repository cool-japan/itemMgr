FROM python:3.9
COPY .env ./
COPY requirements.txt ./
RUN pip install -r requirements.txt
WORKDIR /usr/src/app
COPY ./api/DjangoAPI/ ./
