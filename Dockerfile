# Utilise l'image officielle Nginx comme image de base
FROM nginx:alpine

# Copie le contenu du répertoire local dans le répertoire Nginx par défaut
COPY . /usr/share/nginx/html

# Expose le port 80 pour le serveur Nginx
EXPOSE 80

# Démarre Nginx
CMD ["nginx", "-g", "daemon off;"]
