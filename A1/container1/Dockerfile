FROM python
WORKDIR /usr/src/app
COPY . .
RUN pip3 install --no-cache-dir -r requirements.txt
EXPOSE 5000
CMD ["python" , "-m", "flask","run","--host=0.0.0.0","-p 5000"]