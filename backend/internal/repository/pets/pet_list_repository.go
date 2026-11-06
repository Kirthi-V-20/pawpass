package pets

import (
	"context"

	"pawpass/backend/internal/models"
)

func (r *PetRepository) ListByOwner(
	ctx context.Context,
	ownerID string,
) ([]models.Pet, error) {
	query := `
		SELECT ` + petColumns + `
		FROM pets p
		JOIN qr_codes q ON q.pet_id = p.id
		WHERE p.owner_id = $1
		ORDER BY p.created_at DESC
	`

	rows, err := r.DB.Query(ctx, query, ownerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	petList := make([]models.Pet, 0)

	for rows.Next() {
		pet, err := scanPet(rows)
		if err != nil {
			return nil, err
		}

		petList = append(petList, *pet)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return petList, nil
}
