package pets

import (
	"errors"

	petrepo "pawpass/backend/internal/repository/pets"
)

var (
	ErrInvalidPetData = errors.New("invalid pet data")
	ErrInvalidPetID   = errors.New("invalid pet ID")
	ErrPetNotFound    = petrepo.ErrPetNotFound
)

type PetService struct {
	Repository *petrepo.PetRepository
}

func NewPetService(repo *petrepo.PetRepository) *PetService {
	return &PetService{
		Repository: repo,
	}
}
