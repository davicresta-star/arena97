#!/usr/bin/env python3
"""Dev server per Arena97 — disabilita la cache così le modifiche ai moduli
JS/CSS si vedono subito senza bisogno di cache-busting manuale (?v=)."""
import http.server
import socketserver

PORT = 4097


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class ThreadingServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with ThreadingServer(("", PORT), NoCacheHandler) as httpd:
        print(f"Arena97 dev server (no-cache) → http://localhost:{PORT}")
        httpd.serve_forever()
