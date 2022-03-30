FROM ubuntu/apache2:latest

RUN rm /var/www/html/index.html
RUN rm /etc/apache2/sites-available/000-default.conf

COPY website /var/www/html/website
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80
CMD apachectl -D FOREGROUND
