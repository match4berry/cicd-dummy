package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// HealthResponse represents the health check response
type HealthResponse struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
	Message   string `json:"message"`
}

// Health check handler
func healthHandler(w http.ResponseWriter, r *http.Request) {
	response := HealthResponse{
		Status:    "ok",
		Timestamp: time.Now().Format(time.RFC3339),
		Message:   "Server is healthy and running",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Ping handler (alternative endpoint)
func pingHandler(w http.ResponseWriter, r *http.Request) {
	response := map[string]string{
		"message": "pong",
		"status":  "ok",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func main() {
	// Create a new ServeMux
	mux := http.NewServeMux()

	// Register health endpoints
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/ping", pingHandler)

	// Server configuration
	port := ":8080"

	fmt.Printf("🚀 Server starting on port %s\n", port)
	fmt.Println("📍 Available endpoints:")
	fmt.Println("   GET /health - Health check")
	fmt.Println("   GET /ping   - Ping endpoint")
	fmt.Println("\n💡 Test with:")
	fmt.Println("   curl http://localhost:8080/health")
	fmt.Println("   curl http://localhost:8080/ping")

	// Start the server
	log.Fatal(http.ListenAndServe(port, mux))
}
