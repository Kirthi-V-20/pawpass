package pets

import (
	"context"
	"strings"

	"pawpass/backend/internal/models"
)

func (s *PetService) GetByIDAndOwner(
	ctx context.Context,
	petID string,
	ownerID string,
) (*models.Pet, error) {
	if strings.TrimSpace(petID) == "" {
		return nil, ErrInvalidPetID
	}

	return s.Repository.GetByIDAndOwner(ctx, petID, ownerID)
}
