package pets

import (
	"pawpass/backend/internal/models"

	"github.com/jackc/pgx/v5"
)

const petColumns = `
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
`

func scanPet(row pgx.Row) (*models.Pet, error) {
	var pet models.Pet

	err := row.Scan(
		&pet.ID,
		&pet.OwnerID,
		&pet.Name,
		&pet.Species,
		&pet.Breed,
		&pet.Gender,
		&pet.DateOfBirth,
		&pet.Color,
		&pet.Weight,
		&pet.Notes,
		&pet.PhotoURL,
		&pet.Status,
		&pet.CreatedAt,
		&pet.UpdatedAt,
		&pet.QRCodeID,
	)
	if err != nil {
		return nil, err
	}

	return &pet, nil
}