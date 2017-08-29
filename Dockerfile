FROM python:3.6

RUN apt-get -y update && \
    apt-get install unzip sudo


RUN mkdir /tyra
ADD ./ /tyra/

WORKDIR /tyra/frontend

RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
    apt-get install -y nodejs && \
    npm cache clean -f && \
    npm install  -g n && \
    n stable && \
    npm install npm@latest -g && \
    npm install && \
    npm run build

WORKDIR /tyra

RUN pip install --no-cache-dir -r requirements.txt

ENTRYPOINT [ "python" ]
CMD [ "run_webapp.py" ]
