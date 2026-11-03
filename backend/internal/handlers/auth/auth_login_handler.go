package auth

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"pawpass/backend/internal/auth"

	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token     string       `json:"token"`
	ExpiresAt time.Time    `json:"expiresAt"`
	User      UserResponse `json:"user"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)

	var req LoginRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, "Invalid JSON request")
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if req.Email == "" || req.Password == "" {
		writeJSONError(
			w,
			http.StatusBadRequest,
			"Email and password are required",
		)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var user UserResponse
	var passwordHash string

	err := h.DB.QueryRow(
		ctx,
		`SELECT id::text, full_name, email, password_hash, created_at
		 FROM users
		 WHERE email = $1`,
		req.Email,
	).Scan(
		&user.ID,
		&user.FullName,
		&user.Email,
		&passwordHash,
		&user.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeJSONError(
				w,
				http.StatusUnauthorized,
				"Invalid email or password",
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

	if err := bcrypt.CompareHashAndPassword(
		[]byte(passwordHash),
		[]byte(req.Password),
	); err != nil {
		writeJSONError(
			w,
			http.StatusUnauthorized,
			"Invalid email or password",
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
	w.WriteHeader(http.StatusOK)

	_ = json.NewEncoder(w).Encode(LoginResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User:      user,
	})
}
