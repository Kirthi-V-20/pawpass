package pets

import (
	"net/http"
	"strings"

	"pawpass/backend/internal/dto"
	"pawpass/backend/internal/middleware"
	"pawpass/backend/internal/models"
)

func (h *PetHandler) Update(w http.ResponseWriter, r *http.Request) {
	ownerID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		writePetError(w, http.StatusUnauthorized, "UNAUTHORIZED")
		return
	}

	petID := r.PathValue("id")
	if !uuidPattern.MatchString(petID) {
		writePetError(w, http.StatusBadRequest, "INVALID_ID")
		return
	}

	var request dto.PetUpdateRequestDTO
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
		ID:          petID,
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

	if err := h.Service.Update(r.Context(), pet); err != nil {
		writeServiceError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, petResponse(pet))
}
