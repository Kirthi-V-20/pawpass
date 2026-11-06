package dto

import "time"

type PetResponseDTO struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Species     string     `json:"species"`
	Breed       *string    `json:"breed"`
	Gender      string     `json:"gender"`
	DateOfBirth *time.Time `json:"dateOfBirth"`
	Color       *string    `json:"color"`
	Weight      *float64   `json:"weight"`
	Notes       *string    `json:"notes"`
	PhotoURL    *string    `json:"photoUrl"`
	Status      string     `json:"status"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}
