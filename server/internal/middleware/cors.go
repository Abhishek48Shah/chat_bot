package middleware

import "net/http"

func (m *Middleware) CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173/")
		w.Header().Set("Access-Control-Allow-Method", "POST,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "multipart/form-data,Content-Type")
		w.Header().Set("Access-Control-Max-Age", "7200")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
