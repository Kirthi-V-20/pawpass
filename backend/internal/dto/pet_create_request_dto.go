package dto

type PetCreateRequestDTO struct {
	Name        string   `json:"name"`
	Species     string   `json:"species"`
	Breed       *string  `json:"breed"`
	Gender      string   `json:"gender"`
	DateOfBirth *string  `json:"dateOfBirth"`
	Color       *string  `json:"color"`
	Weight      *float64 `json:"weight"`
	Notes       *string  `json:"notes"`
	PhotoURL    *string  `json:"photoUrl"`
	Status      string   `json:"status"`
}
