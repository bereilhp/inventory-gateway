build:
	docker build -t gwms .

up: 
	docker run -p 3000:3456 --name gateway -d gwms

down:
	docker stop gateway
	
clean:
	docker stop gateway && docker rm gateway
	docker rmi gwms
	docker volume prune -f

dev: clean build up
