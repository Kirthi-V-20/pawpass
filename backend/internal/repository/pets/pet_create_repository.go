package pets

import (
	"context"

	"pawpass/backend/internal/models"
)

func (r *PetRepository) Create(
	ctx context.Context,
	pet *models.Pet,
) error {
	tx, err := r.DB.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	query := `
		WITH new_pet AS (
			INSERT INTO pets (
				owner_id,
				name,
				species,
				breed,
				gender,
				date_of_birth,
				color,
				weight,
				notes,
				photo_url,
				status
			)
			VALUES (
				$1, $2, $3, $4, $5, $6,
				$7, $8, $9, $10, $11
			)
			RETURNING *
		),
		new_qr AS (
			INSERT INTO qr_codes (pet_id)
			SELECT id FROM new_pet
			RETURNING id, pet_id
		)
		SELECT
			p.id,
			p.owner_id,
			p.name,
			p.species,
			p.breed,
			p.gender,
			p.date_of_birth,
			p.color,
			p.weight,
			p.notes,
			p.photo_url,
			p.status,
			p.created_at,
			p.updated_at,
			q.id
		FROM new_pet p
		JOIN new_qr q ON q.pet_id = p.id
	`

	createdPet, err := scanPet(tx.QueryRow(
		ctx,
		query,
		pet.OwnerID,
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
	))
	if err != nil {
		return err
	}

	if err := tx.Commit(ctx); err != nil {
		return err
	}

	*pet = *createdPet

	return nil
}
