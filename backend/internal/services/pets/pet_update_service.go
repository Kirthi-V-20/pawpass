package pets

import (
	"context"
	"strings"

	"pawpass/backend/internal/models"
)

func (s *PetService) Update(
	ctx context.Context,
	pet *models.Pet,
) error {
	if strings.TrimSpace(pet.ID) == "" {
		return ErrInvalidPetID
	}

	if err := normalizePet(pet); err != nil {
		return err
	}

	return s.Repository.Update(ctx, pet)
}
