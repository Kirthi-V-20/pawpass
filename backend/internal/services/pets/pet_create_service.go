package pets

import (
	"context"

	"pawpass/backend/internal/models"
)

func (s *PetService) Create(
	ctx context.Context,
	pet *models.Pet,
) error {
	if err := normalizePet(pet); err != nil {
		return err
	}

	return s.Repository.Create(ctx, pet)
}
