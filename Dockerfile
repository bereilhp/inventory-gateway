FROM node:20  
WORKDIR /app  
COPY package*.json ./  
ENV PORT=3456
ENV MONGODB_URI=
RUN npm i  
COPY . .  
EXPOSE 3456
CMD ["npm", "start"]