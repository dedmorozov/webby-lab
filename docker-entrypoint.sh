set -e
: "${API_URL:=http://localhost:8000/api/v1}"
: "${AUTH_TOKEN:=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImNyZWF0ZWRBdCI6IjIwMjUtMDktMDJUMTY6MjA6MTAuNDEyWiIsInVwZGF0ZWRBdCI6IjIwMjUtMDktMDJUMTY6MjA6MTAuNDEyWiIsImlhdCI6MTc1NjgzMDAxMH0.-V7Qv2F--Pc-yCjnx_-jslO6WsQj3GpQ8aY9ypXSwo4}"

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = { API_URL: "${API_URL}", AUTH_TOKEN: "${AUTH_TOKEN}" };
EOF

nginx -g 'daemon off;'

