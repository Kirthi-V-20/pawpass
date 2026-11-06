package models

import "time"

type Pet struct {
	ID          string     `json:"id"`
	QRCodeID    string     `json:"qrCodeId"`
	OwnerID     string     `json:"ownerId"`
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
