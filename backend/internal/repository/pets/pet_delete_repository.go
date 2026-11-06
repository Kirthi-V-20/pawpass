package pets

import "context"

func (r *PetRepository) Delete(
	ctx context.Context,
	petID string,
	ownerID string,
) error {
	query := `
		DELETE FROM pets
		WHERE id = $1 AND owner_id = $2
	`

	result, err := r.DB.Exec(ctx, query, petID, ownerID)
	if err != nil {
		return err
	}

	if result.RowsAffected() == 0 {
		return ErrPetNotFound
	}

	return nil
}
