package pets

import (
	"context"
	"errors"

	"pawpass/backend/internal/models"

	"github.com/jackc/pgx/v5"
)

func (r *PetRepository) GetByIDAndOwner(
	ctx context.Context,
	petID string,
	ownerID string,
) (*models.Pet, error) {
	query := `
		SELECT ` + petColumns + `
		FROM pets p
		JOIN qr_codes q ON q.pet_id = p.id
		WHERE p.id = $1 AND p.owner_id = $2
	`

	pet, err := scanPet(
		r.DB.QueryRow(ctx, query, petID, ownerID),
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrPetNotFound
	}
	if err != nil {
		return nil, err
	}

	return pet, nil
}
