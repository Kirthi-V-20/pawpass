package pets

import (
	"strings"
	"time"

	"pawpass/backend/internal/models"
)

func normalizePet(pet *models.Pet) error {
	pet.Name = strings.TrimSpace(pet.Name)
	pet.Species = strings.TrimSpace(pet.Species)
	pet.Gender = strings.TrimSpace(pet.Gender)

	if pet.Name == "" || len(pet.Name) > 100 {
		return ErrInvalidPetData
	}

	if pet.Species == "" || len(pet.Species) > 50 {
		return ErrInvalidPetData
	}

	if pet.Gender != "Male" && pet.Gender != "Female" {
		return ErrInvalidPetData
	}

	if pet.Status == "" {
		pet.Status = "ACTIVE"
	}

	if pet.Status != "ACTIVE" &&
		pet.Status != "LOST" &&
		pet.Status != "FOUND" {
		return ErrInvalidPetData
	}

	if pet.Weight != nil && *pet.Weight < 0 {
		return ErrInvalidPetData
	}

	if pet.Breed != nil {
		value := strings.TrimSpace(*pet.Breed)
		if len(value) > 100 {
			return ErrInvalidPetData
		}
		pet.Breed = &value
	}

	if pet.Color != nil {
		value := strings.TrimSpace(*pet.Color)
		if len(value) > 100 {
			return ErrInvalidPetData
		}
		pet.Color = &value
	}

	if pet.DateOfBirth != nil && pet.DateOfBirth.After(time.Now()) {
		return ErrInvalidPetData
	}

	return nil
}
