package pets

import (
	"net/http"

	"pawpass/backend/internal/middleware"
)

func (h *PetHandler) Delete(w http.ResponseWriter, r *http.Request) {
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

	if err := h.Service.Delete(r.Context(), petID, ownerID); err != nil {
		writeServiceError(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
