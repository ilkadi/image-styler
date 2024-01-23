FROM python:3.9
RUN apt-get update && apt-get install -y libgl1-mesa-dev

COPY ./app /app
WORKDIR /app
RUN pip install -r requirements.txt

EXPOSE 3001