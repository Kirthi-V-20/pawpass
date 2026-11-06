package pets

import (
	"context"
	"errors"

	"pawpass/backend/internal/models"

	"github.com/jackc/pgx/v5"
)

func (r *PetRepository) Update(
	ctx context.Context,
	pet *models.Pet,
) error {
	query := `
		UPDATE pets
		SET
			name = $1,
			species = $2,
			breed = $3,
			gender = $4,
			date_of_birth = $5,
			color = $6,
			weight = $7,
			notes = $8,
			photo_url = $9,
			status = $10,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $11 AND owner_id = $12
		RETURNING ` + petColumns

	updatedPet, err := scanPet(r.DB.QueryRow(
		ctx,
		query,
		pet.Name,
		pet.Species,
		pet.Breed,
		pet.Gender,
		pet.DateOfBirth,
		pet.Color,
		pet.Weight,
		pet.Notes,
		pet.PhotoURL,
		pet.Status,
		pet.ID,
		pet.OwnerID,
	))
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrPetNotFound
	}
	if err != nil {
		return err
	}

	*pet = *updatedPet

	return nil
}
