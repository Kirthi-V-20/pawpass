package pets

import (
	"context"
	"strings"
)

func (s *PetService) Delete(
	ctx context.Context,
	petID string,
	ownerID string,
) error {
	if strings.TrimSpace(petID) == "" {
		return ErrInvalidPetID
	}

	return s.Repository.Delete(ctx, petID, ownerID)
}
