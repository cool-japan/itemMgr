FROM nginx
COPY ./*.js /usr/share/nginx/html/
COPY ./*.html /usr/share/nginx/html/
ARG APP_SERVER=${APP_SERVER}
RUN /bin/sed -i -e "s/localhost:8000/${APP_SERVER}/" /usr/share/nginx/html/*.js 
