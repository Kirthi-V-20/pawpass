package pets

import (
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrPetNotFound = errors.New("pet not found")

type PetRepository struct {
	DB *pgxpool.Pool
}

func NewPetRepository(db *pgxpool.Pool) *PetRepository {
	return &PetRepository{
		DB: db,
	}
}
