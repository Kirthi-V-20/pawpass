package pets

import (
	"net/http"

	"pawpass/backend/internal/middleware"
)

func (h *PetHandler) Get(w http.ResponseWriter, r *http.Request) {
	ownerID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		writePetError(w, http.StatusUnauthorized, "UNAUTHORIZED")
		return
	}

	petID := r.PathValue("id")
	if !uuidPattern.MatchString(petID) {
		writePetError(w, http.StatusBadRequest, "INVALID_ID")
		return
	}

	pet, err := h.Service.GetByIDAndOwner(
		r.Context(),
		petID,
		ownerID,
	)
	if err != nil {
		writeServiceError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, petResponse(pet))
}
