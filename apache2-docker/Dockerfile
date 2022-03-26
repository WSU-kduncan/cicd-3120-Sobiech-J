FROM httpd:latest

RUN rm /usr/local/apache2/htdocs/index.html
RUN rm /usr/local/apache2/conf/httpd.conf

COPY website /usr/local/apache2/website
COPY httpd.conf /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD httpd
