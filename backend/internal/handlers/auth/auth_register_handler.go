package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"pawpass/backend/internal/auth"

	"github.com/jackc/pgx/v5/pgconn"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserResponse struct {
	ID        string    `json:"id"`
	FullName  string    `json:"fullName"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
}

type RegisterResponse struct {
	Token     string       `json:"token"`
	ExpiresAt time.Time    `json:"expiresAt"`
	User      UserResponse `json:"user"`
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)

	var req RegisterRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid JSON request")
		return
	}

	req.FullName = strings.TrimSpace(req.FullName)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.FullName == "" || req.Email == "" || req.Password == "" {
		writeJSONError(
			w,
			http.StatusBadRequest,
			"Full name, email, and password are required",
		)
		return
	}

	if len(req.FullName) > 150 || len(req.Email) > 255 {
		writeJSONError(
			w,
			http.StatusBadRequest,
			"Full name or email is too long",
		)
		return
	}

	if !strings.Contains(req.Email, "@") {
		writeJSONError(
			w,
			http.StatusBadRequest,
			"Please provide a valid email address",
		)
		return
	}

	if len(req.Password) < 8 || len(req.Password) > 72 {
		writeJSONError(
			w,
			http.StatusBadRequest,
			"Password must be between 8 and 72 bytes",
		)
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		writeJSONError(
			w,
			http.StatusInternalServerError,
			"Could not process password",
		)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var user UserResponse

	err = h.DB.QueryRow(
		ctx,
		`INSERT INTO users (full_name, email, password_hash)
		 VALUES ($1, $2, $3)
		 RETURNING id::text, full_name, email, created_at`,
		req.FullName,
		req.Email,
		string(passwordHash),
	).Scan(
		&user.ID,
		&user.FullName,
		&user.Email,
		&user.CreatedAt,
	)

	if err != nil {
		if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
			writeJSONError(
				w,
				http.StatusConflict,
				"An account with this email already exists",
			)
			return
		}

		writeJSONError(
			w,
			http.StatusInternalServerError,
			"Database operation failed",
		)
		return
	}

	token, expiresAt, err := auth.GenerateToken(user.ID)
	if err != nil {
		writeJSONError(
			w,
			http.StatusInternalServerError,
			"Could not create authentication token",
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	_ = json.NewEncoder(w).Encode(RegisterResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User:      user,
	})
}
