FROM n8nio/n8n:latest

USER root
# Ensure node user owns the data directory
RUN mkdir -p /home/node/.n8n && chown -R node:node /home/node/.n8n

USER node

# Port 7860 for Hugging Face Spaces (or Render via PORT environment variable)
ENV N8N_PORT=7860
ENV N8N_HOST=0.0.0.0
ENV N8N_PROTOCOL=https
ENV GENERIC_TIMEZONE=Asia/Kolkata
ENV TZ=Asia/Kolkata

EXPOSE 7860

CMD ["n8n", "start"]
