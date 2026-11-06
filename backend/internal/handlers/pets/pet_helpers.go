package pets

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"

	"pawpass/backend/internal/dto"
	"pawpass/backend/internal/models"
	petrepo "pawpass/backend/internal/repository/pets"
	petservices "pawpass/backend/internal/services/pets"
)

type PetHandler struct {
	Service *petservices.PetService
}

var uuidPattern = regexp.MustCompile(
	`(?i)^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`,
)

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func writePetError(w http.ResponseWriter, status int, code string) {
	writeJSON(w, status, map[string]string{"error": code})
}

func decodeJSON(r *http.Request, destination any) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(destination); err != nil {
		return err
	}

	var extra any
	if err := decoder.Decode(&extra); !errors.Is(err, io.EOF) {
		return errors.New("request must contain one JSON object")
	}

	return nil
}

func parseDateOfBirth(value *string) (*time.Time, error) {
	if value == nil || strings.TrimSpace(*value) == "" {
		return nil, nil
	}

	parsed, err := time.Parse("2006-01-02", strings.TrimSpace(*value))
	if err != nil {
		return nil, petservices.ErrInvalidPetData
	}

	return &parsed, nil
}

func petResponse(pet *models.Pet) dto.PetResponseDTO {
	return dto.PetResponseDTO{
		ID:          pet.ID,
		Name:        pet.Name,
		Species:     pet.Species,
		Breed:       pet.Breed,
		Gender:      pet.Gender,
		DateOfBirth: pet.DateOfBirth,
		Color:       pet.Color,
		Weight:      pet.Weight,
		Notes:       pet.Notes,
		PhotoURL:    pet.PhotoURL,
		Status:      pet.Status,
		CreatedAt:   pet.CreatedAt,
		UpdatedAt:   pet.UpdatedAt,
	}
}

func writeServiceError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, petservices.ErrInvalidPetData):
		writePetError(w, http.StatusBadRequest, "INVALID_PET_DATA")
	case errors.Is(err, petservices.ErrInvalidPetID):
		writePetError(w, http.StatusBadRequest, "INVALID_ID")
	case errors.Is(err, petrepo.ErrPetNotFound):
		writePetError(w, http.StatusNotFound, "PET_NOT_FOUND")
	default:
		writePetError(w, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR")
	}
}
