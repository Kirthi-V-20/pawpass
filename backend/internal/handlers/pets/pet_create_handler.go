package pets

import (
	"log"
	"net/http"
	"strings"

	"pawpass/backend/internal/dto"
	"pawpass/backend/internal/middleware"
	"pawpass/backend/internal/models"
)

func (h *PetHandler) Create(w http.ResponseWriter, r *http.Request) {
	ownerID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		writePetError(w, http.StatusUnauthorized, "UNAUTHORIZED")
		return
	}

	var request dto.PetCreateRequestDTO
	if err := decodeJSON(r, &request); err != nil {
		writePetError(w, http.StatusBadRequest, "INVALID_JSON")
		return
	}

	dateOfBirth, err := parseDateOfBirth(request.DateOfBirth)
	if err != nil {
		writeServiceError(w, err)
		return
	}

	pet := &models.Pet{
		OwnerID:     ownerID,
		Name:        request.Name,
		Species:     request.Species,
		Breed:       request.Breed,
		Gender:      request.Gender,
		DateOfBirth: dateOfBirth,
		Color:       request.Color,
		Weight:      request.Weight,
		Notes:       request.Notes,
		PhotoURL:    request.PhotoURL,
		Status:      strings.TrimSpace(request.Status),
	}

	if err := h.Service.Create(r.Context(), pet); err != nil {
		log.Printf("pet creation failed: %v", err)
		writeServiceError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, petResponse(pet))
}
