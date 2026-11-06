package pets

import (
	"context"

	"pawpass/backend/internal/models"
)

func (s *PetService) ListByOwner(
	ctx context.Context,
	ownerID string,
) ([]models.Pet, error) {
	return s.Repository.ListByOwner(ctx, ownerID)
}
